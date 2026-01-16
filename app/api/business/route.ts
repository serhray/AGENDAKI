import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Buscar dados do negócio
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

    const business = await prisma.business.findUnique({
      where: { id: user.businessId }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ business })
    
  } catch (error) {
    console.error("Erro ao buscar negócio:", error)
    return NextResponse.json(
      { error: "Erro ao buscar negócio" },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar dados do negócio
export async function PATCH(request: Request) {
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

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      primaryColor,
      allowCancellation,
      cancellationHours,
      minAdvanceBookingHours
    } = await request.json()

    // Validações
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Nome, email e telefone são obrigatórios" },
        { status: 400 }
      )
    }

    const business = await prisma.business.update({
      where: { id: user.businessId },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        primaryColor,
        allowCancellation,
        cancellationHours: parseInt(cancellationHours),
        minAdvanceBookingHours: parseInt(minAdvanceBookingHours)
      }
    })

    return NextResponse.json({
      business,
      message: "Configurações atualizadas com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao atualizar negócio:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar negócio" },
      { status: 500 }
    )
  }
}
