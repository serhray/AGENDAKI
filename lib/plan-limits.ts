import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Definição dos limites por plano
export const PLAN_LIMITS = {
  FREEMIUM: {
    maxProfessionals: 1,
    maxAppointmentsPerMonth: 20,
    features: ["Email notifications", "Basic reports"]
  },
  INICIAL: {
    maxProfessionals: 2,
    maxAppointmentsPerMonth: 9999,
    features: ["Email + SMS", "Monthly reports", "WhatsApp notifications"]
  },
  PROFESSIONAL: {
    maxProfessionals: 6,
    maxAppointmentsPerMonth: 9999,
    features: ["All INICIAL features", "Advanced reports", "API access"]
  },
  PREMIUM: {
    maxProfessionals: 15,
    maxAppointmentsPerMonth: 9999,
    features: ["All features", "Priority support", "Custom integrations"]
  }
}

export async function checkProfessionalLimit(businessId: string): Promise<{ 
  allowed: boolean; 
  current: number; 
  limit: number; 
  message?: string 
}> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { 
      plan: true, 
      maxProfessionals: true,
      _count: {
        select: { professionals: true }
      }
    }
  })

  if (!business) {
    return { allowed: false, current: 0, limit: 0, message: "Negócio não encontrado" }
  }

  const currentCount = business._count.professionals
  const limit = business.maxProfessionals

  if (currentCount >= limit) {
    return {
      allowed: false,
      current: currentCount,
      limit,
      message: `Você atingiu o limite de ${limit} profissionais do plano ${business.plan}. Faça upgrade para adicionar mais.`
    }
  }

  return { allowed: true, current: currentCount, limit }
}

export async function checkServiceLimit(businessId: string): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
  message?: string;
}> {
  // Temporariamente sempre permitir até schema ser sincronizado
  return { allowed: true, current: 0, limit: 9999 }
}

export async function checkAppointmentLimit(businessId: string): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
  message?: string;
}> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { 
      plan: true, 
      maxAppointmentsPerMonth: true 
    }
  })

  if (!business) {
    return { allowed: false, current: 0, limit: 0, message: "Negócio não encontrado" }
  }

  // Contar agendamentos do mês atual
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const currentCount = await prisma.appointment.count({
    where: {
      businessId,
      date: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth
      },
      status: { notIn: ["CANCELLED"] }
    }
  })

  const limit = business.maxAppointmentsPerMonth

  if (limit < 9999 && currentCount >= limit) {
    return {
      allowed: false,
      current: currentCount,
      limit,
      message: `Você atingiu o limite de ${limit} agendamentos mensais do plano ${business.plan}. Faça upgrade para continuar.`
    }
  }

  return { allowed: true, current: currentCount, limit }
}

export function createUpgradeResponse(type: "professional" | "appointment" | "service", limit: number, plan: string) {
  const messages = {
    professional: `Você atingiu o limite de ${limit} profissionais. Faça upgrade do seu plano.`,
    appointment: `Você atingiu o limite de ${limit} agendamentos mensais. Faça upgrade do seu plano.`,
    service: `Você atingiu o limite de ${limit} serviços. Faça upgrade do seu plano.`
  }

  return NextResponse.json({
    error: "PLAN_LIMIT_REACHED",
    type,
    limit,
    currentPlan: plan,
    message: messages[type],
    suggestedPlan: plan === "FREEMIUM" ? "INICIAL" : plan === "INICIAL" ? "PROFESSIONAL" : "PREMIUM",
    upgradeUrl: "/pricing"
  }, { status: 403 })
}
