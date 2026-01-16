const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkSettings() {
  try {
    const business = await prisma.business.findFirst({
      where: { slug: 'clinica-veterinaria-2' },
      select: {
        name: true,
        slug: true,
        minAdvanceBookingHours: true
      }
    })

    console.log('\n⚙️ Configurações de agendamento:\n')
    console.log(`Negócio: ${business.name}`)
    console.log(`Slug: ${business.slug}`)
    console.log(`Mínimo de horas de antecedência: ${business.minAdvanceBookingHours}h`)
    console.log(`\n📅 Data/hora atual: ${new Date().toLocaleString('pt-BR')}`)
    console.log(`📅 Mínimo para agendar: ${new Date(Date.now() + business.minAdvanceBookingHours * 60 * 60 * 1000).toLocaleString('pt-BR')}`)
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSettings()
