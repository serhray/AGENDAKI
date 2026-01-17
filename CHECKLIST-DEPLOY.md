# 📝 CHECKLIST PRÉ-DEPLOY

## ✅ ANTES DE FAZER O PRIMEIRO DEPLOY

### 1. Banco de Dados
- [x] Banco de dados configurado (Prisma Postgres via Vercel Storage)
- [ ] Criar banco de dados
- [ ] Copiar DATABASE_URL
- [ ] Copiar DIRECT_URL (se aplicável)

### 2. Email
- [ ] Gerar senha de app do Gmail
- [ ] Testar envio local antes

### 3. NextAuth
- [ ] Gerar NEXTAUTH_SECRET (use: `openssl rand -base64 32`)
- [ ] Definir NEXTAUTH_URL (será o domínio da Vercel)

### 4. Git & GitHub
- [ ] Repositório criado no GitHub
- [ ] Código commitado e pushed
- [ ] .env NÃO está no repositório

### 5. Vercel
- [ ] Conta criada
- [ ] Projeto importado
- [ ] Variáveis de ambiente configuradas

---

## ✅ PÓS-DEPLOY (Primeiro Deploy)

### 1. Migrations
- [ ] Rodar `npx prisma migrate deploy` com DATABASE_URL de produção

### 2. Testes Iniciais
- [ ] Site carrega
- [ ] Pode fazer login
- [ ] Pode criar conta
- [ ] Dashboard funciona

### 3. Dados de Teste
- [ ] Criar primeiro negócio
- [ ] Criar profissional de teste
- [ ] Criar serviço de teste
- [ ] Fazer agendamento de teste

### 4. Email
- [ ] Testar envio de confirmação
- [ ] Verificar se emails chegam

### 5. Admin
- [ ] Promover usuário a ADMIN: `node make-admin.js email@exemplo.com`
- [ ] Testar acesso ao painel admin

---

## ✅ ANTES DE CONFIGURAR STRIPE

### 1. Conta Stripe
- [ ] Criar conta em https://stripe.com
- [ ] Ativar modo de teste
- [ ] Copiar chaves de teste (pk_test e sk_test)

### 2. Webhook
- [ ] Configurar endpoint: `https://seu-dominio.vercel.app/api/stripe/webhooks`
- [ ] Copiar WEBHOOK_SECRET
- [ ] Adicionar variável na Vercel

### 3. Produtos Stripe
- [ ] Criar produto "INICIAL" (R$ 49/mês)
- [ ] Criar produto "PROFESSIONAL" (R$ 99/mês)
- [ ] Criar produto "PREMIUM" (R$ 199/mês)
- [ ] Copiar Price IDs

---

## ✅ SEGURANÇA

### Verificar:
- [ ] .env não está commitado
- [ ] .env.example está atualizado
- [ ] Senhas/secrets não estão hardcoded
- [ ] NEXTAUTH_SECRET é forte (32+ caracteres)
- [ ] DATABASE_URL tem ?sslmode=require

---

## 🚨 PROBLEMAS COMUNS

### Build falha
1. Verificar logs da Vercel
2. Testar `npm run build` localmente
3. Verificar versão do Node (use LTS)

### Banco não conecta
1. Verificar se DATABASE_URL está correta
2. Verificar se ?sslmode=require está presente
3. Testar conexão local primeiro

### Emails não enviam
1. Verificar senha de app (não senha normal do Gmail)
2. Verificar se EMAIL_USER e EMAIL_PASS estão corretos
3. Testar localmente primeiro

### Prisma não funciona
1. Rodar migrations: `npx prisma migrate deploy`
2. Verificar se postinstall está rodando
3. Redeploy forçado: `vercel --force`

---

## 📱 CONTATOS DE SUPORTE

- **Vercel**: https://vercel.com/support
- **Prisma**: https://www.prisma.io/docs
- **Stripe**: https://support.stripe.com
- **Next.js**: https://nextjs.org/docs

---

**Última atualização**: 15/01/2026
