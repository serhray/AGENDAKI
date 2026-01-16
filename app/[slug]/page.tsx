"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { 
  Calendar, Clock, User, Phone, Mail, MapPin, 
  ChevronLeft, ChevronRight, Check, Scissors, DollarSign
} from "lucide-react"

type Business = {
  id: string
  name: string
  phone: string
  address: string | null
  city: string | null
  primaryColor: string
  minAdvanceBookingHours: number
}

type Service = {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
}

type Professional = {
  id: string
  name: string
}

type TimeSlot = {
  time: string
  available: boolean
}

type Step = "service" | "professional" | "datetime" | "customer" | "confirm"

export default function BookingPage() {
  const params = useParams()
  const slug = params.slug as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Booking state
  const [step, setStep] = useState<Step>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProfessional, setProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    email: ""
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchBusinessData()
  }, [slug])

  useEffect(() => {
    if (selectedDate && selectedService && selectedProfessional) {
      fetchAvailableSlots()
    }
  }, [selectedDate, selectedService, selectedProfessional])

  const fetchBusinessData = async () => {
    try {
      const response = await fetch(`/api/public/business/${slug}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Negócio não encontrado")
        return
      }

      setBusiness(data.business)
      setServices(data.services)
      setProfessionals(data.professionals)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setError("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedService || !selectedProfessional) return
    
    setLoadingSlots(true)
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await fetch(
        `/api/public/available-slots?` +
        `businessId=${business?.id}&` +
        `serviceId=${selectedService.id}&` +
        `professionalId=${selectedProfessional.id}&` +
        `date=${dateStr}`
      )
      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (error) {
      console.error("Erro ao buscar horários:", error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business?.id,
          serviceId: selectedService?.id,
          professionalId: selectedProfessional?.id,
          date: selectedDate,
          time: selectedTime,
          customer: customerData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao criar agendamento")
        return
      }

      setSuccess(true)
    } catch (error) {
      console.error("Erro ao agendar:", error)
      setError("Erro ao criar agendamento")
    } finally {
      setSubmitting(false)
    }
  }

  const getNextDays = (count: number) => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error && !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Negócio não encontrado</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h1>
          <p className="text-gray-600 mb-4">
            Seu agendamento foi realizado com sucesso. Em breve você receberá uma confirmação.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
            <p className="text-sm"><span className="font-medium">Serviço:</span> {selectedService?.name}</p>
            <p className="text-sm"><span className="font-medium">Profissional:</span> {selectedProfessional?.name}</p>
            <p className="text-sm"><span className="font-medium">Data:</span> {selectedDate?.toLocaleDateString("pt-BR")}</p>
            <p className="text-sm"><span className="font-medium">Horário:</span> {selectedTime}</p>
            <p className="text-sm"><span className="font-medium">Valor:</span> R$ {selectedService?.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    )
  }

  const primaryColor = business?.primaryColor || "#6366f1"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{business?.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            {business?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {business.phone}
              </div>
            )}
            {business?.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {business.address}{business.city && `, ${business.city}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { id: "service", label: "Serviço" },
            { id: "professional", label: "Profissional" },
            { id: "datetime", label: "Data/Hora" },
            { id: "customer", label: "Seus Dados" },
            { id: "confirm", label: "Confirmar" }
          ].map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s.id
                      ? "text-white"
                      : selectedService && index < ["service", "professional", "datetime", "customer", "confirm"].indexOf(step)
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                  style={step === s.id ? { backgroundColor: primaryColor } : {}}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1 text-gray-600 hidden sm:block">{s.label}</span>
              </div>
              {index < 4 && <div className="h-0.5 bg-gray-300 flex-1" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {step === "service" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha um serviço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service)
                      setStep("professional")
                    }}
                    className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <Scissors className="w-5 h-5 text-gray-400" />
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {service.duration} min
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-green-600">
                        <DollarSign className="w-4 h-4" />
                        R$ {service.price.toFixed(2)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "professional" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha um profissional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professionals.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setProfessional(prof)
                      setStep("datetime")
                    }}
                    className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">
                          {prof.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{prof.name}</h3>
                        <p className="text-sm text-gray-600">{selectedService?.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("service")}
                className="mt-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            </div>
          )}

          {step === "datetime" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha data e horário</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Selecione a data</h3>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  {getNextDays(14).map((date) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString()
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date)
                          setSelectedTime(null)
                        }}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          isSelected
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-xs text-gray-600">
                          {date.toLocaleDateString("pt-BR", { weekday: "short" })}
                        </div>
                        <div className="text-lg font-semibold">{date.getDate()}</div>
                        <div className="text-xs text-gray-600">
                          {date.toLocaleDateString("pt-BR", { month: "short" })}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Selecione o horário</h3>
                  {loadingSlots ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum horário disponível para esta data
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => {
                            if (slot.available) {
                              setSelectedTime(slot.time)
                              setStep("customer")
                            }
                          }}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                            selectedTime === slot.time
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : slot.available
                              ? "border-gray-200 hover:border-gray-300"
                              : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep("professional")}
                className="mt-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            </div>
          )}

          {step === "customer" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus dados</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Seu nome"
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
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("datetime")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  disabled={!customerData.name || !customerData.phone}
                  className="flex-1 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmar agendamento</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Scissors className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Serviço</p>
                    <p className="font-semibold text-gray-900">{selectedService?.name}</p>
                    <p className="text-sm text-gray-600">{selectedService?.duration} minutos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Profissional</p>
                    <p className="font-semibold text-gray-900">{selectedProfessional?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Data e Horário</p>
                    <p className="font-semibold text-gray-900">
                      {selectedDate?.toLocaleDateString("pt-BR", { 
                        day: "2-digit", 
                        month: "long", 
                        year: "numeric" 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{selectedTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Seus dados</p>
                    <p className="font-semibold text-gray-900">{customerData.name}</p>
                    <p className="text-sm text-gray-600">{customerData.phone}</p>
                    {customerData.email && (
                      <p className="text-sm text-gray-600">{customerData.email}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {selectedService?.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("customer")}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Confirmando...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Confirmar Agendamento
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>Powered by <span className="font-semibold text-purple-600">AGENDAKI</span></p>
      </div>
    </div>
  )
}
