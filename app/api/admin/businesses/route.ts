import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      )
    }

    // Buscar todos os negócios com informações relevantes
    const businesses = await prisma.business.findMany({
      include: {
        _count: {
          select: {
            users: true,
            professionals: true,
            services: true,
            appointments: true,
            customers: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ businesses })
    
  } catch (error) {
    console.error("Erro ao buscar negócios:", error)
    return NextResponse.json(
      { error: "Erro ao buscar negócios" },
      { status: 500 }
    )
  }
}
