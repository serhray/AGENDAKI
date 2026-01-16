import Stripe from 'stripe'

// Stripe opcional até configurar as chaves
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  : null

// Configuração dos planos
export const PLANS = {
  FREEMIUM: {
    name: 'Freemium',
    price: 0,
    priceId: null, // Não tem no Stripe
    features: [
      '1 profissional',
      '20 agendamentos/mês',
      'Notificações por e-mail',
      'Relatórios básicos',
    ],
    limits: {
      professionals: 1,
      services: 3,
      appointments: 20,
    },
  },
  INICIAL: {
    name: 'Inicial',
    price: 49,
    priceId: process.env.STRIPE_PRICE_INICIAL, // Criar no Stripe
    features: [
      'Até 2 profissionais',
      'Agendamentos ilimitados',
      'WhatsApp + E-mail + SMS',
      'Relatórios mensais',
    ],
    limits: {
      professionals: 2,
      services: 10,
      appointments: 9999,
    },
  },
  PROFESSIONAL: {
    name: 'Profissional',
    price: 99,
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL, // Criar no Stripe
    trial: 14, // 14 dias grátis
    features: [
      'Até 6 profissionais',
      'Tudo do plano Inicial',
      'Relatórios avançados',
      'API de integração',
    ],
    limits: {
      professionals: 6,
      services: 20,
      appointments: 9999,
    },
    badge: 'Mais Popular',
  },
  PREMIUM: {
    name: 'Premium',
    price: 199,
    priceId: process.env.STRIPE_PRICE_PREMIUM, // Criar no Stripe
    features: [
      'Até 15 profissionais',
      'Tudo do plano Profissional',
      'Suporte prioritário 24/7',
      'Integrações personalizadas',
    ],
    limits: {
      professionals: 15,
      services: 9999,
      appointments: 9999,
    },
  },
} as const

export type PlanType = keyof typeof PLANS
