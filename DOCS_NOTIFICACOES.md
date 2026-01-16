# 📧 FASE 9 - SISTEMA DE NOTIFICAÇÕES POR EMAIL

## ✅ Arquivos Criados

1. **`lib/email.ts`** - Sistema completo de emails
   - Configuração do transportador (Nodemailer)
   - Templates HTML para confirmação, lembrete e cancelamento
   - Função `sendEmail()` genérica

2. **`app/api/notifications/send/route.ts`** - API para envio manual
   - Envia confirmação, lembrete ou cancelamento
   - Registra no banco (tabela Notification)
   - Uso: `POST /api/notifications/send` com `{ appointmentId, type }`

3. **`app/api/cron/reminders/route.ts`** - Cron job automático
   - Busca agendamentos nas próximas 24h e 2h
   - Envia lembretes automaticamente
   - Protegido por token secreto
   - Uso: `GET /api/cron/reminders` (via cron externo)

4. **Schema atualizado** - Model Notification adicionado ao Prisma

---

## 🔧 CONFIGURAÇÃO

### 1. Instalar Nodemailer

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### 2. Configurar Variáveis de Ambiente

Adicione ao `.env`:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM="AGENDAKI <noreply@agendaki.com>"

# Cron Security
CRON_SECRET=seu-token-secreto-aleatorio-aqui
```

### 3. Atualizar Database

```bash
npx prisma db push
```

---

## 📧 OPÇÕES DE EMAIL PROVIDER

### Opção 1: Gmail (Desenvolvimento/Teste)
1. Vá em: https://myaccount.google.com/apppasswords
2. Crie uma "Senha de App"
3. Use no `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=senha-de-app-gerada
   ```

### Opção 2: Resend (Recomendado para Produção)
- Site: https://resend.com
- **FREE**: 3.000 emails/mês
- Mais confiável que Gmail
- Configuração:
  ```bash
  npm install resend
  ```
  ```env
  RESEND_API_KEY=re_xxxxxxxxxxxxx
  ```

### Opção 3: SendGrid
- Site: https://sendgrid.com
- **FREE**: 100 emails/dia
- Configuração:
  ```env
  EMAIL_HOST=smtp.sendgrid.net
  EMAIL_PORT=587
  EMAIL_USER=apikey
  EMAIL_PASS=sua-api-key
  ```

### Opção 4: Brevo (ex-Sendinblue)
- Site: https://www.brevo.com
- **FREE**: 300 emails/dia
- Ótimo para Brasil

---

## 🤖 CONFIGURAR CRON JOB

### Opção 1: Vercel Cron (Recomendado se usar Vercel)

Criar `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 */1 * * *"
  }]
}
```

### Opção 2: cron-job.org (Gratuito, qualquer hospedagem)

1. Acesse: https://cron-job.org/en/
2. Crie conta gratuita
3. Adicione job:
   - URL: `https://seu-dominio.com/api/cron/reminders`
   - Frequência: A cada 1 hora
   - Headers: `Authorization: Bearer seu-token-secreto`

### Opção 3: EasyCron
- Site: https://www.easycron.com
- FREE: 100 execuções/mês

---

## 🎯 COMO USAR

### 1. Envio Manual (via Dashboard)

No código do dashboard, adicione botão para enviar:

```typescript
const handleSendConfirmation = async (appointmentId: string) => {
  const response = await fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appointmentId,
      type: 'confirmation' // ou 'reminder', 'cancellation'
    })
  })
  
  const data = await response.json()
  if (data.success) {
    alert('Email enviado!')
  }
}
```

### 2. Envio Automático ao Criar Agendamento

No `app/api/appointments/route.ts` (POST), após criar:

```typescript
// Criar appointment...
const appointment = await prisma.appointment.create({...})

// Enviar confirmação automática
await fetch(`${process.env.NEXTAUTH_URL}/api/notifications/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appointmentId: appointment.id,
    type: 'confirmation'
  })
})
```

### 3. Lembretes Automáticos

Configure o cron job (ver seção acima) para chamar `/api/cron/reminders` a cada 1 hora.

---

## 🧪 TESTAR LOCALMENTE

### 1. Testar Envio Manual

```bash
# No navegador ou Postman:
POST http://localhost:3000/api/notifications/send
Content-Type: application/json

{
  "appointmentId": "id-do-agendamento",
  "type": "confirmation"
}
```

### 2. Testar Cron de Lembretes

```bash
# No navegador ou terminal:
GET http://localhost:3000/api/cron/reminders
Authorization: Bearer seu-token-secreto
```

---

## 📊 MONITORAMENTO

Todos os emails enviados são registrados na tabela `Notification`:

```typescript
// Ver histórico de notificações
const notifications = await prisma.notification.findMany({
  where: { appointmentId: 'xxx' },
  orderBy: { sentAt: 'desc' }
})
```

---

## 🎨 TEMPLATES INCLUÍDOS

1. **Confirmação** - Email bonito com:
   - Detalhes do agendamento
   - Informações do local
   - Lembrete para chegar cedo

2. **Lembrete (24h/2h antes)** - Email chamativo com:
   - Countdown do horário
   - Detalhes completos
   - Dicas de pontualidade

3. **Cancelamento** - Email simples informando:
   - Que foi cancelado
   - Como reagendar

Todos com design responsivo e cores do AGENDAKI! 🎨

---

## 🚀 PRÓXIMOS PASSOS

1. **Agora**: Instale o Nodemailer e configure Gmail para teste
2. **Depois**: Configure um provedor profissional (Resend/SendGrid)
3. **Deploy**: Configure o cron job em produção
4. **Evolução**: Adicione WhatsApp, SMS, etc

---

## 💡 DICAS

- **Desenvolvimento**: Use Gmail ou serviço de teste (Mailtrap)
- **Produção**: Use Resend ou SendGrid (melhor deliverability)
- **Segurança**: Nunca commite as credenciais (use .env)
- **Logs**: Monitore a tabela Notification para ver taxa de sucesso
- **Teste**: Sempre teste com seu próprio email primeiro!

---

**Status**: ✅ Fase 9 implementada - Sistema de notificações pronto!
