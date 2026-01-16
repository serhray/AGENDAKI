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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { businessId: true }
    })

    if (!user?.businessId) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    const now = new Date()
    const startOfDay = new Date(now.setHours(0, 0, 0, 0))
    const endOfDay = new Date(now.setHours(23, 59, 59, 999))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    // Agendamentos de hoje
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        businessId: user.businessId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        service: true
      }
    })

    // Agendamentos do mês
    const monthAppointments = await prisma.appointment.findMany({
      where: {
        businessId: user.businessId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      include: {
        service: true,
        customer: true
      }
    })

    // Clientes únicos do mês
    const uniqueCustomers = new Set(monthAppointments.map(apt => apt.customerId))

    // Status dos agendamentos
    const allAppointments = await prisma.appointment.findMany({
      where: { businessId: user.businessId }
    })

    const statusCounts = {
      confirmed: allAppointments.filter(a => a.status === "CONFIRMED").length,
      pending: allAppointments.filter(a => a.status === "PENDING").length,
      cancelled: allAppointments.filter(a => a.status === "CANCELLED").length,
      completed: allAppointments.filter(a => a.status === "COMPLETED").length,
    }

    // Top serviços
    const servicesMap = new Map()
    monthAppointments.forEach(apt => {
      const serviceName = apt.service.name
      const current = servicesMap.get(serviceName) || { count: 0, revenue: 0, name: serviceName }
      current.count++
      current.revenue += Number(apt.service.price)
      servicesMap.set(serviceName, current)
    })

    const topServices = Array.from(servicesMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Agendamentos recentes
    const recentAppointments = await prisma.appointment.findMany({
      where: { businessId: user.businessId },
      include: {
        customer: true,
        service: true
      },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    return NextResponse.json({
      today: {
        appointments: todayAppointments.length,
        revenue: todayAppointments.reduce((sum, apt) => sum + Number(apt.service.price), 0)
      },
      month: {
        appointments: monthAppointments.length,
        revenue: monthAppointments.reduce((sum, apt) => sum + Number(apt.service.price), 0),
        customers: uniqueCustomers.size
      },
      appointments: statusCounts,
      topServices,
      recentAppointments: recentAppointments.map(apt => ({
        ...apt,
        service: {
          ...apt.service,
          price: Number(apt.service.price)
        }
      }))
    })
    
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    )
  }
}
