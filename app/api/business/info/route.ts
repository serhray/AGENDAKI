import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            planStatus: true,
            maxProfessionals: true,
            maxAppointmentsPerMonth: true,
            trialEndsAt: true,
            stripeCustomerId: true
          }
        }
      }
    })

    if (!user?.business) {
      return NextResponse.json({ error: "Negócio não encontrado" }, { status: 404 })
    }

    // Buscar contagens atuais
    const [professionalsCount, servicesCount] = await Promise.all([
      prisma.professional.count({ where: { businessId: user.business.id } }),
      prisma.service.count({ where: { businessId: user.business.id } })
    ])

    // Contar agendamentos do mês atual
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const appointmentsThisMonth = await prisma.appointment.count({
      where: {
        businessId: user.business.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    return NextResponse.json({
      business: user.business,
      usage: {
        professionals: {
          current: professionalsCount,
          limit: user.business.maxProfessionals
        },
        services: {
          current: servicesCount,
          limit: 9999 // Temporário até adicionar ao schema
        },
        appointments: {
          current: appointmentsThisMonth,
          limit: user.business.maxAppointmentsPerMonth
        }
      }
    })
  } catch (error) {
    console.error("Erro ao buscar informações do plano:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
