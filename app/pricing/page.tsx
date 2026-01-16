"use client"

import { useState } from "react"
import { Check, Zap, Crown, Star, ArrowRight, ArrowLeft } from "lucide-react"
import { PLANS } from "@/lib/stripe"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (plan: string) => {
    setLoading(plan)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (response.status === 503) {
        alert('Sistema de pagamentos ainda não configurado. Em breve!')
        setLoading(null)
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erro ao criar checkout')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar pagamento')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar</span>
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Escolha o plano ideal para seu negócio
          </h1>
          <p className="text-xl text-gray-300">
            Sistema completo de gestão de agendamentos com IA, lembretes automáticos e relatórios
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Freemium */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
            <div className="mb-6">
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Grátis para sempre</p>
              <h3 className="text-3xl font-bold text-white mb-2">Freemium</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$0</span>
                <span className="text-gray-400">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.FREEMIUM.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => window.location.href = '/register'}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20"
            >
              Começar Grátis
            </button>
          </div>

          {/* Inicial */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
            <div className="mb-6">
              <p className="text-sm text-purple-400 uppercase tracking-wide mb-2">Ideal para autônomos</p>
              <h3 className="text-3xl font-bold text-white mb-2">Inicial</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$49</span>
                <span className="text-gray-400">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.INICIAL.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('INICIAL')}
              disabled={loading === 'INICIAL'}
              className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === 'INICIAL' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Começar Agora
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Profissional */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 relative transform scale-105 shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              Mais Popular
            </div>

            <div className="mb-6">
              <p className="text-sm text-white/80 uppercase tracking-wide mb-2">Para pequenas equipes</p>
              <h3 className="text-3xl font-bold text-white mb-2">Profissional</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$99</span>
                <span className="text-white/80">/mês</span>
              </div>
              <p className="text-sm text-white/90 mt-2 bg-white/10 px-3 py-1 rounded-full inline-block">
                🎉 14 dias grátis
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.PROFESSIONAL.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('PROFESSIONAL')}
              disabled={loading === 'PROFESSIONAL'}
              className="w-full py-3 px-6 bg-white text-purple-600 hover:bg-gray-100 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === 'PROFESSIONAL' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              ) : (
                <>
                  Testar Grátis
                  <Zap className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Premium */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-yellow-500/50 transition-all">
            <div className="mb-6">
              <p className="text-sm text-yellow-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Crown className="w-4 h-4" />
                Solução completa
              </p>
              <h3 className="text-3xl font-bold text-white mb-2">Premium</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$199</span>
                <span className="text-gray-400">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.PREMIUM.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('PREMIUM')}
              disabled={loading === 'PREMIUM'}
              className="w-full py-3 px-6 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === 'PREMIUM' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Contratar Premium
                  <Crown className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-300 flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
