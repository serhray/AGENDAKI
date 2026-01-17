# 🚀 GUIA DE DEPLOY - VERCEL

## 📋 PRÉ-REQUISITOS

### 1. Criar conta na Vercel
- Acesse: https://vercel.com
- Login com GitHub (recomendado)

### 2. Banco de Dados (PostgreSQL)
**Opção A: Vercel Postgres (Recomendado)**
- Integrado com Vercel
- Setup automático
- Free tier: 256MB storage

**Opção B: Prisma Postgres (Recomendado - já configurado)**
- Banco já criado e conectado via Vercel Storage
- Criar novo projeto
- Copiar DATABASE_URL (Connection String - Transaction)

**Opção C: Neon (Gratuito)**
- Acesse: https://neon.tech
- Criar novo projeto
- Copiar Connection String

### 3. Configurar Email (Gmail)
- Acesse: https://myaccount.google.com/apppasswords
- Criar "Senha de App" para AGENDAKI
- Copiar a senha de 16 dígitos

---

## 🔧 PASSO A PASSO

### PASSO 1: Preparar Repositório Git

```bash
# Se ainda não tem git inicializado
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: deploy inicial AGENDAKI"

# Criar repositório no GitHub
# Acesse: https://github.com/new
# Nome: agendaki

# Adicionar remote e push
git remote add origin https://github.com/SEU_USUARIO/agendaki.git
git branch -M main
git push -u origin main
```

---

### PASSO 2: Importar Projeto na Vercel

1. **Acesse**: https://vercel.com/new
2. **Selecione**: "Import Git Repository"
3. **Escolha**: seu repositório `agendaki`
4. **Configure**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build` (já configurado)
   - Output Directory: `.next` (automático)
   - Install Command: `npm install` (automático)

---

### PASSO 3: Configurar Variáveis de Ambiente

Na Vercel, adicione as seguintes variáveis de ambiente:

#### **Banco de Dados**
```env
DATABASE_URL="postgresql://user:pass@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://user:pass@host:5432/database?sslmode=require"
```

#### **NextAuth**
```env
NEXTAUTH_SECRET="gere-uma-string-aleatoria-segura-aqui"
NEXTAUTH_URL="https://seu-dominio.vercel.app"
```

**Gerar NEXTAUTH_SECRET:**
```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### **Email (Gmail)**
```env
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-de-app-16-digitos"
EMAIL_FROM="AGENDAKI <seu-email@gmail.com>"
```

#### **Stripe (Opcional - para depois)**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### **Ambiente**
```env
NODE_ENV="production"
```

---

### PASSO 4: Deploy

1. **Clique em "Deploy"** na Vercel
2. **Aguarde** o build (2-5 minutos)
3. **Vercel irá**:
   - Instalar dependências
   - Executar `prisma generate`
   - Build do Next.js
   - Deploy automático

---

### PASSO 5: Executar Migrations

**IMPORTANTE**: Após primeiro deploy, rodar migrations:

#### **Opção A: Via Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link ao projeto
vercel link

# Rodar migration
vercel env pull .env.production
npx prisma migrate deploy
```

#### **Opção B: Via Terminal Local**
```bash
# Usar DATABASE_URL da produção
DATABASE_URL="sua-url-producao" npx prisma migrate deploy

# Popular dados iniciais (se necessário)
DATABASE_URL="sua-url-producao" npx prisma db seed
```

---

### PASSO 6: Verificações Pós-Deploy

#### **Checklist:**
- [ ] Site carrega: `https://seu-app.vercel.app`
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Dashboard carrega
- [ ] Criação de profissionais funciona
- [ ] Criação de serviços funciona
- [ ] Agendamento funciona
- [ ] Emails são enviados
- [ ] Página pública funciona: `https://seu-app.vercel.app/seu-slug`

#### **Testar Admin:**
```bash
# Promover usuário a ADMIN
DATABASE_URL="sua-url-producao" node make-admin.js seu-email@gmail.com
```

---

## 🌐 CONFIGURAR DOMÍNIO CUSTOMIZADO (Opcional)

### Via Vercel:
1. Vá em "Settings" → "Domains"
2. Adicione seu domínio: `agendaki.com.br`
3. Configure DNS:
   - **CNAME**: `www` → `cname.vercel-dns.com`
   - **A**: `@` → `76.76.21.21`
4. Aguarde propagação (até 48h)

### Atualizar NEXTAUTH_URL:
```env
NEXTAUTH_URL="https://agendaki.com.br"
```

---

## 🔄 DEPLOYS AUTOMÁTICOS

Após setup inicial, cada `git push` para `main` fará deploy automático:

```bash
# Fazer alterações
git add .
git commit -m "feat: nova funcionalidade"
git push

# Vercel detecta e faz deploy automaticamente
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
vercel --force
```

### Erro: Prisma
```bash
# Regenerar Prisma Client
npx prisma generate
git add .
git commit -m "fix: regenerate prisma"
git push
```

### Erro: Environment Variables
- Verificar se todas as variáveis estão configuradas
- Redeploy após adicionar variáveis: "Deployments" → "..." → "Redeploy"

### Emails não enviam
- Verificar se EMAIL_PASS está correta (senha de app, não senha normal)
- Ativar "Acesso a app menos seguro" se necessário
- Testar localmente primeiro

---

## 📊 MONITORAMENTO

### Vercel Dashboard
- **Analytics**: Visitas, performance
- **Logs**: Erros em tempo real
- **Speed Insights**: Core Web Vitals

### Comandos úteis:
```bash
# Ver logs em tempo real
vercel logs

# Ver deployments
vercel ls

# Ver domínios
vercel domains ls
```

---

## 💰 PLANOS VERCEL

### **Hobby (Gratuito)**
- ✅ 100 GB bandwidth/mês
- ✅ Domínios customizados
- ✅ SSL automático
- ✅ Unlimited deploys
- ⚠️ Sem Edge Config
- ⚠️ Sem Analytics avançado

### **Pro ($20/mês)**
- ✅ 1 TB bandwidth
- ✅ Analytics avançado
- ✅ Proteção DDoS
- ✅ Suporte prioritário
- ✅ Password Protection

**Recomendação**: Começar com Hobby, upgrade quando necessário

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY

1. ✅ **Testar tudo em produção**
2. ✅ **Criar primeiros dados de teste**
3. ✅ **Configurar Stripe em produção**
4. ✅ **Adicionar webhooks do Stripe**
5. ✅ **Fazer primeiro pagamento de teste**
6. 🚀 **Lançar para clientes reais!**

---

## 📞 SUPORTE

- **Vercel**: https://vercel.com/support
- **Documentação**: https://vercel.com/docs
- **Status**: https://vercel-status.com

---

**Última atualização**: 15/01/2026
