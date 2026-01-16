import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName } = await request.json()

    // Validações
    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(password, 12)

    // Gerar slug único
    let baseSlug = businessName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    let slug = baseSlug
    let counter = 1

    // Verificar se slug já existe e adicionar número se necessário
    while (await prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Criar business primeiro
    const business = await prisma.business.create({
      data: {
        name: businessName,
        slug: slug,
        email: email,
        phone: "",
        plan: "FREEMIUM",
        planStatus: "ACTIVE",
        maxProfessionals: 1,
        maxAppointmentsPerMonth: 20,
      }
    })

    // Criar usuário vinculado ao business
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "OWNER",
        businessId: business.id,
      },
      include: {
        business: true
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: "Conta criada com sucesso!"
    })

  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    )
  }
}
