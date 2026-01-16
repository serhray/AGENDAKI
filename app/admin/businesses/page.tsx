"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Building2, 
  Eye,
  Crown,
  Zap,
  Star,
  TrendingUp
} from "lucide-react"

interface Business {
  id: string
  name: string
  slug: string
  plan: string
  planStatus: string
  createdAt: string
  _count: {
    users: number
    professionals: number
    services: number
    appointments: number
    customers: number
  }
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadBusinesses()
  }, [])

  const loadBusinesses = async () => {
    try {
      const res = await fetch("/api/admin/businesses")
      const data = await res.json()
      setBusinesses(data.businesses)
    } catch (error) {
      console.error("Erro ao carregar negócios:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  )

  const planIcons: Record<string, any> = {
    FREEMIUM: Zap,
    INICIAL: TrendingUp,
    PROFESSIONAL: Star,
    PREMIUM: Crown
  }

  const planColors: Record<string, string> = {
    FREEMIUM: "text-gray-400",
    INICIAL: "text-blue-400",
    PROFESSIONAL: "text-purple-400",
    PREMIUM: "text-yellow-400"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando negócios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com visual melhorado */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Negócios Cadastrados</h1>
            <p className="text-gray-400">{businesses.length} negócios ativos na plataforma</p>
          </div>
        </div>

        {/* Search com visual melhorado */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {filteredBusinesses.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">Nenhum negócio encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Negócio</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Plano</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Profissionais</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Serviços</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Agendamentos</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Clientes</th>
                  <th className="text-center p-4 text-gray-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map((business) => {
                  const PlanIcon = planIcons[business.plan] || Building2
                  
                  return (
                    <tr key={business.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{business.name}</p>
                          <p className="text-sm text-gray-400">/{business.slug}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <PlanIcon className={`h-5 w-5 ${planColors[business.plan]}`} />
                          <span className="text-white">{business.plan}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-white">{business._count.professionals}</td>
                      <td className="p-4 text-center text-white">{business._count.services}</td>
                      <td className="p-4 text-center text-white">{business._count.appointments}</td>
                      <td className="p-4 text-center text-white">{business._count.customers}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            href={`/admin/businesses/${business.id}`}
                            className="p-2 hover:bg-yellow-500/20 rounded-lg transition-all group-hover:scale-110 duration-200"
                          >
                            <Eye className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
