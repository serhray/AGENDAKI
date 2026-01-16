const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixUserBusiness() {
  try {
    const userId = process.argv[2]
    const businessId = process.argv[3]

    if (!userId || !businessId) {
      console.log('❌ Uso: node scripts/fix-user-business.js <userId> <businessId>')
      console.log('\nOu execute sem parâmetros para auto-fix:')
      console.log('node scripts/fix-user-business.js\n')
      
      // AUTO-FIX: Buscar usuários sem businessId e tentar associar automaticamente
      const users = await prisma.user.findMany({
        where: { businessId: null }
      })

      if (users.length === 0) {
        console.log('✅ Todos os usuários já têm businessId!')
        return
      }

      console.log(`\n🔧 Encontrei ${users.length} usuário(s) sem businessId.\n`)

      for (const user of users) {
        // Buscar o primeiro business disponível
        const business = await prisma.business.findFirst()

        if (business) {
          console.log(`👤 ${user.name} (${user.email})`)
          console.log(`🏢 Associando ao business: ${business.name}`)
          
          await prisma.user.update({
            where: { id: user.id },
            data: { businessId: business.id }
          })
          
          console.log(`✅ businessId atualizado!\n`)
        } else {
          console.log(`👤 ${user.name} (${user.email})`)
          console.log(`❌ Nenhum business encontrado no sistema`)
          console.log(`💡 Você precisa criar um business primeiro\n`)
        }
      }

      console.log('✅ Processo concluído!')
      return
    }

    // Fix manual com parâmetros
    console.log(`\n🔧 Associando usuário ${userId} ao business ${businessId}...\n`)

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    const business = await prisma.business.findUnique({
      where: { id: businessId }
    })

    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }

    if (!business) {
      console.log('❌ Business não encontrado!')
      return
    }

    console.log(`👤 Usuário: ${user.name} (${user.email})`)
    console.log(`🏢 Business: ${business.name}\n`)

    await prisma.user.update({
      where: { id: userId },
      data: { businessId: businessId }
    })

    console.log('✅ businessId atualizado com sucesso!\n')
    console.log('🎉 Agora você pode fazer login e acessar as configurações!')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUserBusiness()
