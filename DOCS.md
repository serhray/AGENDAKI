# 📊 DOCUMENTAÇÃO TÉCNICA - AGENDAKI

## 🎯 Visão Geral

O AGENDAKI é um SaaS multi-tenant de agendamento online. Cada negócio (salão, clínica, etc) tem sua própria conta isolada e pode gerenciar seus profissionais, serviços e agendamentos.

## 🏗️ Arquitetura

### Stack Tecnológica
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL 14+
- **ORM**: Prisma 5.22
- **Autenticação**: NextAuth.js 4.24
- **Estilização**: Tailwind CSS
- **Validação**: Zod + React Hook Form

### Padrões de Arquitetura
- **Multi-tenant**: Isolamento por `businessId` em todas as queries
- **API Routes**: `/app/api/` para backend
- **Server Components**: Padrão para renderização
- **Client Components**: Apenas quando necessário interatividade

## 📊 Modelo de Dados

### Entidades Principais

#### User (Usuários do sistema)
- **ADMIN**: Dono da plataforma (você)
- **OWNER**: Dono do negócio (cliente pagante)
- **STAFF**: Funcionário do negócio

#### Business (Negócios)
- Cada negócio é um tenant isolado
- Tem slug único para URL personalizada
- Gerencia profissionais, serviços e agendamentos
- Assinatura com planos (FREE, BASIC, PROFESSIONAL, PREMIUM)

#### Professional (Profissionais)
- Pertencem a um Business
- Têm horários de trabalho configuráveis
- Podem ter bloqueios de datas (férias, folgas)

#### Service (Serviços)
- Pertencem a um Business
- Têm duração e preço
- Relacionamento N:N com Professional

#### Customer (Clientes finais)
- Quem agenda os serviços
- Vinculados a um Business
- Não fazem login (agendamento público)

#### Appointment (Agendamentos)
- Combina Customer + Professional + Service
- Status: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
- Sistema de lembretes automáticos

## 🔐 Autenticação e Autorização

### NextAuth.js

**Providers**:
- Credentials (email/senha)
- OAuth (Google, Facebook) - futuro

**Sessão**:
```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    businessId: string | null
  }
}
```

### Regras de Acesso

| Rota | ADMIN | OWNER | STAFF |
|------|-------|-------|-------|
| /admin | ✅ | ❌ | ❌ |
| /dashboard | ✅ | ✅ | ✅ |
| /settings | ✅ | ✅ | ❌ |
| /[slug] | 🌐 Público | 🌐 Público | 🌐 Público |

## 📁 Estrutura de Diretórios

```
agendaki/
├── app/
│   ├── (auth)/                # Grupo de rotas de autenticação
│   │   ├── login/            # Página de login
│   │   └── register/         # Cadastro de negócio
│   │
│   ├── (dashboard)/          # Painel do negócio (protegido)
│   │   ├── dashboard/        # Home do painel
│   │   ├── professionals/    # CRUD profissionais
│   │   ├── services/         # CRUD serviços
│   │   ├── appointments/     # Gestão de agendamentos
│   │   ├── customers/        # Lista de clientes
│   │   ├── reports/          # Relatórios
│   │   └── settings/         # Configurações
│   │
│   ├── admin/                # Painel admin (protegido ADMIN)
│   │   ├── businesses/       # Gestão de negócios
│   │   ├── users/           # Gestão de usuários
│   │   └── analytics/       # Métricas globais
│   │
│   ├── [slug]/              # Página pública de agendamento
│   │   └── page.tsx         # Ex: /salao-da-maria
│   │
│   └── api/                 # API Routes
│       ├── auth/            # NextAuth
│       ├── businesses/      # Endpoints de negócios
│       ├── professionals/   # Endpoints de profissionais
│       ├── services/        # Endpoints de serviços
│       └── appointments/    # Endpoints de agendamentos
│
├── components/
│   ├── ui/                  # Componentes base (Button, Input, etc)
│   ├── dashboard/           # Componentes do painel
│   ├── public/              # Componentes da página pública
│   └── admin/               # Componentes do admin
│
├── lib/
│   ├── prisma.ts            # Cliente Prisma
│   ├── auth.ts              # Configuração NextAuth
│   ├── utils.ts             # Funções utilitárias
│   └── validations.ts       # Schemas Zod
│
└── prisma/
    ├── schema.prisma        # Modelo de dados
    └── migrations/          # Migrações do banco
```

## 🔄 Fluxos Principais

### 1. Cadastro de Negócio

```
Usuário acessa /register
    ↓
Preenche formulário:
  - Nome do negócio
  - Email
  - Senha
  - Tipo de negócio
    ↓
Sistema cria:
  - Business (com slug único)
  - User (role: OWNER)
  - Trial de 14 dias
    ↓
Redireciona para /dashboard
```

### 2. Agendamento Público

