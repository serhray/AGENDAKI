import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    const user = session?.user as { email?: string; role?: string } | undefined

    // Verificar se é admin
    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            professionals: true,
            services: true,
            appointments: true,
            customers: true
          }
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        professionals: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          },
          take: 10
        },
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          },
          take: 10
        }
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Buscar agendamentos recentes
    const recentAppointments = await prisma.appointment.findMany({
      where: { businessId: business.id },
      include: {
        customer: {
          select: {
            name: true
          }
        },
        service: {
          select: {
            name: true,
            price: true
          }
        }
      },
      orderBy: { date: "desc" },
      take: 10
    })

    // Estatísticas de agendamentos
    const appointments = await prisma.appointment.findMany({
      where: { businessId: business.id },
      select: {
        status: true,
        service: {
          select: {
            price: true
          }
        }
      }
    })

    const stats = {
      totalRevenue: appointments
        .filter(a => a.status === "COMPLETED")
        .reduce((sum, a) => sum + Number(a.service.price), 0),
      confirmedAppointments: appointments.filter(a => a.status === "CONFIRMED").length,
      pendingAppointments: appointments.filter(a => a.status === "PENDING").length,
      cancelledAppointments: appointments.filter(a => a.status === "CANCELLED").length,
      completedAppointments: appointments.filter(a => a.status === "COMPLETED").length
    }

    return NextResponse.json({
      ...business,
      recentAppointments: recentAppointments.map(apt => ({
        ...apt,
        service: {
          ...apt.service,
          price: Number(apt.service.price)
        }
      })),
      services: business.services.map(service => ({
        ...service,
        price: Number(service.price)
      })),
      stats
    })

  } catch (error) {
    console.error("Erro ao buscar negócio:", error)
    return NextResponse.json(
      { error: "Erro ao buscar negócio" },
      { status: 500 }
    )
  }
}
