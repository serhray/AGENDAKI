"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Building2, Mail, Phone, MapPin, Clock, Shield, 
  Palette, CreditCard, Save, Check, X, Calendar
} from "lucide-react"

type Business = {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  primaryColor: string
  allowCancellation: boolean
  cancellationHours: number
  minAdvanceBookingHours: number
  plan: string
  planStatus: string
}

export default function ConfiguracoesPage() {
  const { data: session } = useSession()
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchBusiness()
  }, [])

  const fetchBusiness = async () => {
    try {
      const response = await fetch("/api/business")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Business data:", data)
      setBusiness(data.business)
    } catch (error) {
      console.error("Erro ao buscar negócio:", error)
      setError("Erro ao carregar configurações")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSaved(false)

    try {
      const response = await fetch("/api/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao salvar configurações")
        return
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setError("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof Business, value: any) => {
    if (business) {
      setBusiness({ ...business, [field]: value })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Erro ao carregar configurações do negócio
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
            <p className="text-gray-300 mt-2">Gerencie as configurações do seu negócio</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <Check className="w-5 h-5" />
              <span className="font-medium">Salvo com sucesso!</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Informações Básicas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Negócio *
                </label>
                <input
                  type="text"
                  required
                  value={business.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Salão Exemplo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Agendamento *
                </label>
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    value={business.slug}
                    onChange={(e) => {
                      // Permite apenas letras, números e hífens
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      updateField("slug", slug)
                    }}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="meu-salao"
                    pattern="[a-z0-9-]+"
                  />
                  <p className="text-xs text-gray-500">
                    Seu link: <span className="font-medium text-purple-600">agendaki.com/book/{business.slug}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={business.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="contato@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={business.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Endereço</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  value={business.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Rua Exemplo, 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={business.city || ""}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  value={business.state || ""}
                  onChange={(e) => updateField("state", e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={business.zipCode || ""}
                  onChange={(e) => updateField("zipCode", e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Regras de Agendamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Regras de Agendamento</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Permitir Cancelamento</p>
                  <p className="text-sm text-gray-600">Clientes podem cancelar agendamentos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={business.allowCancellation}
                    onChange={(e) => updateField("allowCancellation", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Antecedência Mínima para Cancelamento (horas)
                </label>
                <input
                  type="number"
                  min="0"
                  value={business.cancellationHours}
                  onChange={(e) => updateField("cancellationHours", parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!business.allowCancellation}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Clientes devem cancelar com pelo menos {business.cancellationHours} horas de antecedência
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Antecedência Mínima para Agendamento (horas)
                </label>
                <input
                  type="number"
                  min="0"
                  value={business.minAdvanceBookingHours}
                  onChange={(e) => updateField("minAdvanceBookingHours", parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Clientes devem agendar com pelo menos {business.minAdvanceBookingHours} horas de antecedência
                </p>
              </div>
            </div>
          </div>

          {/* Personalização */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Palette className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Personalização</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Principal
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={business.primaryColor}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={business.primaryColor}
                  onChange={(e) => updateField("primaryColor", e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="#6366f1"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Esta cor será usada na página pública de agendamento
              </p>
            </div>
          </div>

          {/* Plano Atual */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6" />
              <h2 className="text-xl font-bold">Plano Atual</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-100">Plano:</span>
                <span className="font-bold text-xl">{business.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-100">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  business.planStatus === "ACTIVE" ? "bg-green-400 text-green-900" : "bg-yellow-400 text-yellow-900"
                }`}>
                  {business.planStatus === "ACTIVE" ? "Ativo" : business.planStatus}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg transition-colors font-medium"
            >
              Gerenciar Plano
            </button>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
