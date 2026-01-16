const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const business = await prisma.business.findFirst({
    select: {
      id: true,
      name: true,
      slug: true
    }
  })
  
  console.log('📊 Negócio no banco:')
  console.log(JSON.stringify(business, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
