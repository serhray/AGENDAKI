"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Clock, DollarSign, Users, Scissors, CheckCircle, XCircle } from "lucide-react"
import { UsageMeter } from "@/components/UsageMeter"
import { UpgradePrompt } from "@/components/UpgradePrompt"

interface Professional {
  id: string
  name: string
  active: boolean
}

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  active: boolean
  professionals: {
    professional: Professional
  }[]
  createdAt: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [usage, setUsage] = useState<any>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    professionalIds: [] as string[],
  })

  useEffect(() => {
    loadData()
    loadUsage()
  }, [])

  const loadUsage = async () => {
    try {
      const res = await fetch("/api/business/info")
      const data = await res.json()
      setUsage(data.usage)
    } catch (error) {
      console.error("Erro ao carregar uso:", error)
    }
  }

  const loadData = async () => {
    try {
      const [servicesRes, professionalsRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/professionals")
      ])
      
      const servicesData = await servicesRes.json()
      const professionalsData = await professionalsRes.json()
      
      setServices(servicesData.services || [])
      setProfessionals(professionalsData.professionals || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingService
        ? `/api/services/${editingService.id}`
        : "/api/services"
      
      const method = editingService ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        await loadData()
        await loadUsage()
        closeModal()
      } else if (res.status === 403 && (data.error === "PLAN_LIMIT_REACHED" || data.message?.includes("limite"))) {
        // Limite atingido - mostrar modal de upgrade
        setShowUpgradePrompt(true)
        closeModal()
      } else {
        alert(data.message || data.error || "Erro ao salvar serviço")
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error)
      alert("Erro ao salvar serviço")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este serviço?")) return

    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" })
      const data = await res.json()
      
      if (res.ok) {
        await loadData()
      } else {
        alert(data.error || "Erro ao deletar serviço")
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
      alert("Erro ao deletar serviço")
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !service.active }),
      })
      await loadData()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description || "",
        duration: service.duration.toString(),
        price: service.price.toString(),
        professionalIds: service.professionals.map(p => p.professional.id),
      })
    } else {
      setEditingService(null)
      setFormData({
        name: "",
        description: "",
        duration: "",
        price: "",
        professionalIds: [],
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingService(null)
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: "",
      professionalIds: [],
    })
  }

  const toggleProfessional = (id: string) => {
    setFormData(prev => ({
      ...prev,
      professionalIds: prev.professionalIds.includes(id)
        ? prev.professionalIds.filter(pid => pid !== id)
        : [...prev.professionalIds, id]
    }))
  }

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = services.reduce((sum, s) => sum + Number(s.price), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-gray-400 mt-1">Gerencie os serviços oferecidos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Adicionar Serviço
        </button>
      </div>

      {/* Usage Meter */}
      {usage && (
        <UsageMeter
          label="Serviços"
          current={usage.services.current}
          limit={usage.services.limit}
        />
      )}

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total de Serviços</p>
          <p className="text-3xl font-bold text-indigo-400">{services.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Serviços Ativos</p>
          <p className="text-3xl font-bold text-green-400">
            {services.filter((s) => s.active).length}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Ticket Médio</p>
          <p className="text-3xl font-bold text-yellow-400">
            R$ {services.length > 0 ? (totalRevenue / services.length).toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Receita Potencial</p>
          <p className="text-3xl font-bold text-pink-400">
            R$ {totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-400">Carregando...</div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full p-12 text-center">
            <Scissors className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-2">Nenhum serviço encontrado</p>
            <p className="text-sm text-gray-500">Adicione seu primeiro serviço para começar</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Scissors className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    {service.active ? (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(service)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Edit className="h-5 w-5 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">{service.name}</h3>
              
              {service.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{service.duration} minutos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">R$ {Number(service.price).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {service.professionals.length} {service.professionals.length === 1 ? "profissional" : "profissionais"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                {service.active ? (
                  <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium">
                    Ativo
                  </span>
                ) : (
                  <span className="text-xs bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full font-medium">
                    Inativo
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingService ? "Editar Serviço" : "Novo Serviço"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Serviço *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duração (minutos) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Profissionais que Realizam</label>
                {professionals.length === 0 ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400">
                    Cadastre profissionais primeiro para vinculá-los aos serviços
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {professionals.map((prof) => (
                      <label
                        key={prof.id}
                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={formData.professionalIds.includes(prof.id)}
                          onChange={() => toggleProfessional(prof.id)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">{prof.name}</span>
                        {!prof.active && (
                          <span className="text-xs text-gray-500">(Inativo)</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Prompt */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        resourceName="Serviços"
        currentLimit={usage?.services.limit || 0}
      />
    </div>
  )
}
