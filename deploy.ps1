# Script de deploy rápido para Vercel (Windows)
# Uso: .\deploy.ps1 "mensagem do commit"

param(
    [Parameter(Mandatory=$true)]
    [string]$message
)

Write-Host "🚀 Preparando deploy para Vercel..." -ForegroundColor Cyan

# Git add, commit e push
Write-Host "📦 Adicionando arquivos ao git..." -ForegroundColor Yellow
git add .

Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
git commit -m $message

Write-Host "⬆️ Fazendo push para GitHub..." -ForegroundColor Yellow
git push

Write-Host "✅ Deploy iniciado! Acompanhe em: https://vercel.com/dashboard" -ForegroundColor Green
Write-Host "🌐 Seu site estará disponível em breve" -ForegroundColor Green
