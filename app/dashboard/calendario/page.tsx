"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Scissors, Phone, Mail, MapPin } from "lucide-react"

type Appointment = {
  id: string
  date: string
  status: string
  customer: {
    name: string
    phone: string
    email: string | null
  }
  service: {
    name: string
    duration: number
    price: number
  }
  professional: {
    name: string
  }
}

type ViewMode = "month" | "week" | "day"

export default function CalendarioPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [currentDate, viewMode])

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Dias do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.toDateString() === date.toDateString()
    })
  }

  const getAppointmentsForWeek = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= startOfWeek && aptDate < endOfWeek
    })
  }

  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatPeriodTitle = () => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    } else if (viewMode === "week") {
      const weekDays = getWeekDays()
      const start = weekDays[0]
      const end = weekDays[6]
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`
      } else {
        return `${start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} - ${end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}`
      }
    } else {
      return currentDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMADO": return "bg-green-100 text-green-800 border-green-300"
      case "PENDENTE": return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "CANCELADO": return "bg-red-100 text-red-800 border-red-300"
      case "CONCLUIDO": return "bg-blue-100 text-blue-800 border-blue-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "CONFIRMADO": return "bg-green-500"
      case "PENDENTE": return "bg-yellow-500"
      case "CANCELADO": return "bg-red-500"
      case "CONCLUIDO": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const openAppointmentModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
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
        <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
        <p className="text-gray-600 mt-2">Visualize todos os seus agendamentos</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousPeriod}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={goToNextPeriod}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold ml-4 capitalize">
              {formatPeriodTitle()}
            </h2>
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "month"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "week"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "day"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Dia
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === "month" && (
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getMonthDays().map((date, index) => {
                if (!date) {
                  return <div key={index} className="aspect-square" />
                }

                const dayAppointments = getAppointmentsForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={index}
                    className={`aspect-square border rounded-lg p-2 ${
                      isToday ? "bg-purple-50 border-purple-300" : "border-gray-200"
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                    onClick={() => {
                      setCurrentDate(date)
                      setViewMode("day")
                    }}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? "text-purple-600" : "text-gray-700"}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          className={`text-xs p-1 rounded border ${getStatusColor(apt.status)} truncate`}
                          onClick={(e) => {
                            e.stopPropagation()
                            openAppointmentModal(apt)
                          }}
                        >
                          {new Date(apt.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAppointments.length - 3} mais
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-4">
              {getWeekDays().map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()

                return (
                  <div key={index} className="space-y-2">
                    <div className={`text-center pb-2 border-b-2 ${isToday ? "border-purple-600" : "border-gray-200"}`}>
                      <div className={`text-xs font-medium ${isToday ? "text-purple-600" : "text-gray-500"}`}>
                        {date.toLocaleDateString("pt-BR", { weekday: "short" })}
                      </div>
                      <div className={`text-xl font-bold ${isToday ? "text-purple-600" : "text-gray-900"}`}>
                        {date.getDate()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={`text-xs p-2 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(apt.status)}`}
                          onClick={() => openAppointmentModal(apt)}
                        >
                          <div className="font-semibold">
                            {new Date(apt.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="truncate">{apt.customer.name}</div>
                          <div className="truncate text-gray-600">{apt.service.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="p-6">
            <div className="space-y-3">
              {getAppointmentsForDate(currentDate).length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum agendamento para este dia</p>
                </div>
              ) : (
                getAppointmentsForDate(currentDate)
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(apt.status)}`}
                      onClick={() => openAppointmentModal(apt)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <span className="font-semibold text-lg">
                              {new Date(apt.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(apt.status)}`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="ml-8 space-y-1">
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{apt.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Scissors className="w-4 h-4" />
                              <span>{apt.service.name}</span>
                              <span className="text-gray-400">•</span>
                              <span>{apt.service.duration} min</span>
                              <span className="text-gray-400">•</span>
                              <span className="font-semibold text-green-600">
                                R$ {apt.service.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>Profissional: {apt.professional.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Detalhes do Agendamento</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Data e Hora</div>
                    <div className="font-semibold">
                      {new Date(selectedAppointment.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>

                {/* Customer */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Cliente</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedAppointment.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedAppointment.customer.phone}</span>
                    </div>
                    {selectedAppointment.customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedAppointment.customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Serviço</div>
                  <div className="space-y-1">
                    <div className="font-medium">{selectedAppointment.service.name}</div>
                    <div className="text-sm text-gray-600">
                      Duração: {selectedAppointment.service.duration} minutos
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      R$ {selectedAppointment.service.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Professional */}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Profissional</div>
                  <div className="font-medium">{selectedAppointment.professional.name}</div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false)
                    window.location.href = "/dashboard/agendamentos"
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Ver todos os agendamentos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
