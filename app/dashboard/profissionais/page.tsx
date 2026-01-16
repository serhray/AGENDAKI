"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Mail, Phone, Clock, TrendingUp } from "lucide-react"
import { UsageMeter } from "@/components/UsageMeter"
import { UpgradePrompt } from "@/components/UpgradePrompt"
import Link from "next/link"

interface Professional {
  id: string
  name: string
  email: string | null
  phone: string | null
  bio: string | null
  active: boolean
  workingHours: any
  createdAt: string
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null)
  const [usage, setUsage] = useState<any>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  })

  useEffect(() => {
    loadProfessionals()
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

  const loadProfessionals = async () => {
    try {
      const res = await fetch("/api/professionals")
      const data = await res.json()
      setProfessionals(data.professionals || [])
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingProfessional
        ? `/api/professionals/${editingProfessional.id}`
        : "/api/professionals"
      
      const method = editingProfessional ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        await loadProfessionals()
        await loadUsage()
        closeModal()
      } else if (res.status === 403 && (data.error === "PLAN_LIMIT_REACHED" || data.message?.includes("limite"))) {
        // Limite atingido - mostrar modal de upgrade
        setShowUpgradePrompt(true)
        closeModal()
      } else {
        alert(data.message || data.error || "Erro ao salvar profissional")
      }
    } catch (error) {
      console.error("Erro ao salvar profissional:", error)
      alert("Erro ao salvar profissional")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este profissional?")) return

    try {
      await fetch(`/api/professionals/${id}`, { method: "DELETE" })
      await loadProfessionals()
    } catch (error) {
      console.error("Erro ao deletar:", error)
    }
  }

  const handleToggleActive = async (professional: Professional) => {
    try {
      await fetch(`/api/professionals/${professional.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !professional.active }),
      })
      await loadProfessionals()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const openModal = (professional?: Professional) => {
    if (professional) {
      setEditingProfessional(professional)
      setFormData({
        name: professional.name,
        email: professional.email || "",
        phone: professional.phone || "",
        bio: professional.bio || "",
      })
    } else {
      setEditingProfessional(null)
      setFormData({ name: "", email: "", phone: "", bio: "" })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProfessional(null)
    setFormData({ name: "", email: "", phone: "", bio: "" })
  }

  const filteredProfessionals = professionals.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profissionais</h1>
          <p className="text-gray-400 mt-1">Gerencie sua equipe de profissionais</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Adicionar Profissional
        </button>
      </div>

      {/* Usage Meter */}
      {usage && (
        <UsageMeter
          label="Profissionais"
          current={usage.professionals.current}
          limit={usage.professionals.limit}
        />
      )}

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar profissional..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Total de Profissionais</p>
          <p className="text-3xl font-bold text-indigo-400">{professionals.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Profissionais Ativos</p>
          <p className="text-3xl font-bold text-green-400">
            {professionals.filter((p) => p.active).length}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Profissionais Inativos</p>
          <p className="text-3xl font-bold text-gray-400">
            {professionals.filter((p) => !p.active).length}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Carregando...</div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-2">Nenhum profissional encontrado</p>
            <p className="text-sm text-gray-500">Adicione seu primeiro profissional para começar</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredProfessionals.map((professional) => (
              <div
                key={professional.id}
                className="p-6 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold">
                      {professional.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold">{professional.name}</h3>
                        {professional.active ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">
                            Ativo
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full font-medium">
                            Inativo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {professional.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {professional.email}
                          </div>
                        )}
                        {professional.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {professional.phone}
                          </div>
                        )}
                      </div>
                      {professional.bio && (
                        <p className="text-sm text-gray-500 mt-2">{professional.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleToggleActive(professional)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                      title={professional.active ? "Desativar" : "Ativar"}
                    >
                      {professional.active ? (
                        <UserX className="h-5 w-5 text-gray-400" />
                      ) : (
                        <UserCheck className="h-5 w-5 text-green-400" />
                      )}
                    </button>
                    <button
                      onClick={() => openModal(professional)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit className="h-5 w-5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(professional.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingProfessional ? "Editar Profissional" : "Novo Profissional"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Biografia</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                />
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
        resourceName="Profissionais"
        currentLimit={usage?.professionals.limit || 0}
      />
    </div>
  )
}
