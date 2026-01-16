import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    // Buscar estatísticas globais
    const [
      totalBusinesses,
      totalUsers,
      totalAppointments,
      totalCustomers,
      totalProfessionals,
      totalServices
    ] = await Promise.all([
      prisma.business.count(),
      prisma.user.count(),
      prisma.appointment.count(),
      prisma.customer.count(),
      prisma.professional.count(),
      prisma.service.count()
    ])

    // Negócios por plano
    const businessesByPlan = await prisma.business.groupBy({
      by: ['plan'],
      _count: true
    })

    // Negócios criados nos últimos 30 dias
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newBusinesses = await prisma.business.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Agendamentos nos últimos 30 dias
    const recentAppointments = await prisma.appointment.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Receita total (estimada baseada nos planos)
    const businesses = await prisma.business.findMany({
      select: { plan: true }
    })

    const planPrices: Record<string, number> = {
      FREEMIUM: 0,
      INICIAL: 49,
      PROFESSIONAL: 99,
      PREMIUM: 199
    }

    const totalRevenue = businesses.reduce((sum, b) => {
      return sum + (planPrices[b.plan] || 0)
    }, 0)

    // Status dos agendamentos
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: true
    })

    return NextResponse.json({
      overview: {
        totalBusinesses,
        totalUsers,
        totalAppointments,
        totalCustomers,
        totalProfessionals,
        totalServices,
        totalRevenue
      },
      growth: {
        newBusinesses,
        recentAppointments
      },
      plans: businessesByPlan.map(item => ({
        plan: item.plan,
        count: item._count
      })),
      appointments: appointmentsByStatus.map(item => ({
        status: item.status,
        count: item._count
      }))
    })
    
  } catch (error) {
    console.error("Erro ao buscar estatísticas admin:", error)
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    )
  }
}
