import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLAN_CONFIGS = {
  FREEMIUM: {
    maxProfessionals: 1,
    maxAppointmentsPerMonth: 20,
  },
  INICIAL: {
    maxProfessionals: 2,
    maxAppointmentsPerMonth: 9999,
  },
  PROFESSIONAL: {
    maxProfessionals: 6,
    maxAppointmentsPerMonth: 9999,
  },
  PREMIUM: {
    maxProfessionals: 15,
    maxAppointmentsPerMonth: 9999,
  }
}

async function changePlan() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('📋 Uso: npx tsx scripts/change-plan.ts <email> <plano>')
    console.log('\nPlanos disponíveis:')
    console.log('  - FREEMIUM (R$ 0/mês): 1 profissional, 20 agendamentos/mês')
    console.log('  - INICIAL (R$ 49/mês): 2 profissionais, ilimitado')
    console.log('  - PROFESSIONAL (R$ 99/mês): 6 profissionais, ilimitado')
    console.log('  - PREMIUM (R$ 199/mês): 15 profissionais, ilimitado')
    console.log('\nExemplo: npx tsx scripts/change-plan.ts usuario@email.com INICIAL')
    process.exit(1)
  }

  const [email, newPlan] = args
  const planUpper = newPlan.toUpperCase() as keyof typeof PLAN_CONFIGS

  if (!PLAN_CONFIGS[planUpper]) {
    console.error('❌ Plano inválido. Use: FREEMIUM, INICIAL, PROFESSIONAL ou PREMIUM')
    process.exit(1)
  }

  try {
    // Encontrar o usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true }
    })

    if (!user) {
      console.error('❌ Usuário não encontrado')
      process.exit(1)
    }

    if (!user.businessId) {
      console.error('❌ Usuário não possui business associado')
      process.exit(1)
    }

    console.log('👤 Usuário:', user.name)
    console.log('📧 Email:', user.email)
    console.log('🏢 Business:', user.business?.name)
    console.log('📊 Plano atual:', user.business?.plan)
    console.log('')

    // Atualizar o plano
    const config = PLAN_CONFIGS[planUpper]
    const updatedBusiness = await prisma.business.update({
      where: { id: user.businessId },
      data: {
        plan: planUpper,
        maxProfessionals: config.maxProfessionals,
        maxAppointmentsPerMonth: config.maxAppointmentsPerMonth,
        subscriptionStartedAt: planUpper !== 'FREEMIUM' ? new Date() : null,
        planStatus: 'ACTIVE'
      }
    })

    console.log('✅ Plano atualizado com sucesso!')
    console.log('📊 Novo plano:', updatedBusiness.plan)
    console.log('👥 Máximo de profissionais:', updatedBusiness.maxProfessionals)
    console.log('📅 Agendamentos mensais:', updatedBusiness.maxAppointmentsPerMonth)
    console.log('🟢 Status:', updatedBusiness.planStatus)

  } catch (error) {
    console.error('❌ Erro ao atualizar plano:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

changePlan()
