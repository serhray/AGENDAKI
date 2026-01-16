import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { sendEmail, getConfirmationEmailHtml, getCancellationEmailHtml } from "@/lib/email"

// PATCH - Atualizar agendamento
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { status, notes, date, startTime, serviceId, professionalId } = await request.json()

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

    const { id } = await params

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: id,
        businessId: user.businessId
      },
      include: { service: true }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      )
    }

    // Se mudou data/hora/serviço, recalcular endTime - startTime e endTime são DateTime
    let startDateTime = existingAppointment.startTime
    let endDateTime = existingAppointment.endTime
    let appointmentDate = existingAppointment.date
    
    if (date || startTime || serviceId) {
      const service = serviceId 
        ? await prisma.service.findUnique({ where: { id: serviceId } })
        : existingAppointment.service

      if (!service) {
        return NextResponse.json(
          { error: "Serviço não encontrado" },
          { status: 404 }
        )
      }

      // Usar nova data ou manter existente
      appointmentDate = date ? new Date(date) : existingAppointment.date
      
      // Se tem novo startTime (string "HH:mm"), criar novo DateTime
      if (startTime) {
        const [hours, minutes] = startTime.split(":").map(Number)
        startDateTime = new Date(appointmentDate)
        startDateTime.setHours(hours, minutes, 0, 0)
      } else if (date) {
        // Se mudou data mas não hora, ajustar data mantendo hora
        const existingTime = new Date(existingAppointment.startTime)
        startDateTime = new Date(appointmentDate)
        startDateTime.setHours(existingTime.getHours(), existingTime.getMinutes(), 0, 0)
      }
      
      // Recalcular endTime
      endDateTime = new Date(startDateTime)
      endDateTime.setMinutes(endDateTime.getMinutes() + service.duration)
    }

    const appointment = await prisma.appointment.update({
      where: { id: id },
      data: {
        status: status ?? existingAppointment.status,
        notes: notes !== undefined ? notes : existingAppointment.notes,
        date: appointmentDate,
        startTime: startDateTime,
        endTime: endDateTime,
        serviceId: serviceId ?? existingAppointment.serviceId,
        professionalId: professionalId ?? existingAppointment.professionalId,
      },
      include: {
        customer: true,
        service: true,
        professional: true,
        business: true,
      }
    })

    // 🔥 AUTOMAÇÃO: Enviar email de confirmação automaticamente
    if (status === "CONFIRMED" && existingAppointment.status !== "CONFIRMED" && appointment.customer.email) {
      try {
        const date = appointment.startTime.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })

        const time = appointment.startTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })

        const html = getConfirmationEmailHtml({
          customerName: appointment.customer.name,
          businessName: appointment.business.name,
          serviceName: appointment.service.name,
          professionalName: appointment.professional.name,
          date,
          time,
          businessPhone: appointment.business.phone,
          businessAddress: appointment.business.address
            ? `${appointment.business.address}, ${appointment.business.city} - ${appointment.business.state}`
            : undefined,
        })

        await sendEmail({
          to: appointment.customer.email,
          subject: `Agendamento Confirmado - ${appointment.business.name}`,
          html,
        })

        // Registrar notificação enviada
        await prisma.notification.create({
          data: {
            appointmentId: appointment.id,
            type: "confirmation",
            status: "sent",
            sentAt: new Date(),
          },
        })

        console.log(`✅ Email de confirmação enviado para ${appointment.customer.email}`)
      } catch (emailError) {
        console.error("❌ Erro ao enviar email de confirmação:", emailError)
        // Não falhar a requisição se email falhar
      }
    }

    // 🔥 AUTOMAÇÃO: Enviar email de cancelamento automaticamente
    if (status === "CANCELLED" && existingAppointment.status !== "CANCELLED" && appointment.customer.email) {
      try {
        const date = appointment.startTime.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })

        const time = appointment.startTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })

        const html = getCancellationEmailHtml({
          customerName: appointment.customer.name,
          businessName: appointment.business.name,
          serviceName: appointment.service.name,
          date,
          time,
        })

        await sendEmail({
          to: appointment.customer.email,
          subject: `Agendamento Cancelado - ${appointment.business.name}`,
          html,
        })

        // Registrar notificação enviada
        await prisma.notification.create({
          data: {
            appointmentId: appointment.id,
            type: "cancellation",
            status: "sent",
            sentAt: new Date(),
          },
        })

        console.log(`✅ Email de cancelamento enviado para ${appointment.customer.email}`)
      } catch (emailError) {
        console.error("❌ Erro ao enviar email de cancelamento:", emailError)
        // Não falhar a requisição se email falhar
      }
    }

    return NextResponse.json({
      appointment,
      message: "Agendamento atualizado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 }
    )
  }
}

// DELETE - Deletar agendamento
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: id,
        businessId: user.businessId
      }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      )
    }

    await prisma.appointment.delete({
      where: { id: id }
    })

    return NextResponse.json({
      message: "Agendamento deletado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error)
    return NextResponse.json(
      { error: "Erro ao deletar agendamento" },
      { status: 500 }
    )
  }
}
