"use client"

import { AlertTriangle, TrendingUp, Zap, Crown } from "lucide-react"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  type: "professional" | "appointment"
  current: number
  limit: number
  currentPlan: string
}

const planDetails = {
  FREEMIUM: { name: "Freemium", price: "R$ 0", upgrade: "INICIAL" },
  INICIAL: { name: "Inicial", price: "R$ 49", upgrade: "PROFESSIONAL" },
  PROFESSIONAL: { name: "Profissional", price: "R$ 99", upgrade: "PREMIUM" },
  PREMIUM: { name: "Premium", price: "R$ 199", upgrade: null },
}

export default function UpgradeModal({
  isOpen,
  onClose,
  type,
  current,
  limit,
  currentPlan,
}: UpgradeModalProps) {
  if (!isOpen) return null

  const plan = planDetails[currentPlan as keyof typeof planDetails]
  const suggestedPlan = plan?.upgrade ? planDetails[plan.upgrade as keyof typeof planDetails] : null

  const getMessage = () => {
    if (type === "professional") {
      return {
        title: "Limite de Profissionais Atingido",
        description: `Você atingiu o limite de ${limit} profissionais do plano ${plan?.name}.`,
        icon: AlertTriangle,
        color: "yellow",
      }
    } else {
      return {
        title: "Limite de Agendamentos Atingido",
        description: `Você atingiu o limite de ${limit} agendamentos mensais do plano ${plan?.name}.`,
        icon: AlertTriangle,
        color: "orange",
      }
    }
  }

  const message = getMessage()
  const IconComponent = message.icon

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-${message.color}-500/20 rounded-full mb-4`}>
            <IconComponent className={`h-8 w-8 text-${message.color}-400`} />
          </div>
          <h2 className="text-3xl font-bold mb-2">{message.title}</h2>
          <p className="text-gray-400">{message.description}</p>
        </div>

        {/* Current Usage */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Uso Atual</span>
            <span className="text-sm font-bold text-red-400">{current} / {limit}</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
              style={{ width: `${(current / limit) * 100}%` }}
            />
          </div>
        </div>

        {/* Upgrade Suggestion */}
        {suggestedPlan && (
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                {plan.upgrade === "PROFESSIONAL" ? (
                  <Zap className="h-5 w-5 text-white" />
                ) : (
                  <Crown className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">Plano {suggestedPlan.name}</h3>
                <p className="text-sm text-gray-400">{suggestedPlan.price}/mês</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {type === "professional" ? (
                <>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    {plan.upgrade === "INICIAL" ? "Até 2 profissionais" : 
                     plan.upgrade === "PROFESSIONAL" ? "Até 6 profissionais" : 
                     "Profissionais ilimitados"}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Agendamentos ilimitados
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Agendamentos ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Todas as funcionalidades
                  </li>
                </>
              )}
            </ul>
            <button
              onClick={() => window.location.href = "/dashboard/planos"}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold transition-all shadow-lg"
            >
              Fazer Upgrade Agora
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all"
          >
            Fechar
          </button>
          <button
            onClick={() => window.location.href = "/dashboard/planos"}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all"
          >
            Ver Planos
          </button>
        </div>
      </div>
    </div>
  )
}
