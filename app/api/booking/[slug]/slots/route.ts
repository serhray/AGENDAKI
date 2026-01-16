import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get("date")
    const serviceId = searchParams.get("serviceId")
    const professionalId = searchParams.get("professionalId")

    if (!date || !serviceId || !professionalId) {
      return NextResponse.json(
        { error: "Parâmetros faltando" },
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

    // Get service duration
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

    // Get existing appointments for this professional on this date
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        professionalId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      },
      select: {
        date: true,
        service: {
          select: {
            duration: true
          }
        }
      }
    })

    // Generate time slots (8:00 - 18:00)
    const slots = []
    const startHour = 8
    const endHour = 18
    const slotInterval = 30 // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const slotTime = new Date(date)
        slotTime.setHours(hour, minute, 0, 0)

        // Check if slot is in the past
        const now = new Date()
        const minBookingTime = new Date(now.getTime() + business.minAdvanceBookingHours * 60 * 60 * 1000)
        
        if (slotTime < minBookingTime) {
          continue
        }

        // Check if slot conflicts with existing appointments
        const slotEndTime = new Date(slotTime.getTime() + service.duration * 60000)
        
        let isAvailable = true
        for (const appointment of existingAppointments) {
          const appointmentStart = new Date(appointment.date)
          const appointmentEnd = new Date(appointmentStart.getTime() + appointment.service.duration * 60000)

          // Check for overlap
          if (
            (slotTime >= appointmentStart && slotTime < appointmentEnd) ||
            (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd) ||
            (slotTime <= appointmentStart && slotEndTime >= appointmentEnd)
          ) {
            isAvailable = false
            break
          }
        }

        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time: timeString,
          available: isAvailable
        })
      }
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Erro ao buscar horários:", error)
    return NextResponse.json(
      { error: "Erro ao carregar horários" },
      { status: 500 }
    )
  }
}
