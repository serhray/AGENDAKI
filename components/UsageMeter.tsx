"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface UsageMeterProps {
  label: string
  current: number
  limit: number
  unit?: string
  showUpgrade?: boolean
}

export function UsageMeter({ label, current, limit, unit = "", showUpgrade = true }: UsageMeterProps) {
  const percentage = limit === 9999 ? 0 : (current / limit) * 100
  const isUnlimited = limit === 9999
  const isNearLimit = percentage >= 80
  const isAtLimit = current >= limit

  return (
    <div className={`p-4 rounded-lg border ${isAtLimit ? 'bg-red-50 border-red-200' : isNearLimit ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-600'}`}>
          {current} / {isUnlimited ? '∞' : limit} {unit}
        </span>
      </div>

      {!isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}

      {isAtLimit && showUpgrade && (
        <Link href="/pricing">
          <div className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 font-medium mt-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Limite atingido! Faça upgrade</span>
          </div>
        </Link>
      )}

      {isNearLimit && !isAtLimit && showUpgrade && (
        <Link href="/pricing">
          <div className="flex items-center gap-2 text-xs text-yellow-700 hover:text-yellow-800 font-medium mt-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Próximo do limite - Considere upgrade</span>
          </div>
        </Link>
      )}
    </div>
  )
}
