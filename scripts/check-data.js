const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        services: true,
        professionals: true
      }
    })

    console.log('\n📊 Status do banco de dados:\n')
    
    for (const business of businesses) {
      console.log(`\n🏢 ${business.name} (${business.slug})`)
      console.log(`   Serviços: ${business.services.length}`)
      console.log(`   Profissionais: ${business.professionals.length}`)
      
      if (business.services.length > 0) {
        console.log('\n   📋 Serviços:')
        business.services.forEach(s => {
          console.log(`      - ${s.name} (R$ ${s.price}, ${s.duration}min) - Ativo: ${s.active}`)
        })
      }
      
      if (business.professionals.length > 0) {
        console.log('\n   👥 Profissionais:')
        business.professionals.forEach(p => {
          console.log(`      - ${p.name} - Ativo: ${p.active}`)
        })
      }
      
      console.log('---')
    }
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
