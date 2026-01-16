import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// PATCH - Atualizar serviço
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { name, description, duration, price, professionalIds, active } = await request.json()

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

    const { id } = await params

    // Verificar se o serviço pertence ao negócio do usuário
    const existingService = await prisma.service.findFirst({
      where: {
        id: id,
        businessId: user.businessId
      }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar serviço
    const service = await prisma.service.update({
      where: { id: id },
      data: {
        name: name ?? existingService.name,
        description: description !== undefined ? description : existingService.description,
        duration: duration ? parseInt(duration) : existingService.duration,
        price: price ? parseFloat(price) : existingService.price,
        active: active !== undefined ? active : existingService.active,
      }
    })

    // Atualizar profissionais vinculados se fornecidos
    if (professionalIds !== undefined) {
      // Remover vínculos existentes
      await prisma.serviceProfessional.deleteMany({
        where: { serviceId: id }
      })

      // Criar novos vínculos
      if (professionalIds.length > 0) {
        await prisma.serviceProfessional.createMany({
          data: professionalIds.map((professionalId: string) => ({
            serviceId: id,
            professionalId: professionalId
          }))
        })
      }
    }

    // Buscar serviço atualizado com profissionais
    const updatedService = await prisma.service.findUnique({
      where: { id: id },
      include: {
        professionals: {
          include: {
            professional: true
          }
        }
      }
    })

    return NextResponse.json({
      service: updatedService,
      message: "Serviço atualizado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar serviço" },
      { status: 500 }
    )
  }
}

// DELETE - Deletar serviço
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Verificar se o serviço pertence ao negócio do usuário
    const existingService = await prisma.service.findFirst({
      where: {
        id: id,
        businessId: user.businessId
      }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se há agendamentos usando este serviço
    const appointmentsCount = await prisma.appointment.count({
      where: { serviceId: id }
    })

    if (appointmentsCount > 0) {
      return NextResponse.json(
        { error: `Não é possível deletar este serviço pois existem ${appointmentsCount} agendamento(s) associado(s). Desative o serviço em vez de deletá-lo.` },
        { status: 400 }
      )
    }

    // Deletar serviço (cascade deletará os vínculos)
    await prisma.service.delete({
      where: { id: id }
    })

    return NextResponse.json({
      message: "Serviço deletado com sucesso!"
    })
    
  } catch (error) {
    console.error("Erro ao deletar serviço:", error)
    return NextResponse.json(
      { error: "Erro ao deletar serviço" },
      { status: 500 }
    )
  }
}
