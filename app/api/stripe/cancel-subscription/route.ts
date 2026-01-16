import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe não configurado" }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { business: true }
    })

    if (!user?.business?.stripeSubscriptionId) {
      return NextResponse.json({ error: "Nenhuma assinatura ativa encontrada" }, { status: 404 })
    }

    // Cancelar assinatura no Stripe (no final do período)
    await stripe.subscriptions.update(user.business.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })

    // Atualizar status no banco
    await prisma.business.update({
      where: { id: user.business.id },
      data: {
        planStatus: "CANCELLED"
      }
    })

    return NextResponse.json({ 
      success: true,
      message: "Assinatura cancelada. Você terá acesso até o fim do período pago."
    })
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error)
    return NextResponse.json({ error: "Erro ao cancelar assinatura" }, { status: 500 })
  }
}
