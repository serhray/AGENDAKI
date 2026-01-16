"use client"

import { X, TrendingUp, Crown } from "lucide-react"
import Link from "next/link"

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  resourceName: string
  currentLimit: number
}

export function UpgradePrompt({ isOpen, onClose, resourceName, currentLimit }: UpgradePromptProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500/30 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Limite Atingido!</h3>
              <p className="text-sm text-gray-400">Faça upgrade para continuar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-300">
              Você atingiu o limite de <span className="font-bold text-white">{currentLimit} {resourceName}</span> do seu plano atual.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-300">
              Faça upgrade para um plano superior e tenha acesso a:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <TrendingUp className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Mais {resourceName.toLowerCase()} disponíveis</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <TrendingUp className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Recursos adicionais e funcionalidades premium</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <TrendingUp className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Suporte prioritário e atualizações exclusivas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all font-medium"
          >
            Cancelar
          </button>
          <Link
            href="/pricing"
            className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl font-semibold transition-all text-center shadow-lg"
          >
            Ver Planos
          </Link>
        </div>
      </div>
    </div>
  )
}
