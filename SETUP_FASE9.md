# 🚀 SETUP RÁPIDO - FASE 9 (Notificações)

## 📦 Instalação

```bash
npm install
```

## 🗄️ Atualizar Banco de Dados

```bash
npx prisma db push
npx prisma generate
```

## 🔧 Configurar Email (Escolha UMA opção)

### Opção 1: Gmail (Mais Rápido para Testar)

1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma "Senha de App"
3. Adicione ao `.env`:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM="AGENDAKI <noreply@agendaki.com>"

# Cron Security
CRON_SECRET=qualquer-string-secreta-aleatoria-123
```

### Opção 2: Mailtrap (Para Desenvolvimento/Teste)

1. Crie conta em: https://mailtrap.io
2. Pegue as credenciais SMTP
3. Adicione ao `.env`:

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu-usuario
EMAIL_PASS=sua-senha
EMAIL_FROM="AGENDAKI <noreply@agendaki.com>"
CRON_SECRET=qualquer-string-secreta-aleatoria-123
```

**Vantagem**: Todos emails ficam na inbox do Mailtrap, não envia de verdade!

## ✅ Testar Sistema

### 1. Iniciar servidor

```bash
npm run dev
```

### 2. Testar envio manual

Abra o navegador em: http://localhost:3000/api/notifications/send

Ou use este script de teste:

```bash
# Criar arquivo test-email.js
node test-email.js
```

```javascript
// test-email.js
const appointmentId = "ID_DE_UM_AGENDAMENTO_EXISTENTE"

fetch('http://localhost:3000/api/notifications/send', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Cookie': 'seu-cookie-de-sessão'
  },
  body: JSON.stringify({
    appointmentId,
    type: 'confirmation'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Resposta:', data))
.catch(err => console.error('❌ Erro:', err))
```

### 3. Testar Cron de Lembretes

```bash
# No terminal ou navegador:
curl -H "Authorization: Bearer qualquer-string-secreta-aleatoria-123" http://localhost:3000/api/cron/reminders
```

## 🎯 Próximos Passos

1. ✅ Configurar email provider
2. ✅ Testar envio manual
3. ⏳ Adicionar botão "Enviar Confirmação" no dashboard de agendamentos
4. ⏳ Enviar email automático ao criar agendamento
5. ⏳ Configurar cron job em produção (quando fizer deploy)

## 📝 Notas Importantes

- **Gmail**: Limite de 500 emails/dia (suficiente para começar)
- **Mailtrap**: Ideal para desenvolvimento, não envia emails de verdade
- **Produção**: Depois migre para Resend (3.000 emails/mês grátis) ou SendGrid

## 🐛 Troubleshooting

### Erro "Invalid login"
- Gmail: Verifique se criou Senha de App (não é a senha normal!)
- Verifique se 2FA está ativado no Gmail

### Emails não chegam
- Verifique pasta de Spam
- Use Mailtrap para testar sem enviar de verdade
- Veja logs no console do terminal

### Prisma Error
```bash
# Limpar e recriar
npx prisma db push --force-reset
npx prisma generate
```
