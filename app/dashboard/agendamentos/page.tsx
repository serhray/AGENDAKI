"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle, FileText, Mail, Bell, X } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
}

interface Professional {
  id: string
  name: string
  active: boolean
}

interface Service {
  id: string
  name: string
  duration: number
  price: number
  professionals: { professional: Professional }[]
}

interface Appointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  notes: string | null
  customer: Customer
  service: Service
  professional: Professional
  createdAt: string
}

const statusConfig = {
  PENDING: { label: "Pendente", color: "yellow", icon: AlertCircle },
  CONFIRMED: { label: "Confirmado", color: "blue", icon: CheckCircle },
  COMPLETED: { label: "Concluído", color: "green", icon: CheckCircle },
  CANCELLED: { label: "Cancelado", color: "red", icon: XCircle },
  NO_SHOW: { label: "Não compareceu", color: "gray", icon: XCircle },
}

// Helper para formatar DateTime para hora local (HH:mm)
const formatTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterProfessional, setFilterProfessional] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)

  const [formData, setFormData] = useState({
    customerId: "",
    serviceId: "",
    professionalId: "",
    date: "",
    startTime: "",
    notes: "",
  })

  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    loadData()
  }, [filterStatus, filterProfessional])

  const loadData = async () => {
    try {
      const params = new URLSearchParams()
      if (filterStatus) params.append("status", filterStatus)
      if (filterProfessional) params.append("professionalId", filterProfessional)

      const [appointmentsRes, customersRes, professionalsRes, servicesRes] = await Promise.all([
        fetch(`/api/appointments?${params}`),
        fetch("/api/customers"),
        fetch("/api/professionals"),
        fetch("/api/services")
      ])
      
      const appointmentsData = await appointmentsRes.json()
      const customersData = await customersRes.json()
      const professionalsData = await professionalsRes.json()
      const servicesData = await servicesRes.json()
      
      setAppointments(appointmentsData.appointments || [])
      setCustomers(customersData.customers || [])
      setProfessionals(professionalsData.professionals || [])
      setServices(servicesData.services || [])
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
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await loadData()
        closeModal()
      } else {
        const data = await res.json()
        alert(data.error || "Erro ao criar agendamento")
      }
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerFormData),
      })

      if (res.ok) {
        const data = await res.json()
        await loadData()
        setFormData({ ...formData, customerId: data.customer.id })
        setShowCustomerModal(false)
        setCustomerFormData({ name: "", phone: "", email: "" })
      } else {
        const data = await res.json()
        alert(data.error || "Erro ao criar cliente")
      }
    } catch (error) {
      console.error("Erro ao criar cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      await loadData()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este agendamento?")) return

    try {
      await fetch(`/api/appointments/${id}`, { method: "DELETE" })
      await loadData()
    } catch (error) {
      console.error("Erro ao deletar:", error)
    }
  }

  const handleSendEmail = async (appointmentId: string, type: 'confirmation' | 'reminder' | 'cancellation') => {
    const typeLabels = {
      confirmation: 'confirmação',
      reminder: 'lembrete',
      cancellation: 'cancelamento'
    }
    
    if (!confirm(`Deseja enviar email de ${typeLabels[type]}?`)) return

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, type })
      })

      const data = await res.json()

      if (res.ok) {
        alert(`✅ Email de ${typeLabels[type]} enviado com sucesso!`)
      } else {
        alert(`❌ Erro: ${data.error || 'Falha ao enviar email'}`)
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      alert('❌ Erro ao enviar email. Verifique o console.')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setFormData({
      customerId: "",
      serviceId: "",
      professionalId: "",
      date: "",
      startTime: "",
      notes: "",
    })
  }

  const filteredAppointments = appointments.filter((a) =>
    a.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    a.service.name.toLowerCase().includes(search.toLowerCase()) ||
    a.professional.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedService = services.find(s => s.id === formData.serviceId)
  const availableProfessionals = selectedService
    ? selectedService.professionals.map(p => p.professional).filter(p => p.active)
    : professionals.filter(p => p.active)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agendamentos</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Gerencie os agendamentos do seu negócio</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 md:px-6 py-3 rounded-xl font-semibold transition-all shadow-lg min-h-[44px]"
        >
          <Plus className="h-5 w-5" />
          Novo Agendamento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, serviço ou profissional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
          >
            <option value="">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="COMPLETED">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
            <option value="NO_SHOW">Não compareceu</option>
          </select>

          <select
            value={filterProfessional}
            onChange={(e) => setFilterProfessional(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
          >
            <option value="">Todos os profissionais</option>
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id}>{prof.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = appointments.filter(a => a.status === status).length
          return (
            <div key={status} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
              <p className="text-xs md:text-sm text-gray-400 mb-1">{config.label}</p>
              <p className={`text-2xl md:text-3xl font-bold text-${config.color}-400`}>{count}</p>
            </div>
          )
        })}
      </div>

      {/* List */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Carregando...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-2">Nenhum agendamento encontrado</p>
            <p className="text-sm text-gray-500">Crie seu primeiro agendamento para começar</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredAppointments.map((appointment) => {
              const StatusIcon = statusConfig[appointment.status].icon
              return (
                <div key={appointment.id} className="p-4 md:p-6 hover:bg-white/5 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusConfig[appointment.status].color}-500/20 text-${statusConfig[appointment.status].color}-400 flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig[appointment.status].label}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(appointment.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2">{appointment.customer.name}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FileText className="h-4 w-4 text-gray-400" />
                          {appointment.service.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="h-4 w-4 text-gray-400" />
                          {appointment.professional.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          R$ {Number(appointment.service.price).toFixed(2)}
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-2 italic">"{appointment.notes}"</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px]">
                      {/* Botões de Email */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleSendEmail(appointment.id, 'confirmation')}
                          className="px-3 py-2.5 md:py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 min-h-[44px] md:min-h-0"
                          title="Enviar email de confirmação"
                        >
                          <Mail className="h-3 w-3" />
                          <span className="hidden sm:inline">Confirmação</span>
                          <span className="sm:hidden">Confirmar</span>
                        </button>
                        <button
                          onClick={() => handleSendEmail(appointment.id, 'reminder')}
                          className="px-3 py-2.5 md:py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 min-h-[44px] md:min-h-0"
                          title="Enviar lembrete"
                        >
                          <Bell className="h-3 w-3" />
                          Lembrete
                        </button>
                      </div>

                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className="px-3 py-2.5 md:py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px] md:min-h-0"
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="COMPLETED">Concluído</option>
                        <option value="CANCELLED">Cancelado</option>
                        <option value="NO_SHOW">Não compareceu</option>
                      </select>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="px-3 py-2.5 md:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all min-h-[44px] md:min-h-0"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-all"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Novo Agendamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Novo Agendamento</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Cliente *</label>
                  <button
                    type="button"
                    onClick={() => setShowCustomerModal(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 min-h-[44px] md:min-h-0 flex items-center"
                  >
                    + Novo Cliente
                  </button>
                </div>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Serviço *</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value, professionalId: "" })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                  required
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.duration}min - R$ {Number(service.price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Profissional *</label>
                <select
                  value={formData.professionalId}
                  onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  required
                  disabled={!formData.serviceId}
                >
                  <option value="">Selecione um profissional</option>
                  {availableProfessionals.map((prof) => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Horário *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[44px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold transition-all disabled:opacity-50 min-h-[44px]"
                >
                  {loading ? "Salvando..." : "Criar Agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Cliente */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Novo Cliente</h2>
              <button
                type="button"
                onClick={() => setShowCustomerModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCustomerSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <input
                  type="text"
                  value={customerFormData.name}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefone *</label>
                <input
                  type="tel"
                  value={customerFormData.phone}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={customerFormData.email}
                  onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 min-h-[44px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold transition-all disabled:opacity-50 min-h-[44px]"
                >
                  {loading ? "Salvando..." : "Criar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
