"use client"

import { useEffect, useState } from "react"
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  Briefcase,
  Crown,
  Zap,
  Star,
  Package
} from "lucide-react"

interface AdminStats {
  overview: {
    totalBusinesses: number
    totalUsers: number
    totalAppointments: number
    totalCustomers: number
    totalProfessionals: number
    totalServices: number
    totalRevenue: number
  }
  growth: {
    newBusinesses: number
    recentAppointments: number
  }
  plans: Array<{ plan: string; count: number }>
  appointments: Array<{ status: string; count: number }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-white">Erro ao carregar dados</div>
  }

  const planIcons: Record<string, any> = {
    FREEMIUM: Zap,
    INICIAL: TrendingUp,
    PROFESSIONAL: Star,
    PREMIUM: Crown
  }

  const planColors: Record<string, string> = {
    FREEMIUM: "from-gray-400 to-gray-600",
    INICIAL: "from-blue-400 to-cyan-500",
    PROFESSIONAL: "from-purple-400 to-pink-500",
    PREMIUM: "from-yellow-400 to-orange-500"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Crown className="h-9 w-9 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Dashboard Administrativo</h1>
            <p className="text-gray-400">Visão geral e controle total da plataforma AGENDAKI</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          label="Total de Negócios"
          value={stats.overview.totalBusinesses}
          subtitle={`+${stats.growth.newBusinesses} novos (30d)`}
          color="from-blue-600 to-cyan-600"
          trend={stats.growth.newBusinesses}
        />
        <StatCard
          icon={Users}
          label="Total de Usuários"
          value={stats.overview.totalUsers}
          subtitle="Usuários ativos"
          color="from-purple-600 to-pink-600"
        />
        <StatCard
          icon={Calendar}
          label="Total de Agendamentos"
          value={stats.overview.totalAppointments}
          subtitle={`+${stats.growth.recentAppointments} novos (30d)`}
          color="from-green-600 to-emerald-600"
          trend={stats.growth.recentAppointments}
        />
        <StatCard
          icon={DollarSign}
          label="MRR"
          value={`R$ ${stats.overview.totalRevenue.toLocaleString()}`}
          subtitle="Receita Mensal Recorrente"
          color="from-yellow-600 to-orange-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={UserCheck}
          label="Clientes Totais"
          value={stats.overview.totalCustomers}
          color="from-indigo-600 to-purple-600"
          size="small"
        />
        <StatCard
          icon={Briefcase}
          label="Profissionais Totais"
          value={stats.overview.totalProfessionals}
          color="from-pink-600 to-rose-600"
          size="small"
        />
        <StatCard
          icon={Package}
          label="Serviços Totais"
          value={stats.overview.totalServices}
          color="from-cyan-600 to-blue-600"
          size="small"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plans Distribution */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Distribuição por Planos</h3>
          </div>
          <div className="space-y-4">
            {stats.plans.map((item) => {
              const Icon = planIcons[item.plan] || Zap
              const percentage = stats.overview.totalBusinesses > 0 
                ? (item.count / stats.overview.totalBusinesses) * 100 
                : 0

              return (
                <div key={item.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">{item.plan}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{item.count} negócios</span>
                      <span className="text-sm text-gray-500">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5">
                    <div
                      className={`bg-gradient-to-r ${planColors[item.plan]} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Appointments Status */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Status dos Agendamentos</h3>
          </div>
          <div className="space-y-4">
            {stats.appointments.map((item) => {
              const percentage = stats.overview.totalAppointments > 0 
                ? (item.count / stats.overview.totalAppointments) * 100 
                : 0
              
              const statusConfig: Record<string, { label: string; color: string }> = {
                CONFIRMED: { label: "Confirmados", color: "from-green-500 to-emerald-500" },
                PENDING: { label: "Pendentes", color: "from-yellow-500 to-orange-500" },
                CANCELLED: { label: "Cancelados", color: "from-red-500 to-rose-500" },
                COMPLETED: { label: "Concluídos", color: "from-blue-500 to-cyan-500" }
              }

              const config = statusConfig[item.status] || statusConfig.CONFIRMED

              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{config.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{item.count}</span>
                      <span className="text-sm text-gray-500">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5">
                    <div
                      className={`bg-gradient-to-r ${config.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  trend,
  size = "default"
}: {
  icon: any
  label: string
  value: string | number
  subtitle?: string
  color: string
  trend?: number
  size?: "default" | "small"
}) {
  const isSmall = size === "small"
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`${isSmall ? 'p-2.5' : 'p-3'} rounded-xl bg-gradient-to-r ${color} group-hover:scale-110 transition-transform`}>
          <Icon className={`${isSmall ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
        </div>
        {trend !== undefined && trend > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <span className="text-xs text-green-400 font-medium">+{trend}</span>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`${isSmall ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-1`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}
