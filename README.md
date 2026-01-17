# 📅 AGENDAKI - Sistema de Agendamento Online

Sistema SaaS completo de agendamento online para salões, clínicas, barbearias e outros negócios de serviço.

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/agendaki)

## 🚀 Tecnologias

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Email**: Nodemailer (Gmail)
- **Deploy**: Vercel
- **Validação**: Zod + React Hook Form

## ✨ Status do Projeto

🎉 **MVP 100% COMPLETO!**

- ✅ Fase 1-9: Completas
- ✅ Fase 10: Painel Admin - **COMPLETO**
- ⚡ Fase 11: Pagamentos Stripe - 60% completo
- 🚀 **Pronto para produção e primeiros clientes!**

```
agendaki/
├── app/                    # Páginas e rotas (App Router)
│   ├── (auth)/            # Rotas de autenticação
│   ├── (dashboard)/       # Painel do negócio
│   ├── (public)/          # Página pública de agendamento
│   ├── admin/             # Painel administrativo
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI reutilizáveis
│   └── ...               # Componentes específicos
├── lib/                  # Utilitários e configurações
├── prisma/              # Schema do banco de dados
└── public/              # Arquivos estáticos
```

## 🎯 Funcionalidades Implementadas

### 📊 Para o Negócio (OWNER):
- ✅ Cadastro e login seguro
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão completa de profissionais (horários, fotos, bloqueios)
- ✅ Gestão de serviços (preços, duração, profissionais vinculados)
- ✅ Calendário interativo de agendamentos
- ✅ Página pública customizada (/{slug})
- ✅ Relatórios e exportação CSV
- ✅ Notificações por email (confirmação, lembrete)
- ✅ Sistema de planos com limites
- ✅ Billing e controle de assinatura

### 🌐 Para o Cliente Final:
- ✅ Agendamento online sem cadastro
- ✅ Escolha de serviço, profissional e horário
- ✅ Visualização de slots disponíveis
- ✅ Confirmação automática por email
- ✅ Interface customizada com cores do negócio

### 👑 Para o Admin (ADMIN):
- ✅ Dashboard com estatísticas globais
- ✅ Gestão de todos os negócios
- ✅ MRR (Receita Mensal Recorrente)
- ✅ Gráficos de distribuição por planos
- ✅ Visualizar detalhes de cada negócio
- ✅ Script de promoção de usuários

### 💳 Sistema de Planos:
- ✅ FREEMIUM (R$ 0 - 1 prof, 3 serv, 30 agend/mês)
- ✅ INICIAL (R$ 49 - 3 prof, 10 serv, 100 agend/mês)
- ✅ PROFESSIONAL (R$ 99 - 10 prof, 30 serv, 500 agend/mês)
- ✅ PREMIUM (R$ 199 - Ilimitado)
- ✅ Trial de 7 dias para todos os planos
- ✅ Controle automático de limites
- ✅ Upgrade prompts quando atingir limites

## 🛠️ Setup Inicial

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados PostgreSQL

Você tem 2 opções:

**Opção A: PostgreSQL Local (Recomendado para desenvolvimento)**
- Baixe PostgreSQL: https://www.postgresql.org/download/
- Instale e crie um banco chamado `agendaki`
- Atualize o `.env` com suas credenciais

**Opção B: PostgreSQL na nuvem (Grátis)**
- Banco já configurado com Prisma Postgres (via Vercel Storage)
- Ou no Railway: https://railway.app
- Copie a URL de conexão para o `.env`

### 3. Configurar variáveis de ambiente

Confira o arquivo `.env` e configure:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendaki"
NEXTAUTH_SECRET="gere-um-secret-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Criar tabelas no banco
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Rodar o projeto
```bash
npm run dev
```

Acesse: http://localhost:3000

## 📅 Próximos Passos

- [ ] Criar página de login
- [ ] Criar página de cadastro
- [ ] Criar dashboard básico
- [ ] Implementar CRUD de profissionais
- [ ] Implementar CRUD de serviços
- [ ] Criar calendário de agendamentos
- [ ] Criar página pública de agendamento
- [ ] Implementar sistema de notificações
- [ ] Integrar pagamentos (Stripe)

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start

# Prisma
npx prisma studio          # Ver dados no navegador
npx prisma migrate dev     # Criar migração
npx prisma generate        # Gerar cliente
npx prisma db push         # Atualizar schema sem migração
```

## 🎨 Cores do Projeto

- Primary: `#6366f1` (Indigo)
- Background: `#ffffff`
- Text: `#1f2937`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
