const fs = require('fs');
const content = `"use client"

import { Calendar, Users, BarChart3, Sparkles, Clock, Shield, TrendingUp, CheckCircle2, Star, ArrowRight, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-transparent animate-pulse" style={{ animationDuration: "10s" }} />
      
      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI</h1>
                  <p className="text-xs text-gray-400">Agendamento Inteligente</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium">
                  Entrar
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold flex items-center gap-2">
                  Começar Grátis <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 pt-24 pb-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8" style={{ animation: "fadeIn 0.6s ease-out forwards" }}>
              <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
              <span className="text-sm text-indigo-300 font-medium">Mais de 1000 negócios confiam na gente</span>
            </div>

            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{ animation: "slideUp 0.6s ease-out forwards", opacity: 0 }}>
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Agendamentos que
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Convertem Mais
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed" style={{ animation: "slideUp 0.6s ease-out 0.1s forwards", opacity: 0 }}>
              Transforme visitantes em clientes com um sistema de agendamento moderno, rápido e totalmente personalizável para seu negócio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12" style={{ animation: "slideUp 0.6s ease-out 0.2s forwards", opacity: 0 }}>
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-lg font-semibold hover:from-indigo-500 hover:to-purple-500 hover:scale-105 transition-all duration-300 shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 flex items-center gap-2 group">
                Testar 14 Dias Grátis
                <Zap className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
              </button>
              <button className="px-8 py-4 border-2 border-white/20 text-white rounded-xl text-lg font-semibold hover:bg-white/5 hover:border-white/40 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                Ver Como Funciona
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Cancele quando quiser
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Suporte em português
              </div>
            </div>
          </div>
        </section>`;
fs.writeFileSync('app/page_test.tsx', content, 'utf8');
console.log('OK');
