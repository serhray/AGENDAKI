"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { 
  Calendar, Clock, User, Phone, Mail, Check, 
  ArrowLeft, ArrowRight, Scissors, ChevronLeft, ChevronRight
} from "lucide-react"

type Service = {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
}

type Professional = {
  id: string
  name: string
}

type Business = {
  id: string
  name: string
  primaryColor: string
  phone: string
  email: string
  address: string | null
  minAdvanceBookingHours: number
}

type TimeSlot = {
  time: string
  available: boolean
}

type Step = 1 | 2 | 3 | 4 | 5

export default function BookingPage() {
  const params = useParams()
  const slug = params.slug as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Booking state
  const [step, setStep] = useState<Step>(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // Customer data
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  
  const [submitting, setSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    fetchBusinessData()
  }, [slug])

  useEffect(() => {
    if (selectedService && selectedProfessional && selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedService, selectedProfessional, selectedDate])

  const fetchBusinessData = async () => {
    try {
      const response = await fetch(`/api/booking/${slug}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Negócio não encontrado")
        setLoading(false)
        return
      }

      setBusiness(data.business)
      setServices(data.services)
      setProfessionals(data.professionals)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setError("Erro ao carregar informações")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedService || !selectedProfessional) return

    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await fetch(
        `/api/booking/${slug}/slots?date=${dateStr}&serviceId=${selectedService.id}&professionalId=${selectedProfessional.id}`
      )
      const data = await response.json()
      setTimeSlots(data.slots || [])
    } catch (error) {
      console.error("Erro ao buscar horários:", error)
    }
  }

  const getMonthDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateAvailable = (date: Date) => {
    if (!business) return false
    const now = new Date()
    const minDate = new Date(now.getTime() + business.minAdvanceBookingHours * 60 * 60 * 1000)
    return date >= minDate && date.getDay() !== 0 // Exclude Sundays
  }

  const handleSubmit = async () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) return
    if (!customerName || !customerPhone) {
      setError("Nome e telefone são obrigatórios")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const appointmentDate = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(':')
      appointmentDate.setHours(parseInt(hours), parseInt(minutes))

      const response = await fetch(`/api/booking/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          professionalId: selectedProfessional.id,
          date: appointmentDate.toISOString(),
          time: selectedTime,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao realizar agendamento")
        return
      }

      setBookingSuccess(true)
    } catch (error) {
      console.error("Erro ao agendar:", error)
      setError("Erro ao realizar agendamento")
    } finally {
      setSubmitting(false)
    }
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
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Negócio não encontrado</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 md:p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-600">Serviço:</span>
              <span className="font-medium text-gray-900">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-600">Profissional:</span>
              <span className="font-medium text-gray-900">{selectedProfessional?.name}</span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-600">Data:</span>
              <span className="font-medium text-gray-900">
                {selectedDate?.toLocaleDateString("pt-BR")} às {selectedTime}
              </span>
            </div>
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-600">Valor:</span>
              <span className="font-medium text-green-600">
                R$ {selectedService?.price.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-500">
            Entre em contato através do {business?.phone} caso precise cancelar ou remarcar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="py-6 md:py-8 px-4 text-white"
        style={{ backgroundColor: business?.primaryColor || "#6366f1" }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{business?.name}</h1>
          <p className="opacity-90 text-sm md:text-base">Agende seu horário online</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 py-3 md:py-4">
        <div className="max-w-4xl mx-auto px-2 md:px-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Serviço" },
              { num: 2, label: "Profissional" },
              { num: 3, label: "Data" },
              { num: 4, label: "Horário" },
              { num: 5, label: "Dados" }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
                      step >= s.num 
                        ? 'text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    style={{ 
                      backgroundColor: step >= s.num ? business?.primaryColor : undefined 
                    }}
                  >
                    {step > s.num ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : s.num}
                  </div>
                  <span className="text-[10px] md:text-xs mt-1 text-gray-600 hidden sm:block">{s.label}</span>
                </div>
                {index < 4 && (
                  <div 
                    className={`w-6 md:w-12 h-1 mx-1 md:mx-2 ${
                      step > s.num ? '' : 'bg-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: step > s.num ? business?.primaryColor : undefined 
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Escolha o serviço</h2>
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service)
                  setStep(2)
                }}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4 md:p-6 cursor-pointer hover:border-purple-500 transition-colors active:scale-[0.98] min-h-[44px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Scissors className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                      <h3 className="text-base md:text-lg font-bold text-gray-900">{service.name}</h3>
                    </div>
                    {service.description && (
                      <p className="text-gray-600 text-xs md:text-sm mb-3">{service.description}</p>
                    )}
                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="font-bold text-green-600 text-base md:text-lg">
                        R$ {service.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Select Professional */}
        {step === 2 && (
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 p-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Escolha o profissional</h2>
            {professionals.map((professional) => (
              <div
                key={professional.id}
                onClick={() => {
                  setSelectedProfessional(professional)
                  setStep(3)
                }}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4 md:p-6 cursor-pointer hover:border-purple-500 transition-colors active:scale-[0.98] min-h-[44px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                    </div>
                    <span className="text-base md:text-lg font-medium text-gray-900">{professional.name}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Select Date */}
        {step === 3 && (
          <div>
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha a data</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <button
                  onClick={() => {
                    const newMonth = new Date(currentMonth)
                    newMonth.setMonth(newMonth.getMonth() - 1)
                    setCurrentMonth(newMonth)
                  }}
                  className="p-2.5 md:p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-base md:text-lg font-bold capitalize">
                  {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </h3>
                <button
                  onClick={() => {
                    const newMonth = new Date(currentMonth)
                    newMonth.setMonth(newMonth.getMonth() + 1)
                    setCurrentMonth(newMonth)
                  }}
                  className="p-2.5 md:p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-[10px] md:text-sm py-1 md:py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {getMonthDays().map((date, index) => {
                  if (!date) return <div key={index} />
                  
                  const isAvailable = isDateAvailable(date)
                  const isSelected = selectedDate?.toDateString() === date.toDateString()
                  
                  return (
                    <button
                      key={index}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedDate(date)
                        setStep(4)
                      }}
                      className={`aspect-square rounded-lg text-xs md:text-sm font-medium transition-colors min-h-[44px] md:min-h-0 ${
                        isSelected
                          ? 'text-white'
                          : isAvailable
                          ? 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      style={{
                        backgroundColor: isSelected ? business?.primaryColor : undefined
                      }}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Select Time */}
        {step === 4 && (
          <div>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 p-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Escolha o horário</h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              {selectedDate?.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
            </p>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              {timeSlots.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm md:text-base">Nenhum horário disponível para esta data</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => {
                        setSelectedTime(slot.time)
                        setStep(5)
                      }}
                      className={`py-3 px-2 md:px-4 rounded-lg text-sm md:text-base font-medium transition-colors min-h-[44px] ${
                        slot.available
                          ? 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-2 border-gray-200 hover:border-purple-500'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Customer Data */}
        {step === 5 && (
          <div>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus dados</h2>
            
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Resumo do agendamento</h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="font-medium text-gray-900">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profissional:</span>
                  <span className="font-medium text-gray-900">{selectedProfessional?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium text-gray-900">
                    {selectedDate?.toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium text-gray-900">{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold text-green-600">
                    R$ {selectedService?.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 min-h-[44px]"
                    placeholder="Seu nome"
                  />
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
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 min-h-[44px]"
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
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 min-h-[44px]"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Recomendamos informar o email para receber confirmação e lembretes automáticos
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !customerName || !customerPhone}
                  className="w-full text-white px-6 py-3 md:py-4 rounded-lg text-base md:text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
                  style={{ backgroundColor: business?.primaryColor }}
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

                {/* Aviso sobre lembretes automáticos */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs md:text-sm text-blue-800 flex items-start gap-2">
                    <span className="text-base">📧</span>
                    <span>
                      <strong>Lembretes automáticos:</strong> Após a confirmação do agendamento, você receberá lembretes por email antes da data marcada.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
