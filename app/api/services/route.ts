import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { checkServiceLimit, createUpgradeResponse } from "@/lib/plan-limits"

// GET - Listar serviços do negócio
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

    const services = await prisma.service.findMany({
      where: { businessId: user.businessId },
      include: {
        professionals: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                active: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ services })
    
  } catch (error) {
    console.error("Erro ao listar serviços:", error)
    return NextResponse.json(
      { error: "Erro ao listar serviços" },
      { status: 500 }
    )
  }
}

// POST - Criar serviço
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { name, description, duration, price, professionalIds } = await request.json()

    // Validações
    if (!name || !duration || !price) {
      return NextResponse.json(
        { error: "Nome, duração e preço são obrigatórios" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { businessId: true, business: { select: { plan: true } } }
    })

    if (!user?.businessId || !user.business) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Verificar limite do plano antes de criar
    const limitCheck = await checkServiceLimit(user.businessId)
    if (!limitCheck.allowed) {
      return createUpgradeResponse("service", limitCheck.limit, user.business.plan)
    }

    // Criar serviço com profissionais vinculados
    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        duration: parseInt(duration),
        price: parseFloat(price),
        businessId: user.businessId,
        active: true,
        professionals: professionalIds && professionalIds.length > 0 ? {
          create: professionalIds.map((id: string) => ({
            professionalId: id
          }))
        } : undefined
      },
      include: {
        professionals: {
          include: {
            professional: true
          }
        }
      }
    })

    return NextResponse.json({
      service,
      message: "Serviço criado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao criar serviço:", error)
    return NextResponse.json(
      { error: "Erro ao criar serviço" },
      { status: 500 }
    )
  }
}
