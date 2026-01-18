# Configuração do Stripe para AGENDAKI

Este guia explica como configurar os pagamentos via Stripe no AGENDAKI.

## 1. Criar conta Stripe

1. Acesse https://dashboard.stripe.com/register
2. Crie sua conta
3. Acesse o Dashboard: https://dashboard.stripe.com

## 2. Criar os produtos no Stripe

### Plano INICIAL (R$ 49/mês)
1. No Dashboard Stripe, vá em **Products** → **Add Product**
2. Preencha:
   - **Name**: AGENDAKI - Plano Inicial
   - **Description**: Até 2 profissionais, agendamentos ilimitados
   - **Pricing**: Recurring
   - **Price**: R$ 49,00 BRL
   - **Billing period**: Monthly
3. Clique em **Save**
4. **Copie o Price ID** (começa com `price_...`)

### Plano PROFESSIONAL (R$ 99/mês)
1. **Add Product** novamente
2. Preencha:
   - **Name**: AGENDAKI - Plano Profissional
   - **Description**: Até 6 profissionais, recursos avançados
   - **Pricing**: Recurring
   - **Price**: R$ 99,00 BRL
   - **Billing period**: Monthly
   - **Free trial**: 14 days
3. Clique em **Save**
4. **Copie o Price ID**

### Plano PREMIUM (R$ 199/mês)
1. **Add Product** novamente
2. Preencha:
   - **Name**: AGENDAKI - Plano Premium
   - **Description**: Até 15 profissionais, suporte 24/7
   - **Pricing**: Recurring
   - **Price**: R$ 199,00 BRL
   - **Billing period**: Monthly
3. Clique em **Save**
4. **Copie o Price ID**

## 3. Obter as chaves de API

1. No Dashboard Stripe, vá em **Developers** → **API keys**
2. Copie:
   - **Publishable key** (começa com `pk_test_...` ou `pk_live_...`)
   - **Secret key** (começa com `sk_test_...` ou `sk_live_...`)

⚠️ **IMPORTANTE**: Use as chaves **test** para desenvolvimento!

## 4. Configurar Webhook

1. No Dashboard Stripe, vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. Preencha:
   - **Endpoint URL**: `https://agendaki-rose.vercel.app/api/stripe/webhook`
   - **Description**: AGENDAKI Webhook
   - **Events to send**:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Clique em **Add endpoint**
5. **Copie o Signing secret** (começa com `whsec_...`)

## 5. Adicionar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_seu_secret_key_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_seu_publishable_key_aqui

# Stripe Price IDs
STRIPE_PRICE_INICIAL=price_seu_price_id_inicial
STRIPE_PRICE_PROFESSIONAL=price_seu_price_id_professional
STRIPE_PRICE_PREMIUM=price_seu_price_id_premium

# Stripe Webhook
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui
```

## 6. Adicionar no Vercel

1. No projeto Vercel, vá em **Settings** → **Environment Variables**
2. Adicione todas as variáveis acima
3. Faça um novo deploy ou espere o próximo push

## 7. Testar

### Modo Test (desenvolvimento)
Use os cartões de teste do Stripe:
- **Sucesso**: 4242 4242 4242 4242
- **Falha**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155
- **Data de expiração**: Qualquer data futura
- **CVC**: Qualquer 3 dígitos
- **ZIP**: Qualquer 5 dígitos

### Modo Live (produção)
1. Ative a conta no Stripe (verificação necessária)
2. Substitua as chaves test por live
3. Atualize o webhook URL no modo live

## Fluxo de Pagamento

1. Cliente clica em "Fazer Upgrade" no dashboard
2. Sistema cria uma Checkout Session no Stripe
3. Cliente é redirecionado para o Stripe Checkout
4. Após pagamento, Stripe envia webhook
5. Sistema atualiza o plano automaticamente
6. Cliente volta para o dashboard com novo plano ativo

## Comandos úteis

```bash
# Mudar plano manualmente (desenvolvimento)
npx tsx scripts/change-plan.ts email@exemplo.com INICIAL

# Ver logs do Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Recursos

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Docs](https://docs.stripe.com)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhook Testing](https://dashboard.stripe.com/test/webhooks)
