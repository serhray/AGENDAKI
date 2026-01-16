import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkProfessionalLimit, createUpgradeResponse } from "@/lib/plan-limits"

// GET - Listar profissionais do negócio
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    // Buscar usuário com businessId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { businessId: true, role: true }
    })

    if (!user?.businessId) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Buscar profissionais do negócio
    const professionals = await prisma.professional.findMany({
      where: { businessId: user.businessId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ professionals })
    
  } catch (error) {
    console.error("Erro ao listar profissionais:", error)
    return NextResponse.json(
      { error: "Erro ao listar profissionais" },
      { status: 500 }
    )
  }
}

// POST - Criar profissional
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { name, email, phone, bio, workingHours } = await request.json()

    // Validações
    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar usuário com businessId
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { businessId: true, role: true }
    })

    if (!user?.businessId) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Verificar limite de profissionais
    const limitCheck = await checkProfessionalLimit(user.businessId)
    if (!limitCheck.allowed) {
      const business = await prisma.business.findUnique({
        where: { id: user.businessId },
        select: { plan: true }
      })
      return createUpgradeResponse("professional", limitCheck.limit, business?.plan || "FREEMIUM")
    }

    // Criar profissional
    const professional = await prisma.professional.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        bio: bio || null,
        businessId: user.businessId,
        workingHours: workingHours || {},
        active: true,
      }
    })

    return NextResponse.json({
      professional,
      message: "Profissional criado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao criar profissional:", error)
    return NextResponse.json(
      { error: "Erro ao criar profissional" },
      { status: 500 }
    )
  }
}
