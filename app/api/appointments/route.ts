import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { checkAppointmentLimit, createUpgradeResponse } from "@/lib/plan-limits"

// GET - Listar agendamentos
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const professionalId = searchParams.get("professionalId")
    const date = searchParams.get("date")

    const appointments = await prisma.appointment.findMany({
      where: {
        businessId: user.businessId,
        ...(status && { status: status as any }),
        ...(professionalId && { professionalId }),
        ...(date && { date: new Date(date) }),
      },
      include: {
        customer: true,
        service: true,
        professional: true,
      },
      orderBy: [
        { date: "desc" },
        { startTime: "asc" }
      ]
    })

    return NextResponse.json({ 
      appointments: appointments.map(apt => ({
        ...apt,
        service: {
          ...apt.service,
          price: Number(apt.service.price)
        }
      }))
    })
    
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error)
    return NextResponse.json(
      { error: "Erro ao listar agendamentos" },
      { status: 500 }
    )
  }
}

// POST - Criar agendamento
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { customerId, serviceId, professionalId, date, startTime, notes } = await request.json()

    if (!customerId || !serviceId || !professionalId || !date || !startTime) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    // Validar data - não pode ser no passado
    const appointmentDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (appointmentDate < today) {
      return NextResponse.json(
        { error: "Não é possível criar agendamento em data passada" },
        { status: 400 }
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

    // Verificar limite de agendamentos
    const limitCheck = await checkAppointmentLimit(user.businessId)
    if (!limitCheck.allowed) {
      const business = await prisma.business.findUnique({
        where: { id: user.businessId },
        select: { plan: true }
      })
      return createUpgradeResponse("appointment", limitCheck.limit, business?.plan || "FREEMIUM")
    }

    // Buscar serviço para calcular endTime
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      )
    }

    // Calcular endTime baseado na duração do serviço - startTime e endTime são DateTime
    const [hours, minutes] = startTime.split(":").map(Number)
    
    // Create startTime as DateTime (combine date + time)
    const startDateTime = new Date(appointmentDate)
    startDateTime.setHours(hours, minutes, 0, 0)
    
    // Calculate endTime
    const endDateTime = new Date(startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + service.duration)

    // Verificar conflitos de horário
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId,
        date: appointmentDate,
        status: { notIn: ["CANCELLED"] },
        OR: [
          {
            AND: [
              { startTime: { lte: startDateTime } },
              { endTime: { gt: startDateTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endDateTime } },
              { endTime: { gte: endDateTime } }
            ]
          }
        ]
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: "Já existe um agendamento neste horário" },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        businessId: user.businessId,
        customerId,
        serviceId,
        professionalId,
        date: appointmentDate,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        customer: true,
        service: true,
        professional: true,
      }
    })

    return NextResponse.json({
      appointment,
      message: "Agendamento criado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    )
  }
}
