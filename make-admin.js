// Script para promover um usuário a ADMIN
// Uso: node make-admin.js seu-email@exemplo.com

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function makeAdmin(email) {
  try {
    if (!email) {
      console.error('❌ Por favor forneça um email: node make-admin.js seu-email@exemplo.com')
      process.exit(1)
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    console.log('✅ Usuário promovido a ADMIN com sucesso!')
    console.log('📧 Email:', user.email)
    console.log('👤 Nome:', user.name)
    console.log('🔑 Role:', user.role)
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ Usuário não encontrado com email:', email)
    } else {
      console.error('❌ Erro ao promover usuário:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]
makeAdmin(email)
