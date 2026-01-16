import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH - Atualizar cliente
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { name, email, phone } = await request.json()

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

    // Verificar se o cliente pertence ao negócio
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
        businessId: user.businessId
      }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar cliente
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: name ?? existingCustomer.name,
        email: email !== undefined ? email : existingCustomer.email,
        phone: phone ?? existingCustomer.phone,
      }
    })

    return NextResponse.json({
      customer,
      message: "Cliente atualizado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    )
  }
}

// DELETE - Deletar cliente
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Verificar se o cliente pertence ao negócio
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
        businessId: user.businessId
      }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }

    // Deletar cliente
    await prisma.customer.delete({
      where: { id }
    })

    return NextResponse.json({
      message: "Cliente deletado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao deletar cliente:", error)
    return NextResponse.json(
      { error: "Erro ao deletar cliente" },
      { status: 500 }
    )
  }
}
