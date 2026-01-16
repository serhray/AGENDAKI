"use client"

import { Calendar, ArrowLeft, Users, BarChart3, Clock, Bell, Zap, Shield, TrendingUp, CheckCircle2, Star, Sparkles, Crown, Target, Rocket } from "lucide-react"
import Image from "next/image"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" style={{animationDuration:"8s"}} />
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-transparent animate-pulse" style={{animationDuration:"10s"}} />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI</h1>
                  </div>
                </a>
              </div>
              <div className="flex gap-3">
                <button onClick={() => window.location.href = '/login'} className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium">Entrar</button>
                <button onClick={() => window.location.href = '/register'} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold">Começar Grátis</button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto">
            <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Home
            </a>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">Sobre nós</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Transformando
                </span>
                <br />
                <span className="text-white">a Gestão de Agendamentos</span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed">
                O AGENDAKI nasceu da necessidade real de profissionais e negócios que perdiam tempo e dinheiro com agendamentos desorganizados. Criamos uma plataforma completa, intuitiva e poderosa para revolucionar a forma como você gerencia seu tempo.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-gray-400 text-sm">Negócios Ativos</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">50k+</div>
              <div className="text-gray-400 text-sm">Agendamentos/Mês</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-gray-400 text-sm">Satisfação</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Disponível</div>
            </div>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-8 w-8 text-indigo-400" />
                <h2 className="text-3xl font-bold">Nossa Missão</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Simplificar a gestão de agendamentos para que você possa focar no que realmente importa: <strong className="text-white">atender seus clientes com excelência</strong>.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Acreditamos que tecnologia deve ser acessível, intuitiva e poderosa. Por isso, desenvolvemos uma plataforma que qualquer pessoa pode usar, mas com recursos avançados para quem precisa crescer.
              </p>
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Veja o AGENDAKI em Ação
                </span>
              </h2>
              <p className="text-xl text-gray-400">Interface intuitiva e poderosa para gerenciar seu negócio</p>
            </div>

            {/* Dashboard Screenshot */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-indigo-400" />
                <h3 className="text-2xl font-bold">Dashboard Inteligente</h3>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-4 hover:scale-[1.02] transition-transform">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10">
                      <div className="text-sm text-gray-400 mb-2">Agendamentos Hoje</div>
                      <div className="text-3xl font-bold text-white">28</div>
                      <div className="text-xs text-green-400 mt-2">↑ 12% vs ontem</div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-white/10">
                      <div className="text-sm text-gray-400 mb-2">Receita Mês</div>
                      <div className="text-3xl font-bold text-white">R$ 8.450</div>
                      <div className="text-xs text-green-400 mt-2">↑ 25% vs mês anterior</div>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-white/10">
                      <div className="text-sm text-gray-400 mb-2">Taxa Ocupação</div>
                      <div className="text-3xl font-bold text-white">87%</div>
                      <div className="text-xs text-yellow-400 mt-2">● Ótimo</div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    <div className="text-sm text-gray-400 mb-3">Agendamentos por dia da semana</div>
                    <div className="flex items-end gap-2 h-24">
                      {[65, 45, 78, 92, 88, 95, 72].map((height, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t" style={{height: `${height}%`}}></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-center">Métricas em tempo real para decisões mais inteligentes</p>
            </div>

            {/* Calendar Screenshot */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-purple-400" />
                <h3 className="text-2xl font-bold">Calendário Interativo</h3>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-4 hover:scale-[1.02] transition-transform">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                      <div key={day} className="text-center text-sm text-gray-400 font-medium">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({length: 35}).map((_, i) => {
                      const hasAppointment = [5, 8, 12, 15, 19, 22, 26].includes(i)
                      const isToday = i === 15
                      return (
                        <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                          isToday ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold' :
                          hasAppointment ? 'bg-purple-500/30 text-white' :
                          'bg-white/5 text-gray-400'
                        }`}>
                          {i + 1}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <div className="w-1 h-12 bg-indigo-500 rounded"></div>
                      <div className="flex-1">
                        <div className="font-medium">Corte + Barba - João Silva</div>
                        <div className="text-sm text-gray-400">14:00 - 15:00</div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <div className="w-1 h-12 bg-purple-500 rounded"></div>
                      <div className="flex-1">
                        <div className="font-medium">Manicure - Maria Santos</div>
                        <div className="text-sm text-gray-400">15:30 - 16:30</div>
                      </div>
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-center">Visualize e gerencie todos os agendamentos em um só lugar</p>
            </div>

            {/* Booking Page Screenshot */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-yellow-400" />
                <h3 className="text-2xl font-bold">Página de Agendamento Pública</h3>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/20 rounded-2xl p-4 hover:scale-[1.02] transition-transform">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold">Salão Beleza Total</h4>
                    <p className="text-gray-400">Escolha seu serviço e horário</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: 'Corte Feminino', price: 'R$ 80', time: '1h' },
                      { name: 'Manicure', price: 'R$ 45', time: '45min' },
                      { name: 'Escova', price: 'R$ 60', time: '1h' },
                      { name: 'Depilação', price: 'R$ 120', time: '1h30' }
                    ].map((service, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="font-medium">{service.name}</div>
                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                          <span>{service.price}</span>
                          <span>{service.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-sm text-gray-300 mb-2">Horários Disponíveis - Hoje</div>
                    <div className="flex gap-2 flex-wrap">
                      {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                        <button key={time} className="px-4 py-2 bg-white/10 hover:bg-yellow-500/30 border border-white/20 rounded-lg text-sm transition-all">
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-center">Seus clientes agendam online 24/7, sem precisar ligar</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Por que escolher o </span>
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Rápido e Intuitivo', desc: 'Configure em minutos, use sem complicação' },
                { icon: Bell, title: 'Lembretes Automáticos', desc: 'Reduza faltas com notificações por email' },
                { icon: BarChart3, title: 'Relatórios Completos', desc: 'Veja métricas e exporte para análise' },
                { icon: Shield, title: 'Seguro e Confiável', desc: 'Seus dados protegidos com criptografia' },
                { icon: Users, title: 'Multi-profissionais', desc: 'Gerencie toda sua equipe em um lugar' },
                { icon: TrendingUp, title: 'Cresça sem Limites', desc: 'Planos flexíveis conforme você escala' }
              ].map((feature, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105">
                  <feature.icon className="h-10 w-10 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm">
              <Rocket className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">Comece hoje mesmo</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">Pronto para </span>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Transformar
              </span>
              <br />
              <span className="text-white">seu Negócio?</span>
            </h2>
            
            <p className="text-xl text-gray-300">
              Teste grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => window.location.href = '/register'} className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-500/50 font-bold text-xl hover:scale-110 inline-flex items-center gap-3">
                <Zap className="h-6 w-6" />
                Começar Gratuitamente
              </button>
              <button onClick={() => window.location.href = '/login'} className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-all font-semibold text-xl hover:scale-105">
                Já tenho conta
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Configuração em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Suporte em português</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-400 text-sm">
              © 2026 AGENDAKI. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
