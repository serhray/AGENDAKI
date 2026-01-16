# 📧 CONFIGURAÇÃO RÁPIDA DE EMAIL - 5 MINUTOS

## ✅ Status: Dependências Instaladas ✅

Agora só falta configurar o provedor de email!

---

## 🚀 OPÇÃO 1: Gmail (Mais Rápido - 2 minutos)

### Passo 1: Criar Senha de App no Gmail

1. Acesse: https://myaccount.google.com/apppasswords
2. **Importante**: Você precisa ter **Verificação em 2 etapas ativada**!
3. Clique em "Criar" ou "Select app"
4. Escolha "Outro (nome personalizado)"
5. Digite: "AGENDAKI"
6. Clique em "Gerar"
7. **COPIE** a senha de 16 caracteres (formato: xxxx xxxx xxxx xxxx)

### Passo 2: Adicionar ao .env

Abra o arquivo `.env` e adicione:

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM="AGENDAKI <noreply@agendaki.com>"

# Cron Security Token
CRON_SECRET=minha-chave-secreta-123456
```

**Substitua:**
- `seu-email@gmail.com` → Seu email do Gmail
- `xxxx xxxx xxxx xxxx` → A senha de 16 dígitos que você copiou

### Passo 3: Testar!

```bash
npm run dev
```

Acesse o dashboard, crie um agendamento, e teste o envio de email!

---

## 🧪 OPÇÃO 2: Mailtrap (Para Teste - Não Envia Email Real)

**Melhor para desenvolvimento** - Todos emails ficam presos no Mailtrap, não chegam de verdade.

### Passo 1: Criar conta

1. Acesse: https://mailtrap.io
2. Crie conta gratuita
3. Vá em "Email Testing" → "Inboxes"
4. Clique na sua inbox
5. Copie as credenciais SMTP

### Passo 2: Adicionar ao .env

```env
# Email Configuration (Mailtrap - Teste)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu-usuario-mailtrap
EMAIL_PASS=sua-senha-mailtrap
EMAIL_FROM="AGENDAKI <noreply@agendaki.com>"

# Cron Security Token
CRON_SECRET=minha-chave-secreta-123456
```

### Passo 3: Testar!

Emails não chegarão de verdade, mas aparecerão na inbox do Mailtrap!

---

## 🎯 PRÓXIMO PASSO: Testar Sistema

### 1. Iniciar servidor

```bash
npm run dev
```

### 2. Criar um agendamento de teste

1. Acesse: http://localhost:3000/dashboard/agendamentos
2. Crie um novo agendamento
3. **IMPORTANTE**: Use um email válido no cliente (seu próprio email para teste)

### 3. Enviar email de confirmação

Você pode:
- **Opção A**: Adicionar botão no dashboard (vou te ajudar depois)
- **Opção B**: Testar via API diretamente

#### Teste via API (use Postman ou curl):

```bash
# Substitua ID_DO_AGENDAMENTO pelo ID real
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Cookie: seu-cookie-de-sessao" \
  -d '{"appointmentId":"ID_DO_AGENDAMENTO","type":"confirmation"}'
```

### 4. Verificar email

- **Gmail**: Cheque sua caixa de entrada (ou spam)
- **Mailtrap**: Cheque a inbox no site do Mailtrap

---

## ✅ Checklist Final

- [ ] Gmail: Verificação em 2 etapas ativada
- [ ] Gmail: Senha de App criada
- [ ] `.env`: Credenciais configuradas
- [ ] Servidor rodando (`npm run dev`)
- [ ] Agendamento de teste criado
- [ ] Email enviado e recebido

---

## 🐛 Problemas Comuns

### "Invalid login" ou "Authentication failed"

**Gmail:**
- Você precisa criar uma **Senha de App**, não use sua senha normal!
- Verificação em 2 etapas precisa estar ativada
- Formato correto: `xxxx xxxx xxxx xxxx` (com espaços ou sem)

**Solução:**
1. Vá em: https://myaccount.google.com/apppasswords
2. Delete a senha antiga
3. Crie uma nova
4. Copie e cole no .env

### Email não chega

1. **Verifique Spam** - Primeira vez sempre vai para spam
2. **Use Mailtrap** - Para garantir que está enviando
3. **Veja o console** - Deve aparecer "Email enviado: messageId"

### "Cannot find module 'nodemailer'"

```bash
npm install --legacy-peer-deps
```

---

## 🚀 Depois de Funcionar

### Para Produção (Deploy):

1. **Não use Gmail em produção!** Limite de 500 emails/dia
2. **Migre para Resend ou SendGrid:**
   - Resend: 3.000 emails/mês grátis - https://resend.com
   - SendGrid: 100 emails/dia grátis - https://sendgrid.com
   - Brevo: 300 emails/dia grátis - https://brevo.com

### Configurar Cron Job:

Quando fizer deploy, configure um cron job para chamar:
```
GET https://seu-dominio.com/api/cron/reminders
Authorization: Bearer seu-CRON_SECRET
```

Frequência: A cada 1 hora

Serviços gratuitos de cron:
- cron-job.org
- EasyCron
- Vercel Cron (se hospedar na Vercel)

---

## 📞 Precisa de Ajuda?

Me chame que te ajudo a:
- Adicionar botão de "Enviar Email" no dashboard
- Enviar email automático ao criar agendamento
- Configurar outros provedores
- Debugar problemas

**Seu sistema está 99% pronto! Só falta testar os emails! 🎉**
