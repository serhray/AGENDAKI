const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSlug() {
  try {
    // Buscar todos os negócios
    const businesses = await prisma.business.findMany()

    console.log(`Encontrados ${businesses.length} negócios`)

    for (const business of businesses) {
      // Gerar slug a partir do nome
      const slug = business.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-+|-+$/g, '') // Remove hífens no início e fim

      // Verificar se o slug já existe
      let finalSlug = slug
      let counter = 1
      
      while (true) {
        const existing = await prisma.business.findUnique({
          where: { slug: finalSlug }
        })
        
        if (!existing) break
        
        finalSlug = `${slug}-${counter}`
        counter++
      }

      // Atualizar o negócio com o slug
      await prisma.business.update({
        where: { id: business.id },
        data: { slug: finalSlug }
      })

      console.log(`✅ ${business.name} -> /book/${finalSlug}`)
    }

    console.log('\n✅ Slugs adicionados com sucesso!')
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSlug()
