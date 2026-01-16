import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const businessId = searchParams.get("businessId")
    const serviceId = searchParams.get("serviceId")
    const professionalId = searchParams.get("professionalId")
    const dateStr = searchParams.get("date")

    if (!businessId || !serviceId || !professionalId || !dateStr) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios ausentes" },
        { status: 400 }
      )
    }

    const date = new Date(dateStr)
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

    // Buscar agendamentos do profissional para o dia
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
          notIn: ["CANCELLED"]
        }
      },
      select: {
        startTime: true,
        endTime: true
      }
    })

    // Gerar slots de 30 em 30 minutos (8h às 18h)
    const slots = []
    const startHour = 8
    const endHour = 18
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(date)
        slotTime.setHours(hour, minute, 0, 0)
        
        // Verificar se o slot está no passado
        const now = new Date()
        if (slotTime < now) {
          continue
        }

        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        
        // Verificar se há conflito com agendamentos existentes
        let isAvailable = true
        
        for (const appointment of existingAppointments) {
          const appointmentStart = new Date(appointment.startTime)
          const appointmentEnd = new Date(appointment.endTime)
          
          const slotEnd = new Date(slotTime)
          slotEnd.setMinutes(slotEnd.getMinutes() + service.duration)
          
          // Verificar sobreposição
          if (
            (slotTime >= appointmentStart && slotTime < appointmentEnd) ||
            (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
            (slotTime <= appointmentStart && slotEnd >= appointmentEnd)
          ) {
            isAvailable = false
            break
          }
        }
        
        slots.push({
          time: timeStr,
          available: isAvailable
        })
      }
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Erro ao buscar horários:", error)
    return NextResponse.json(
      { error: "Erro ao buscar horários" },
      { status: 500 }
    )
  }
}
