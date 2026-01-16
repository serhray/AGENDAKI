"use client"

import { Crown, Zap, Star } from "lucide-react"

interface PlanBadgeProps {
  plan: string
  planStatus?: string
  className?: string
}

export function PlanBadge({ plan, planStatus, className = "" }: PlanBadgeProps) {
  const badges = {
    FREEMIUM: {
      label: "Grátis",
      color: "bg-gray-100 text-gray-700 border-gray-300",
      icon: null
    },
    INICIAL: {
      label: "Inicial",
      color: "bg-blue-100 text-blue-700 border-blue-300",
      icon: Zap
    },
    PROFESSIONAL: {
      label: "Profissional",
      color: "bg-purple-100 text-purple-700 border-purple-300",
      icon: Star
    },
    PREMIUM: {
      label: "Premium",
      color: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-400",
      icon: Crown
    }
  }

  const badge = badges[plan as keyof typeof badges] || badges.FREEMIUM
  const Icon = badge.icon

  const statusText = planStatus === 'TRIAL' ? '(Trial)' : ''

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{badge.label} {statusText}</span>
    </div>
  )
}
