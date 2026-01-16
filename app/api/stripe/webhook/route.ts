import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe não configurado" }, { status: 503 })
  }

  const body = await request.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura não encontrada" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error(`Erro ao verificar webhook: ${error.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const businessId = session.metadata?.businessId
        const plan = session.metadata?.plan

        if (!businessId || !plan) {
          console.error("Metadata ausente no checkout.session.completed")
          break
        }

        // Buscar assinatura criada
        if (session.subscription) {
          // @ts-ignore - Stripe types issue
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // Determinar plan enum baseado no metadata
          let planEnum: 'FREEMIUM' | 'INICIAL' | 'PROFESSIONAL' | 'PREMIUM' = 'FREEMIUM'
          if (plan === 'INICIAL') planEnum = 'INICIAL'
          else if (plan === 'PROFESSIONAL') planEnum = 'PROFESSIONAL'
          else if (plan === 'PREMIUM') planEnum = 'PREMIUM'

          // @ts-ignore - Prisma types issue
          await prisma.business.update({
            where: { id: businessId },
            data: {
              plan: planEnum,
              // @ts-ignore
              planStatus: subscription.status === 'trialing' ? 'TRIAL' : 'ACTIVE',
              // @ts-ignore
              stripeSubscriptionId: subscription.id,
              // @ts-ignore
              stripePriceId: subscription.items.data[0].price.id,
              subscriptionStartedAt: new Date(subscription.created * 1000),
              // @ts-ignore
              subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
              // Atualizar limites baseado no plano
              ...(planEnum === "INICIAL" && {
                maxProfessionals: 2,
                maxAppointmentsPerMonth: 9999,
              }),
              ...(planEnum === "PROFESSIONAL" && {
                maxProfessionals: 6,
                maxAppointmentsPerMonth: 9999,
              }),
              ...(planEnum === "PREMIUM" && {
                maxProfessionals: 15,
                maxAppointmentsPerMonth: 9999,
              }),
            },
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const businessId = subscription.metadata?.businessId

        if (!businessId) {
          console.error("businessId ausente em subscription.updated")
          break
        }

        // @ts-ignore - Prisma types issue
        await prisma.business.update({
          where: { id: businessId },
          data: {
            // @ts-ignore
            subscriptionEndsAt: new Date((subscription as any).current_period_end * 1000),
          },
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        // @ts-ignore - Prisma types issue
        const business = await prisma.business.findFirst({
          // @ts-ignore
          where: { stripeSubscriptionId: subscription.id },
        })

        if (business) {
          // @ts-ignore - Prisma types issue
          await prisma.business.update({
            where: { id: business.id },
            data: {
              plan: "FREEMIUM",
              planStatus: "CANCELLED",
              // @ts-ignore
              stripeSubscriptionId: null,
              // @ts-ignore
              stripePriceId: null,
              // @ts-ignore
              subscriptionEndsAt: null,
              // Reverter para limites gratuitos
              maxProfessionals: 1,
              maxAppointmentsPerMonth: 20,
            },
          })
        }
        break
      }

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    )
  }
}
