const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  try {
    const users = await prisma.user.findMany()
    const businesses = await prisma.business.findMany()

    console.log('\n📊 Status:\n')
    console.log(`Usuários: ${users.length}`)
    console.log(`Negócios: ${businesses.length}\n`)

    users.forEach(u => {
      console.log(`👤 ${u.name}`)
      console.log(`   BusinessId: ${u.businessId || '❌ FALTANDO'}\n`)
    })

    businesses.forEach(b => {
      console.log(`🏢 ${b.name}`)
      console.log(`   ID: ${b.id}\n`)
    })

    const sem = users.filter(u => !u.businessId)
    if (sem.length > 0 && businesses.length > 0) {
      console.log('🔧 Execute: node scripts/fix-user-business.js')
    }

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

run()
