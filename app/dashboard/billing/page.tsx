"use client"

import { useEffect, useState } from "react"
import { Crown, Check, AlertCircle, CreditCard, Calendar as CalendarIcon, TrendingUp } from "lucide-react"
import { PlanBadge } from "@/components/PlanBadge"
import { UsageMeter } from "@/components/UsageMeter"
import { PLANS } from "@/lib/stripe"
import Link from "next/link"

export default function BillingPage() {
  const [loading, setLoading] = useState(true)
  const [businessInfo, setBusinessInfo] = useState<any>(null)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    fetch('/api/business/info')
      .then(res => res.json())
      .then(data => {
        setBusinessInfo(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Você continuará tendo acesso até o fim do período pago.')) {
      return
    }

    setCanceling(true)
    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST'
      })

      if (res.ok) {
        alert('Assinatura cancelada com sucesso')
        window.location.reload()
      } else {
        alert('Erro ao cancelar assinatura')
      }
    } catch (error) {
      alert('Erro ao cancelar assinatura')
    } finally {
      setCanceling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  const business = businessInfo?.business
  const usage = businessInfo?.usage
  const currentPlan = PLANS[business?.plan as keyof typeof PLANS]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Assinatura e Cobrança
        </h1>
        <p className="text-gray-400">
          Gerencie seu plano, pagamentos e uso de recursos
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">Plano Atual</h2>
              <PlanBadge plan={business?.plan} planStatus={business?.planStatus} />
            </div>
            <p className="text-gray-400">
              {currentPlan?.name || 'Freemium'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">
              R${currentPlan?.price || 0}
            </div>
            <div className="text-sm text-gray-400">/mês</div>
          </div>
        </div>

        {business?.planStatus === 'TRIAL' && business?.trialEndsAt && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                Período de teste - Expira em {new Date(business.trialEndsAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        )}

        {business?.trialEndsAt && business?.planStatus !== 'TRIAL' && (
          <div className="flex items-center gap-2 text-gray-400 mb-6">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm">
              Renovação: {new Date(business.trialEndsAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentPlan?.features.slice(0, 4).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-300">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          {business?.plan !== 'PREMIUM' && (
            <Link href="/pricing" className="flex-1">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Fazer Upgrade
              </button>
            </Link>
          )}
          
          {business?.stripeCustomerId && business?.plan !== 'FREEMIUM' && (
            <button 
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {canceling ? 'Cancelando...' : 'Cancelar Assinatura'}
            </button>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Uso de Recursos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UsageMeter
            label="Profissionais"
            current={usage?.professionals.current || 0}
            limit={usage?.professionals.limit || 1}
            showUpgrade={business?.plan !== 'PREMIUM'}
          />
          <UsageMeter
            label="Agendamentos (mês)"
            current={usage?.appointments.current || 0}
            limit={usage?.appointments.limit || 20}
            showUpgrade={business?.plan !== 'PREMIUM'}
          />
          <UsageMeter
            label="Serviços"
            current={usage?.services.current || 0}
            limit={usage?.services.limit || 3}
            showUpgrade={business?.plan !== 'PREMIUM'}
          />
        </div>
      </div>

      {/* Compare Plans */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Comparar Planos</h3>
        <Link href="/pricing">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">
                  Ver todos os planos disponíveis
                </h4>
                <p className="text-gray-400 text-sm">
                  Compare recursos e escolha o melhor plano para seu negócio
                </p>
              </div>
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </Link>
      </div>

      {/* Payment Method */}
      {business?.stripeCustomerId && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Método de Pagamento</h3>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-medium">Gerenciado pelo Stripe</p>
                <p className="text-gray-400 text-sm">
                  Configure seu método de pagamento no Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
