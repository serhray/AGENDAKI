#!/bin/bash

# Script de deploy rápido para Vercel
# Uso: ./deploy.sh "mensagem do commit"

echo "🚀 Preparando deploy para Vercel..."

# Verificar se tem mensagem
if [ -z "$1" ]; then
  echo "❌ Erro: Forneça uma mensagem de commit"
  echo "Uso: ./deploy.sh \"sua mensagem\""
  exit 1
fi

# Git add, commit e push
echo "📦 Adicionando arquivos ao git..."
git add .

echo "💾 Fazendo commit..."
git commit -m "$1"

echo "⬆️ Fazendo push para GitHub..."
git push

echo "✅ Deploy iniciado! Acompanhe em: https://vercel.com/dashboard"
echo "🌐 Seu site estará disponível em breve"
