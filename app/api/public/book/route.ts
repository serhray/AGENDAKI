import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, serviceId, professionalId, date, time, customer } = body

    // Validação básica
    if (!businessId || !serviceId || !professionalId || !date || !time || !customer) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    if (!customer.name || !customer.phone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar minAdvanceBookingHours
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { minAdvanceBookingHours: true }
    })

    const [hours, minutes] = time.split(":").map(Number)
    const appointmentDateTime = new Date(date)
    appointmentDateTime.setHours(hours, minutes, 0, 0)

    const now = new Date()
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursDiff < (business?.minAdvanceBookingHours || 0)) {
      return NextResponse.json(
        { error: `É necessário agendar com pelo menos ${business?.minAdvanceBookingHours} horas de antecedência` },
        { status: 400 }
      )
    }

    // Verificar se o horário ainda está disponível
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

    const appointmentEnd = new Date(appointmentDateTime)
    appointmentEnd.setMinutes(appointmentEnd.getMinutes() + service.duration)

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId,
        status: { notIn: ["CANCELLED"] },
        OR: [
          {
            AND: [
              { startTime: { lte: appointmentEnd } },
              { endTime: { gte: appointmentDateTime } }
            ]
          }
        ]
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: "Este horário não está mais disponível" },
        { status: 409 }
      )
    }

    // Buscar ou criar cliente
    let existingCustomer = await prisma.customer.findFirst({
      where: {
        businessId,
        phone: customer.phone
      }
    })

    if (!existingCustomer) {
      existingCustomer = await prisma.customer.create({
        data: {
          businessId,
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null
        }
      })
    } else {
      // Atualizar dados do cliente se houver mudanças
      if (existingCustomer.name !== customer.name || existingCustomer.email !== customer.email) {
        existingCustomer = await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            name: customer.name,
            email: customer.email || existingCustomer.email
          }
        })
      }
    }

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        businessId,
        customerId: existingCustomer.id,
        serviceId,
        professionalId,
        date: appointmentDateTime,
        startTime: appointmentDateTime,
        endTime: appointmentEnd,
        status: "PENDING"
      },
      include: {
        customer: true,
        service: true,
        professional: true
      }
    })

    return NextResponse.json({ 
      success: true,
      appointment 
    })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    )
  }
}
