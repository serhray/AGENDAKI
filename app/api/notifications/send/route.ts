import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sendEmail, getConfirmationEmailHtml, getReminderEmailHtml, getCancellationEmailHtml } from "@/lib/email"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { appointmentId, type } = await request.json()

    if (!appointmentId || !type) {
      return NextResponse.json(
        { error: "appointmentId e type são obrigatórios" },
        { status: 400 }
      )
    }

    // Buscar usuário logado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, businessId: true }
    })

    if (!user?.businessId) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Buscar dados do agendamento
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: true,
        service: true,
        professional: true,
        business: true,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o agendamento pertence ao negócio do usuário
    if (appointment.businessId !== user.businessId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    if (!appointment.customer.email) {
      return NextResponse.json(
        { error: "Cliente não possui email cadastrado" },
        { status: 400 }
      )
    }

    const date = appointment.startTime.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    const time = appointment.startTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    let subject = ""
    let html = ""

    // Gerar email baseado no tipo
    switch (type) {
      case "confirmation":
        subject = `Agendamento Confirmado - ${appointment.business.name}`
        html = getConfirmationEmailHtml({
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
        break

      case "reminder":
        const now = Date.now()
        const appointmentTime = appointment.startTime.getTime()
        const hoursUntil = Math.round((appointmentTime - now) / (1000 * 60 * 60))
        const daysUntil = Math.floor(hoursUntil / 24)
        
        // Criar mensagem dinâmica baseada no tempo restante
        let timeMessage = ""
        if (daysUntil > 1) {
          timeMessage = `em ${daysUntil} dias`
        } else if (daysUntil === 1) {
          timeMessage = "amanhã"
        } else if (hoursUntil > 1) {
          timeMessage = `em ${hoursUntil} horas`
        } else {
          timeMessage = "em breve"
        }
        
        subject = `Lembrete: Seu agendamento é ${timeMessage} - ${appointment.business.name}`
        html = getReminderEmailHtml({
          customerName: appointment.customer.name,
          businessName: appointment.business.name,
          serviceName: appointment.service.name,
          professionalName: appointment.professional.name,
          date,
          time,
          businessPhone: appointment.business.phone,
          hoursUntil: timeMessage,
        })
        break

      case "cancellation":
        subject = `Agendamento Cancelado - ${appointment.business.name}`
        html = getCancellationEmailHtml({
          customerName: appointment.customer.name,
          businessName: appointment.business.name,
          serviceName: appointment.service.name,
          date,
          time,
        })
        break

      default:
        return NextResponse.json(
          { error: "Tipo de notificação inválido" },
          { status: 400 }
        )
    }

    // Enviar email
    const result = await sendEmail({
      to: appointment.customer.email,
      subject,
      html,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: "Erro ao enviar email" },
        { status: 500 }
      )
    }

    // Registrar notificação no banco (opcional, para histórico)
    await prisma.notification.create({
      data: {
        appointmentId: appointment.id,
        type,
        status: "SENT",
        sentAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Notificação enviada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao enviar notificação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
