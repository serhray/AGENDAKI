import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Find business by slug
    const business = await prisma.business.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        primaryColor: true,
        phone: true,
        email: true,
        address: true,
        minAdvanceBookingHours: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Get active services
    const services = await prisma.service.findMany({
      where: { 
        businessId: business.id,
        active: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true
      },
      orderBy: { name: "asc" }
    })

    // Get active professionals
    const professionals = await prisma.professional.findMany({
      where: { 
        businessId: business.id,
        active: true
      },
      select: {
        id: true,
        name: true
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({
      business,
      services: services.map(s => ({
        ...s,
        price: Number(s.price)
      })),
      professionals
    })
  } catch (error) {
    console.error("Erro ao buscar dados do negócio:", error)
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { serviceId, professionalId, date, time, customerName, customerPhone, customerEmail } = body

    // Validate required fields
    if (!serviceId || !professionalId || !date || !time || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      )
    }

    // Find business
    const business = await prisma.business.findUnique({
      where: { slug }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Check if service exists and belongs to business
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId: business.id,
        active: true
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      )
    }

    // Check if professional exists and belongs to business
    const professional = await prisma.professional.findFirst({
      where: {
        id: professionalId,
        businessId: business.id,
        active: true
      }
    })

    if (!professional) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      )
    }

    // Check if time slot is still available
    const appointmentDate = new Date(date)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId,
        date: appointmentDate,
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Este horário não está mais disponível" },
        { status: 400 }
      )
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        businessId: business.id,
        phone: customerPhone
      }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          businessId: business.id,
          name: customerName,
          phone: customerPhone,
          email: customerEmail || null
        }
      })
    } else {
      // Update customer info if different
      if (customer.name !== customerName || customer.email !== customerEmail) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: {
            name: customerName,
            email: customerEmail || customer.email
          }
        })
      }
    }

    // Calculate endTime - startTime and endTime are now DateTime
    const [hours, minutes] = time.split(':').map(Number)
    
    // Create startTime as DateTime (combine date + time)
    const startDateTime = new Date(appointmentDate)
    startDateTime.setHours(hours, minutes, 0, 0)
    
    // Calculate endTime
    const endDateTime = new Date(startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + service.duration)

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        serviceId: service.id,
        professionalId: professional.id,
        date: appointmentDate,
        startTime: startDateTime,
        endTime: endDateTime,
        status: "PENDING"
      }
    })

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        date: appointment.date,
        serviceName: service.name,
        professionalName: professional.name,
        price: service.price
      }
    })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json(
      { error: "Erro ao realizar agendamento" },
      { status: 500 }
    )
  }
}
