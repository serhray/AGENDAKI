"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Users, Search, Phone, Mail, Calendar, Edit, Trash2, UserPlus, X } from "lucide-react"

type Customer = {
  id: string
  name: string
  email: string | null
  phone: string
  createdAt: string
  _count?: {
    appointments: number
  }
}

type Appointment = {
  id: string
  date: string
  status: string
  service: {
    name: string
  }
  professional: {
    name: string
  }
}

export default function ClientesPage() {
  const { data: session } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">("create")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [searchTerm, customers])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error("Erro ao buscar clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerAppointments = async (customerId: string) => {
    try {
      const response = await fetch(`/api/appointments?customerId=${customerId}`)
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
    }
  }

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers)
      return
    }

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredCustomers(filtered)
  }

  const openCreateModal = () => {
    setModalMode("create")
    setFormData({ name: "", email: "", phone: "" })
    setSelectedCustomer(null)
    setShowModal(true)
  }

  const openViewModal = async (customer: Customer) => {
    setModalMode("view")
    setSelectedCustomer(customer)
    setFormData({ name: customer.name, email: customer.email || "", phone: customer.phone })
    await fetchCustomerAppointments(customer.id)
    setShowModal(true)
  }

  const openEditModal = (customer: Customer) => {
    setModalMode("edit")
    setSelectedCustomer(customer)
    setFormData({ name: customer.name, email: customer.email || "", phone: customer.phone })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCustomer(null)
    setAppointments([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = modalMode === "create" ? "/api/customers" : `/api/customers/${selectedCustomer?.id}`
      const method = modalMode === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Erro ao salvar cliente")
        return
      }

      alert(data.message)
      closeModal()
      fetchCustomers()
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      alert("Erro ao salvar cliente")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Erro ao excluir cliente")
        return
      }

      alert(data.message)
      closeModal()
      fetchCustomers()
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      alert("Erro ao excluir cliente")
    }
  }

  const stats = {
    total: customers.length,
    withAppointments: customers.filter(c => (c._count?.appointments || 0) > 0).length,
    newThisMonth: customers.filter(c => {
      const createdDate = new Date(c.createdAt)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600 mt-2">Gerencie sua base de clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total de Clientes</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <Users className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Com Agendamentos</p>
              <p className="text-3xl font-bold mt-2">{stats.withAppointments}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Novos Este Mês</p>
              <p className="text-3xl font-bold mt-2">{stats.newThisMonth}</p>
            </div>
            <UserPlus className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={openCreateModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agendamentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadastrado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openViewModal(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {customer.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {customer._count?.appointments || 0} agendamentos
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(customer)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(customer.id)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create" && "Novo Cliente"}
                {modalMode === "edit" && "Editar Cliente"}
                {modalMode === "view" && "Detalhes do Cliente"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalMode === "view" ? (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{selectedCustomer?.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        {selectedCustomer?.phone}
                      </div>
                      {selectedCustomer?.email && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4" />
                          {selectedCustomer.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        Cliente desde {new Date(selectedCustomer?.createdAt || "").toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  {/* Appointments History */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Histórico de Agendamentos</h3>
                    {appointments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado</p>
                    ) : (
                      <div className="space-y-2">
                        {appointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{appointment.service.name}</p>
                                <p className="text-sm text-gray-600">{appointment.professional.name}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                appointment.status === "CONFIRMADO" ? "bg-green-100 text-green-800" :
                                appointment.status === "PENDENTE" ? "bg-yellow-100 text-yellow-800" :
                                appointment.status === "CANCELADO" ? "bg-red-100 text-red-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleString("pt-BR")}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(selectedCustomer!)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Editar Cliente
                    </button>
                    <button
                      onClick={() => handleDelete(selectedCustomer!.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Excluir Cliente
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nome completo do cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {modalMode === "create" ? "Criar Cliente" : "Salvar Alterações"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
