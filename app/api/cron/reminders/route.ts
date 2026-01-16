import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, getReminderEmailHtml } from "@/lib/email"

// Esta rota será chamada por um cron job (Vercel Cron, cron-job.org, etc)
// Para testar localmente, faça uma requisição GET para http://localhost:3000/api/cron/reminders

export async function GET(request: NextRequest) {
  try {
    // Validar token secreto (para segurança)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)

    console.log(`[CRON] Buscando agendamentos entre ${now} e ${in24Hours}`)

    // Buscar agendamentos que precisam de lembrete
    // 1. Agendamentos nas próximas 24h (que ainda não receberam notificação)
    // 2. Agendamentos nas próximas 2h (que ainda não receberam notificação de 2h)
    
    const appointments24h = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: in24Hours,
          lte: new Date(in24Hours.getTime() + 60 * 60 * 1000), // +1h de margem
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        // Ainda não recebeu notificação de 24h
        notifications: {
          none: {
            type: "reminder",
            status: "SENT",
          },
        },
      },
      include: {
        customer: true,
        service: true,
        professional: true,
        business: true,
      },
    })

    const appointments2h = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: in2Hours,
          lte: new Date(in2Hours.getTime() + 30 * 60 * 1000), // +30min de margem
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        // Já recebeu notificação de 24h mas não de 2h
        notifications: {
          some: {
            type: "reminder",
            status: "SENT",
          },
          none: {
            type: "reminder_2h",
            status: "SENT",
          },
        },
      },
      include: {
        customer: true,
        service: true,
        professional: true,
        business: true,
      },
    })

    console.log(`[CRON] Encontrados ${appointments24h.length} agendamentos (24h) e ${appointments2h.length} agendamentos (2h)`)

    let sentCount = 0
    let errorCount = 0

    // Enviar lembretes de 24h
    for (const appointment of appointments24h) {
      if (!appointment.customer.email) {
        console.log(`[CRON] Cliente ${appointment.customer.name} sem email`)
        continue
      }

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

        const html = getReminderEmailHtml({
          customerName: appointment.customer.name,
          businessName: appointment.business.name,
          serviceName: appointment.service.name,
          professionalName: appointment.professional.name,
          date,
          time,
          businessPhone: appointment.business.phone,
          hoursUntil: 24,
        })

        const result = await sendEmail({
          to: appointment.customer.email,
          subject: `Lembrete: Seu agendamento é amanhã - ${appointment.business.name}`,
          html,
        })

        if (result.success) {
          // Registrar notificação
          await prisma.notification.create({
            data: {
              appointmentId: appointment.id,
              type: "reminder",
              status: "SENT",
              sentAt: new Date(),
            },
          })
          sentCount++
          console.log(`[CRON] ✅ Email enviado para ${appointment.customer.email}`)
        } else {
          errorCount++
          console.error(`[CRON] ❌ Erro ao enviar para ${appointment.customer.email}`)
        }
      } catch (error) {
        errorCount++
        console.error(`[CRON] ❌ Erro ao processar agendamento ${appointment.id}:`, error)
      }
    }

    // Enviar lembretes de 2h
    for (const appointment of appointments2h) {
      if (!appointment.customer.email) continue

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

        const html = getReminderEmailHtml({
          customerName: appointment.customer.name,
          businessName: appointment.business.name,
          serviceName: appointment.service.name,
          professionalName: appointment.professional.name,
          date,
          time,
          businessPhone: appointment.business.phone,
          hoursUntil: 2,
        })

        const result = await sendEmail({
          to: appointment.customer.email,
          subject: `🚨 Lembrete: Seu agendamento é HOJE às ${time} - ${appointment.business.name}`,
          html,
        })

        if (result.success) {
          await prisma.notification.create({
            data: {
              appointmentId: appointment.id,
              type: "reminder_2h",
              status: "SENT",
              sentAt: new Date(),
            },
          })
          sentCount++
          console.log(`[CRON] ✅ Email 2h enviado para ${appointment.customer.email}`)
        } else {
          errorCount++
        }
      } catch (error) {
        errorCount++
        console.error(`[CRON] ❌ Erro ao processar agendamento ${appointment.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processamento concluído: ${sentCount} enviados, ${errorCount} erros`,
      sent: sentCount,
      errors: errorCount,
      appointments24h: appointments24h.length,
      appointments2h: appointments2h.length,
    })
  } catch (error) {
    console.error("[CRON] Erro geral:", error)
    return NextResponse.json(
      { error: "Erro ao processar lembretes" },
      { status: 500 }
    )
  }
}
