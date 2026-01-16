# ⚡ COMANDOS RÁPIDOS - AGENDAKI

## 🚀 Começar a Desenvolver

```bash
# 1. Entrar no projeto
cd F:\codi\agendaki

# 2. Instalar dependências (se não instalou)
npm install --legacy-peer-deps

# 3. Configurar banco de dados
# Editar .env com DATABASE_URL

# 4. Criar tabelas
npx prisma migrate dev --name init

# 5. Gerar cliente Prisma
npx prisma generate

# 6. Rodar projeto
npm run dev
```

## 🗄️ Comandos do Prisma

```bash
# Ver dados no navegador
npx prisma studio

# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Sincronizar schema sem migração (dev only)
npx prisma db push

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Gerar cliente (após mudar schema)
npx prisma generate

# Ver status das migrações
npx prisma migrate status
```

## 🛠️ Comandos NPM

```bash
# Desenvolvimento
npm run dev          # Rodar em modo desenvolvimento
npm run build        # Compilar para produção
npm start            # Rodar versão de produção
npm run lint         # Verificar erros de código

# Limpar cache
rm -rf .next         # Deletar pasta de cache
rm -rf node_modules  # Deletar dependências (depois npm install)
```

## 📦 Instalar Novas Dependências

```bash
# Dependência normal
npm install nome-da-lib --legacy-peer-deps

# Dependência de desenvolvimento
npm install -D nome-da-lib --legacy-peer-deps

# Exemplos úteis:
npm install @types/bcryptjs --legacy-peer-deps  # Tipos TypeScript
npm install nodemailer --legacy-peer-deps       # Envio de email
npm install stripe --legacy-peer-deps           # Pagamentos
```

## 🔧 Resolver Problemas Comuns

```bash
# Erro de dependências
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Erro no Prisma
npx prisma generate
npx prisma db push

# Erro no Next.js
rm -rf .next
npm run dev

# Ver logs detalhados
npm run dev -- --debug
```

## 🎨 Gerar Componentes (Manual)

```bash
# Criar novo componente
cd F:\codi\agendaki\components
mkdir nome-componente
cd nome-componente
New-Item index.tsx
```

## 📊 Ver Status do Projeto

```bash
# Ver estrutura de arquivos
tree /F

# Ver portas em uso
netstat -ano | findstr :3000

# Ver versões
node --version
npm --version
npx prisma --version
```

## 🔑 Gerar Secrets

```bash
# Secret para NextAuth
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou online:
# https://generate-secret.vercel.app/32
```

## 📝 Git (Versionamento)

```bash
# Inicializar repositório
git init
git add .
git commit -m "Initial commit: estrutura do projeto"

# Conectar com GitHub
git remote add origin https://github.com/seu-usuario/agendaki.git
git push -u origin main
```

## 🧪 Testar Conexão do Banco

```bash
# Abrir Prisma Studio
npx prisma studio

# Testar query (criar arquivo test.ts)
node test.ts
```

## 📱 Rodar em Produção

```bash
# Build
npm run build

# Testar build localmente
npm start

# Deploy (Vercel)
npm install -g vercel
vercel

# Ou GitHub Actions (configurar depois)
```

## 🐛 Debug

```bash
# Rodar com inspetor
node --inspect $(npm bin)/next dev

# Ver logs do Prisma
DATABASE_URL=... npx prisma db push --schema=./prisma/schema.prisma

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 💡 Dicas Rápidas

```bash
# Abrir VS Code no projeto
code F:\codi\agendaki

# Abrir browser automaticamente
npm run dev -- --open

# Mudar porta
npm run dev -- --port 3001

# Ver tamanho do build
npm run build
npm run analyze  # (se configurado)
```

## 🔒 Variáveis de Ambiente

```bash
# Nunca commitar o .env!
# Criar .env.example para referência:

cp .env .env.example
# Remover valores sensíveis do .env.example
```

## 📦 Atualizar Dependências

```bash
# Ver versões desatualizadas
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar específica
npm install next@latest --legacy-peer-deps
```

## 🎯 Próximos Comandos Úteis

Quando implementarmos mais features, adicione aqui os comandos específicos!
