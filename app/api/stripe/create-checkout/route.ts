import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe, PLANS } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe não configurado" }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { plan } = await request.json()

    if (!['INICIAL', 'PROFESSIONAL', 'PREMIUM'].includes(plan)) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 })
    }

    // Buscar usuário e business
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { business: true }
    })

    if (!user?.business) {
      return NextResponse.json({ error: "Business não encontrado" }, { status: 404 })
    }

    const planConfig = PLANS[plan as keyof typeof PLANS]

    // Criar ou recuperar customer do Stripe
    let customerId = user.business.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          businessId: user.business.id,
          userId: user.id,
        },
      })
      customerId = customer.id

      // Salvar customer ID no banco
      await prisma.business.update({
        where: { id: user.business.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Criar sessão de checkout
    const sessionParams: any = {
      customer: customerId!,
      line_items: [
        {
          price: planConfig.priceId!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        businessId: user.business.id,
        plan,
      },
    }

    // Adicionar trial apenas para Professional
    if (plan === 'PROFESSIONAL' && 'trial' in planConfig) {
      sessionParams.subscription_data = {
        trial_period_days: (planConfig as any).trial,
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Erro ao criar checkout:', error)
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 }
    )
  }
}
