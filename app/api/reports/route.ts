import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "month"

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
    let startDate: Date
    let previousStartDate: Date
    let previousEndDate: Date

    // Definir período
    switch (period) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0))
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 1)
        previousEndDate = new Date(startDate)
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - now.getDay())
        startDate.setHours(0, 0, 0, 0)
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 7)
        previousEndDate = new Date(startDate)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1)
        previousEndDate = new Date(now.getFullYear(), 0, 1)
        break
      case "month":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }

    const endDate = new Date()

    // Buscar agendamentos do período atual
    const appointments = await prisma.appointment.findMany({
      where: {
        businessId: user.businessId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        service: true,
        customer: true
      }
    })

    // Buscar agendamentos do período anterior (para cálculo de crescimento)
    const previousAppointments = await prisma.appointment.findMany({
      where: {
        businessId: user.businessId,
        date: {
          gte: previousStartDate,
          lt: previousEndDate
        }
      },
      include: {
        service: true
      }
    })

    // Calcular receita
    const totalRevenue = appointments.reduce((sum, apt) => sum + Number(apt.service.price), 0)
    const previousRevenue = previousAppointments.reduce((sum, apt) => sum + Number(apt.service.price), 0)
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

    // Calcular agendamentos
    const confirmedCount = appointments.filter(a => a.status === "CONFIRMED").length
    const completedCount = appointments.filter(a => a.status === "COMPLETED").length
    const cancelledCount = appointments.filter(a => a.status === "CANCELLED").length
    const appointmentsGrowth = previousAppointments.length > 0 
      ? ((appointments.length - previousAppointments.length) / previousAppointments.length) * 100 
      : 0

    // Clientes únicos
    const uniqueCustomerIds = new Set(appointments.map(a => a.customerId))
    const previousCustomerIds = new Set(previousAppointments.map(a => a.customerId))
    const newCustomers = Array.from(uniqueCustomerIds).filter(id => !previousCustomerIds.has(id)).length
    const returningCustomers = uniqueCustomerIds.size - newCustomers
    const customersGrowth = previousCustomerIds.size > 0 
      ? ((uniqueCustomerIds.size - previousCustomerIds.size) / previousCustomerIds.size) * 100 
      : 0

    // Top serviços
    const servicesMap = new Map()
    appointments.forEach(apt => {
      const serviceName = apt.service.name
      const current = servicesMap.get(serviceName) || { count: 0, revenue: 0, name: serviceName }
      current.count++
      current.revenue += apt.service.price
      servicesMap.set(serviceName, current)
    })

    const topServices = Array.from(servicesMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(service => ({
        ...service,
        percentage: appointments.length > 0 ? (service.count / appointments.length) * 100 : 0
      }))

    // Top clientes
    const customersMap = new Map()
    appointments.forEach(apt => {
      const customerName = apt.customer.name
      const current = customersMap.get(customerName) || { name: customerName, appointments: 0, revenue: 0 }
      current.appointments++
      current.revenue += apt.service.price
      customersMap.set(customerName, current)
    })

    const topCustomers = Array.from(customersMap.values())
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 10)

    // Receita por dia
    const revenueByDayMap = new Map()
    appointments.forEach(apt => {
      const dateKey = new Date(apt.date).toISOString().split('T')[0]
      const current = revenueByDayMap.get(dateKey) || { date: dateKey, revenue: 0, appointments: 0 }
      current.revenue += apt.service.price
      current.appointments++
      revenueByDayMap.set(dateKey, current)
    })

    const revenueByDay = Array.from(revenueByDayMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))

    // Taxa de ocupação (simplificada - assumindo 10h de trabalho por dia)
    const daysSinceStart = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalPossibleSlots = daysSinceStart * 20 // ~20 slots de 30min por dia
    const occupancyRate = totalPossibleSlots > 0 ? (appointments.length / totalPossibleSlots) * 100 : 0

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        average: appointments.length > 0 ? totalRevenue / appointments.length : 0,
        growth: revenueGrowth
      },
      appointments: {
        total: appointments.length,
        confirmed: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount,
        growth: appointmentsGrowth
      },
      customers: {
        total: uniqueCustomerIds.size,
        new: newCustomers,
        returning: returningCustomers,
        growth: customersGrowth
      },
      topServices,
      topCustomers,
      revenueByDay,
      occupancyRate: Math.min(occupancyRate, 100)
    })
    
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error)
    return NextResponse.json(
      { error: "Erro ao buscar relatórios" },
      { status: 500 }
    )
  }
}
