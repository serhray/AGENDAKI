import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// PATCH - Atualizar profissional
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { name, email, phone, bio, workingHours, active } = await request.json()

    // Buscar usuário com businessId
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

    // Verificar se o profissional pertence ao negócio do usuário
    const existingProfessional = await prisma.professional.findFirst({
      where: {
        id: params.id,
        businessId: user.businessId
      }
    })

    if (!existingProfessional) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar profissional
    const professional = await prisma.professional.update({
      where: { id: params.id },
      data: {
        name: name ?? existingProfessional.name,
        email: email !== undefined ? email : existingProfessional.email,
        phone: phone !== undefined ? phone : existingProfessional.phone,
        bio: bio !== undefined ? bio : existingProfessional.bio,
        workingHours: workingHours ?? existingProfessional.workingHours,
        active: active !== undefined ? active : existingProfessional.active,
      }
    })

    return NextResponse.json({
      professional,
      message: "Profissional atualizado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao atualizar profissional:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar profissional" },
      { status: 500 }
    )
  }
}

// DELETE - Deletar profissional
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      select: { businessId: true }
    })

    if (!user?.businessId) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o profissional pertence ao negócio do usuário
    const existingProfessional = await prisma.professional.findFirst({
      where: {
        id: params.id,
        businessId: user.businessId
      }
    })

    if (!existingProfessional) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      )
    }

    // Deletar profissional
    await prisma.professional.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: "Profissional deletado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao deletar profissional:", error)
    return NextResponse.json(
      { error: "Erro ao deletar profissional" },
      { status: 500 }
    )
  }
}
