"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Users, 
  Scissors, Clock, Award, Download, Filter, BarChart3
} from "lucide-react"

type Period = "today" | "week" | "month" | "year"

type Stats = {
  revenue: {
    total: number
    average: number
    growth: number
  }
  appointments: {
    total: number
    confirmed: number
    completed: number
    cancelled: number
    growth: number
  }
  customers: {
    total: number
    new: number
    returning: number
    growth: number
  }
  topServices: Array<{
    name: string
    count: number
    revenue: number
    percentage: number
  }>
  topCustomers: Array<{
    name: string
    appointments: number
    revenue: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
    appointments: number
  }>
  occupancyRate: number
}

export default function RelatoriosPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>("month")

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports?period=${period}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  const getPeriodLabel = () => {
    switch (period) {
      case "today": return "Hoje"
      case "week": return "Esta Semana"
      case "month": return "Este Mês"
      case "year": return "Este Ano"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios e Análises</h1>
          <p className="text-gray-300 mt-2">Visualize o desempenho do seu negócio</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download className="w-5 h-5" />
          Exportar PDF
        </button>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Período:</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "today", label: "Hoje" },
              { value: "week", label: "Semana" },
              { value: "month", label: "Mês" },
              { value: "year", label: "Ano" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value as Period)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  period === option.value
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            {stats && stats.revenue && stats.revenue.growth !== 0 && (
              <div className={`flex items-center gap-1 ${stats.revenue.growth > 0 ? 'text-green-100' : 'text-red-200'}`}>
                {stats.revenue.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stats.revenue.growth).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold mb-1">{formatCurrency(stats?.revenue?.total || 0)}</p>
          <p className="text-green-100 text-sm mb-2">Receita Total - {getPeriodLabel()}</p>
          <p className="text-sm text-green-100">
            Média: {formatCurrency(stats?.revenue?.average || 0)} por agendamento
          </p>
        </div>

        {/* Appointments */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            {stats && stats.appointments && stats.appointments.growth !== 0 && (
              <div className={`flex items-center gap-1 ${stats.appointments.growth > 0 ? 'text-purple-100' : 'text-red-200'}`}>
                {stats.appointments.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stats.appointments.growth).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold mb-1">{stats?.appointments?.total || 0}</p>
          <p className="text-purple-100 text-sm mb-2">Agendamentos - {getPeriodLabel()}</p>
          <div className="flex gap-4 text-xs">
            <span className="text-purple-100">Confirmados: {stats?.appointments?.confirmed || 0}</span>
            <span className="text-purple-100">Concluídos: {stats?.appointments?.completed || 0}</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            {stats && stats.customers && stats.customers.growth !== 0 && (
              <div className={`flex items-center gap-1 ${stats.customers.growth > 0 ? 'text-blue-100' : 'text-red-200'}`}>
                {stats.customers.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stats.customers.growth).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold mb-1">{stats?.customers?.total || 0}</p>
          <p className="text-blue-100 text-sm mb-2">Clientes - {getPeriodLabel()}</p>
          <div className="flex gap-4 text-xs">
            <span className="text-blue-100">Novos: {stats?.customers?.new || 0}</span>
            <span className="text-blue-100">Recorrentes: {stats?.customers?.returning || 0}</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Receita por Dia</h2>
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        {stats?.revenueByDay && stats.revenueByDay.length > 0 ? (
          <div className="space-y-3">
            {stats.revenueByDay.map((day, index) => {
              const maxRevenue = Math.max(...stats.revenueByDay.map(d => d.revenue))
              const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(day.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">{day.appointments} agendamentos</span>
                      <span className="font-semibold text-green-600">{formatCurrency(day.revenue)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma receita registrada no período</p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Serviços Mais Populares</h2>
            <Scissors className="w-6 h-6 text-purple-600" />
          </div>
          {stats?.topServices && stats.topServices.length > 0 ? (
            <div className="space-y-4">
              {stats.topServices.map((service, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? "bg-yellow-500" :
                        index === 1 ? "bg-gray-400" :
                        index === 2 ? "bg-orange-500" :
                        "bg-purple-500"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.count} agendamentos</p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">{formatCurrency(service.revenue)}</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum serviço agendado no período</p>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Clientes Mais Frequentes</h2>
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          {stats?.topCustomers && stats.topCustomers.length > 0 ? (
            <div className="space-y-3">
              {stats.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.appointments} agendamentos</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">{formatCurrency(customer.revenue)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum cliente no período</p>
          )}
        </div>
      </div>

      {/* Occupancy Rate */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Taxa de Ocupação</h2>
            <p className="text-sm text-gray-600 mt-1">Percentual de horários preenchidos</p>
          </div>
          <Clock className="w-6 h-6 text-purple-600" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-gray-900">{stats?.occupancyRate?.toFixed(1) || 0}%</span>
            <div className={`flex items-center gap-2 ${(stats?.occupancyRate || 0) >= 75 ? 'text-green-600' : (stats?.occupancyRate || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {(stats?.occupancyRate || 0) >= 75 ? (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Excelente</span>
                </>
              ) : (stats?.occupancyRate || 0) >= 50 ? (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Bom</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5" />
                  <span className="font-medium">Baixo</span>
                </>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                (stats?.occupancyRate || 0) >= 75 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                (stats?.occupancyRate || 0) >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}
              style={{ width: `${stats?.occupancyRate || 0}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {(stats?.occupancyRate || 0) >= 75 ? 
              "Sua agenda está bem preenchida! Continue o bom trabalho." :
              (stats?.occupancyRate || 0) >= 50 ?
              "Bom desempenho! Considere estratégias para aumentar os agendamentos." :
              "Taxa baixa. Considere fazer promoções ou divulgar seus serviços."
            }
          </p>
        </div>
      </div>
    </div>
  )
}
