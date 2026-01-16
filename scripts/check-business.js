const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkBusiness() {
  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      }
    })

    console.log('\n📋 Negócios no banco de dados:\n')
    businesses.forEach(b => {
      console.log(`Nome: ${b.name}`)
      console.log(`Slug: ${b.slug}`)
      console.log(`Link: http://localhost:3000/book/${b.slug}`)
      console.log('---')
    })
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBusiness()