```
Cliente acessa /salao-da-maria
    ↓
Sistema busca Business pelo slug
    ↓
Mostra página personalizada:
  - Logo e cores do negócio
  - Lista de serviços
    ↓
Cliente escolhe:
  - Serviço (ex: Corte feminino)
  - Profissional (ou "qualquer disponível")
  - Data e hora
    ↓
Sistema valida:
  ✓ Horário disponível?
  ✓ Profissional trabalha nesse dia?
  ✓ Não há conflito?
    ↓
Cliente preenche dados:
  - Nome
  - Telefone
  - Email (opcional)
    ↓
Sistema cria:
  - Customer (se não existe)
  - Appointment
    ↓
Envia confirmação (email/SMS)
```

### 3. Gestão de Agendamentos (Dashboard)

```
Dono do negócio acessa /dashboard/appointments
    ↓
Sistema carrega agendamentos do Business
(multi-tenant: WHERE businessId = user.businessId)
    ↓
Visualiza em formato calendário ou lista
    ↓
Pode:
  - Ver detalhes
  - Marcar como concluído
  - Cancelar
  - Adicionar observações
```

## 🔒 Segurança Multi-Tenant

### Princípio: Isolamento Total

**Todas as queries devem filtrar por businessId:**

```typescript
// ✅ CORRETO
const professionals = await prisma.professional.findMany({
  where: {
    businessId: session.user.businessId, // SEMPRE
    active: true
  }
})

// ❌ ERRADO (vaza dados de outros tenants)
const professionals = await prisma.professional.findMany({
  where: {
    active: true
  }
})
```

### Middleware de Autenticação

```typescript
// lib/auth-middleware.ts
export async function requireAuth(req: Request) {
  const session = await getServerSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireBusiness(req: Request) {
  const session = await requireAuth(req)
  if (!session.user.businessId) throw new Error('No business')
  return session
}

export async function requireAdmin(req: Request) {
  const session = await requireAuth(req)
  if (session.user.role !== 'ADMIN') throw new Error('Admin only')
  return session
}
```

## 📅 Sistema de Horários

### Formato de Horários de Trabalho

```json
{
  "monday": { "start": "09:00", "end": "18:00" },
  "tuesday": { "start": "09:00", "end": "18:00" },
  "wednesday": { "start": "09:00", "end": "18:00" },
  "thursday": { "start": "09:00", "end": "18:00" },
  "friday": { "start": "09:00", "end": "18:00" },
  "saturday": { "start": "09:00", "end": "13:00" },
  "sunday": null
}
```

### Algoritmo de Disponibilidade

```typescript
// 1. Buscar profissional
// 2. Verificar se trabalha no dia da semana
// 3. Buscar agendamentos existentes
// 4. Gerar slots disponíveis (intervalos de X minutos)
// 5. Remover slots ocupados
// 6. Remover slots em datas bloqueadas
```

## 💰 Planos e Assinaturas

| Plano | Preço | Profissionais | Agendamentos | WhatsApp | Relatórios |
|-------|-------|---------------|--------------|----------|------------|
| FREE | Trial 14d | 1 | 50/mês | ❌ | Básico |
| BASIC | R$ 49 | 2 | Ilimitado | ❌ | Básico |
| PROFESSIONAL | R$ 99 | 5 | Ilimitado | ✅ | Completo |
| PREMIUM | R$ 199 | Ilimitado | Ilimitado | ✅ | Completo + API |

### Verificação de Limites

```typescript
// Antes de criar agendamento
if (business.plan === 'FREE') {
  const count = await prisma.appointment.count({
    where: {
      businessId,
      createdAt: {
        gte: startOfMonth(new Date())
      }
    }
  })
  
  if (count >= 50) {
    throw new Error('Limite de agendamentos atingido')
  }
}
```

## 🚀 Deploy

### Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="random-string"
NEXTAUTH_URL="https://agendaki.com"

# Email (SendGrid)
SENDGRID_API_KEY="SG..."
EMAIL_FROM="noreply@agendaki.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

### Plataformas Recomendadas

- **Frontend + Backend**: Vercel (grátis até certo limite)
- **Banco de Dados**: Prisma Postgres (via Vercel Storage)
- **Email**: SendGrid (100 emails/dia grátis)
- **Arquivos**: Cloudflare R2 ou AWS S3

## 📈 Métricas e Analytics

### KPIs Principais

**Por Negócio:**
- Total de agendamentos (mês/semana/dia)
- Taxa de comparecimento (% que compareceram)
- Taxa de cancelamento
- Horários mais populares
- Serviços mais solicitados
- Ticket médio

**Global (Admin):**
- MRR (Monthly Recurring Revenue)
- Churn rate
- Novos cadastros
- Negócios ativos vs inativos
- Total de agendamentos na plataforma

## 🔄 Próximas Features (Roadmap)

### Fase 2 (1-2 meses)
- [ ] WhatsApp API para lembretes
- [ ] Relatórios avançados
- [ ] Multi-idioma
- [ ] App mobile (React Native)

### Fase 3 (3-4 meses)
- [ ] Integração Google Calendar
- [ ] Sistema de comissões
- [ ] Controle de estoque básico
- [ ] Programa de fidelidade

### Fase 4 (6+ meses)
- [ ] API pública para integrações
- [ ] Marketplace de plugins
- [ ] White label completo
