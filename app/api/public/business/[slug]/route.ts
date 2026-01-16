import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Buscar negócio por slug
    const business = await prisma.business.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        primaryColor: true,
        minAdvanceBookingHours: true,
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Buscar serviços ativos
    const services = await prisma.service.findMany({
      where: {
        businessId: business.id,
        active: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true
      },
      orderBy: { name: "asc" }
    })

    // Buscar profissionais ativos
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
      services,
      professionals
    })
  } catch (error) {
    console.error("Erro ao buscar dados públicos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 }
    )
  }
}
