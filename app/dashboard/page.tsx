"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Calendar, Users, DollarSign, Scissors, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

type Stats = {
  today: {
    appointments: number
    revenue: number
  }
  month: {
    appointments: number
    revenue: number
    customers: number
  }
  appointments: {
    confirmed: number
    pending: number
    cancelled: number
    completed: number
  }
  topServices: Array<{
    name: string
    count: number
    revenue: number
  }>
  recentAppointments: Array<{
    id: string
    date: string
    customer: { name: string }
    service: { name: string; price: number }
    status: string
  }>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    } finally {
      setLoading(false)
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
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Bem-vindo, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{session?.user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Aqui está um resumo do seu negócio hoje
        </p>
      </div>

      {/* Stats Cards - Today */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg shadow-purple-500/50">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats?.today?.appointments || 0}</p>
              <p className="text-purple-100 text-sm">Hoje</p>
            </div>
          </div>
          <p className="text-sm font-medium">Agendamentos</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg shadow-green-500/50">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            <div className="text-right">
              <p className="text-3xl font-bold">R$ {stats?.today?.revenue?.toFixed(0) || 0}</p>
              <p className="text-green-100 text-sm">Hoje</p>
            </div>
          </div>
          <p className="text-sm font-medium">Receita</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-500/50">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats?.month?.appointments || 0}</p>
              <p className="text-blue-100 text-sm">Este mês</p>
            </div>
          </div>
          <p className="text-sm font-medium">Agendamentos</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg shadow-orange-500/50">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats?.month?.customers || 0}</p>
              <p className="text-orange-100 text-sm">Este mês</p>
            </div>
          </div>
          <p className="text-sm font-medium">Clientes</p>
        </div>
      </div>

      {/* Appointment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.appointments?.confirmed || 0}</p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.appointments?.pending || 0}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.appointments?.completed || 0}</p>
              <p className="text-sm text-gray-600">Concluídos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.appointments?.cancelled || 0}</p>
              <p className="text-sm text-gray-600">Cancelados</p>
            </div>
          </div>
        </div>
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
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
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
                  </div>
                  <p className="font-semibold text-green-600">R$ {service.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum serviço agendado ainda</p>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Agendamentos Recentes</h2>
            <Link 
              href="/dashboard/agendamentos"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Ver todos →
            </Link>
          </div>
          {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {stats.recentAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{appointment.customer.name}</p>
                    <p className="text-sm text-gray-500">{appointment.service.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(appointment.date).toLocaleDateString("pt-BR", { 
                        day: "2-digit", 
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R$ {appointment.service.price.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      appointment.status === "CONFIRMADO" ? "bg-green-100 text-green-800" :
                      appointment.status === "PENDENTE" ? "bg-yellow-100 text-yellow-800" :
                      appointment.status === "CANCELADO" ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum agendamento recente</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/agendamentos" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Novo Agendamento</p>
          </Link>
          <Link href="/dashboard/clientes" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Ver Clientes</p>
          </Link>
          <Link href="/dashboard/servicos" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
            <Scissors className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Gerenciar Serviços</p>
          </Link>
          <Link href="/dashboard/calendario" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-center transition-all">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Ver Calendário</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
