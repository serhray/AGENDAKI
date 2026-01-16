import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET - Listar clientes do negócio
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

    const customers = await prisma.customer.findMany({
      where: { businessId: user.businessId },
      include: {
        _count: {
          select: { appointments: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ customers })
    
  } catch (error) {
    console.error("Erro ao listar clientes:", error)
    return NextResponse.json(
      { error: "Erro ao listar clientes" },
      { status: 500 }
    )
  }
}

// POST - Criar cliente
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { name, email, phone } = await request.json()

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
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

    // Verificar se já existe cliente com esse telefone
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        businessId: user.businessId,
        phone: phone
      }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Cliente com este telefone já cadastrado" },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email || null,
        phone,
        businessId: user.businessId,
      }
    })

    return NextResponse.json({
      customer,
      message: "Cliente criado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    )
  }
}
