"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft,
  Building2, 
  Users, 
  Calendar, 
  DollarSign,
  UserCheck,
  Briefcase,
  Package,
  MapPin,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Crown,
  Zap,
  Star
} from "lucide-react"
import Link from "next/link"

interface BusinessDetail {
  id: string
  name: string
  slug: string
  plan: string
  planStatus: string
  trialEndsAt: string | null
  subscriptionId: string | null
  createdAt: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  _count: {
    users: number
    professionals: number
    services: number
    appointments: number
    customers: number
  }
  users: Array<{
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
  }>
  professionals: Array<{
    id: string
    name: string
    email: string | null
    phone: string | null
  }>
  services: Array<{
    id: string
    name: string
    price: number
    duration: number
  }>
  recentAppointments: Array<{
    id: string
    date: string
    status: string
    customer: {
      name: string
    }
    service: {
      name: string
      price: number
    }
  }>
  stats: {
    totalRevenue: number
    confirmedAppointments: number
    pendingAppointments: number
    cancelledAppointments: number
    completedAppointments: number
  }
}

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [business, setBusiness] = useState<BusinessDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      loadBusiness()
    }
  }, [params?.id])

  const loadBusiness = async () => {
    try {
      const res = await fetch(`/api/admin/businesses/${params?.id}`)
      if (!res.ok) throw new Error("Erro ao carregar negócio")
      const data = await res.json()
      setBusiness(data)
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando detalhes...</p>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Negócio não encontrado</h2>
        <Link href="/admin/businesses" className="text-yellow-500 hover:text-yellow-400">
          Voltar para a lista
        </Link>
      </div>
    )
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

  const PlanIcon = planIcons[business.plan] || Zap

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-white">{business.name}</h1>
            <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${planColors[business.plan]} rounded-xl`}>
              <PlanIcon className="h-5 w-5 text-white" />
              <span className="text-white font-bold">{business.plan}</span>
            </div>
          </div>
          <p className="text-gray-400">/{business.slug}</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={Users}
          label="Usuários"
          value={business._count.users}
          color="from-blue-600 to-cyan-600"
        />
        <StatCard
          icon={Briefcase}
          label="Profissionais"
          value={business._count.professionals}
          color="from-purple-600 to-pink-600"
        />
        <StatCard
          icon={Package}
          label="Serviços"
          value={business._count.services}
          color="from-indigo-600 to-purple-600"
        />
        <StatCard
          icon={Calendar}
          label="Agendamentos"
          value={business._count.appointments}
          color="from-green-600 to-emerald-600"
        />
        <StatCard
          icon={UserCheck}
          label="Clientes"
          value={business._count.customers}
          color="from-pink-600 to-rose-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Building2 className="h-6 w-6 text-yellow-500" />
            Informações do Negócio
          </h2>
          <div className="space-y-4">
            {business.description && (
              <InfoRow icon={Building2} label="Descrição" value={business.description} />
            )}
            {business.address && (
              <InfoRow icon={MapPin} label="Endereço" value={business.address} />
            )}
            {business.phone && (
              <InfoRow icon={Phone} label="Telefone" value={business.phone} />
            )}
            {business.email && (
              <InfoRow icon={Mail} label="Email" value={business.email} />
            )}
            <InfoRow 
              icon={Clock} 
              label="Criado em" 
              value={new Date(business.createdAt).toLocaleDateString("pt-BR")} 
            />
            {business.trialEndsAt && (
              <InfoRow 
                icon={AlertCircle} 
                label="Trial termina em" 
                value={new Date(business.trialEndsAt).toLocaleDateString("pt-BR")}
                highlight
              />
            )}
          </div>
        </div>

        {/* Appointment Stats */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-green-500" />
            Estatísticas de Agendamentos
          </h2>
          <div className="space-y-4">
            <StatusRow
              icon={CheckCircle}
              label="Confirmados"
              value={business.stats.confirmedAppointments}
              color="text-green-500"
            />
            <StatusRow
              icon={Clock}
              label="Pendentes"
              value={business.stats.pendingAppointments}
              color="text-yellow-500"
            />
            <StatusRow
              icon={CheckCircle}
              label="Concluídos"
              value={business.stats.completedAppointments}
              color="text-blue-500"
            />
            <StatusRow
              icon={XCircle}
              label="Cancelados"
              value={business.stats.cancelledAppointments}
              color="text-red-500"
            />
            <div className="pt-4 border-t border-white/10">
              <StatusRow
                icon={DollarSign}
                label="Receita Total"
                value={`R$ ${business.stats.totalRevenue.toLocaleString()}`}
                color="text-yellow-500"
                large
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-500" />
          Usuários ({business.users.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Função</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {business.users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{user.name || "Sem nome"}</td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      user.role === "OWNER" ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professionals */}
      {business.professionals.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-purple-500" />
            Profissionais ({business.professionals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {business.professionals.map((prof) => (
              <div key={prof.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">{prof.name}</h3>
                {prof.email && <p className="text-gray-400 text-sm">{prof.email}</p>}
                {prof.phone && <p className="text-gray-400 text-sm">{prof.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {business.services.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Package className="h-6 w-6 text-indigo-500" />
            Serviços ({business.services.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {business.services.map((service) => (
              <div key={service.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">{service.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{service.duration} min</span>
                  <span className="text-green-500 font-bold">R$ {service.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Appointments */}
      {business.recentAppointments.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-green-500" />
            Agendamentos Recentes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Data</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Serviço</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {business.recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-white">
                      {new Date(apt.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{apt.customer.name}</td>
                    <td className="px-4 py-3 text-gray-400">{apt.service.name}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-green-500 font-medium">
                      R$ {apt.service.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${color} w-fit mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, highlight }: any) {
  return (
    <div className="flex items-start gap-3">
      <Icon className={`h-5 w-5 ${highlight ? 'text-yellow-500' : 'text-gray-400'} mt-0.5`} />
      <div className="flex-1">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className={`${highlight ? 'text-yellow-500' : 'text-white'} font-medium`}>{value}</p>
      </div>
    </div>
  )
}

function StatusRow({ icon: Icon, label, value, color, large }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <span className="text-gray-400">{label}</span>
      </div>
      <span className={`${color} ${large ? 'text-2xl' : 'text-xl'} font-bold`}>{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    CONFIRMED: { label: "Confirmado", color: "bg-green-500/20 text-green-500" },
    PENDING: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-500" },
    CANCELLED: { label: "Cancelado", color: "bg-red-500/20 text-red-500" },
    COMPLETED: { label: "Concluído", color: "bg-blue-500/20 text-blue-500" }
  }

  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
