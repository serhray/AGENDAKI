"use client"

import { Calendar, ArrowLeft, Sparkles, CheckCircle2, Mail, MessageSquare, CreditCard, BarChart3, Bell, Shield } from "lucide-react"

export default function IntegracoesPage() {
  const integracoes = [
    {
      icon: CreditCard,
      nome: "Stripe",
      categoria: "Pagamentos",
      desc: "Receba pagamentos online com segurança. Aceite cartões, Pix e mais.",
      status: "Disponível",
      popular: true
    },
    {
      icon: Mail,
      nome: "Gmail / Outlook",
      categoria: "Email",
      desc: "Envie lembretes e confirmações automaticamente via email.",
      status: "Disponível",
      popular: true
    },
    {
      icon: MessageSquare,
      nome: "WhatsApp Business",
      categoria: "Mensagens",
      desc: "Notifique seus clientes via WhatsApp de forma automática.",
      status: "Em breve",
      popular: true
    },
    {
      icon: BarChart3,
      nome: "Google Analytics",
      categoria: "Analytics",
      desc: "Acompanhe métricas de acesso e conversão da sua página pública.",
      status: "Disponível",
      popular: false
    },
    {
      icon: Calendar,
      nome: "Google Calendar",
      categoria: "Calendário",
      desc: "Sincronize agendamentos com seu Google Calendar automaticamente.",
      status: "Em breve",
      popular: true
    },
    {
      icon: Bell,
      nome: "Slack",
      categoria: "Comunicação",
      desc: "Receba notificações de novos agendamentos direto no Slack.",
      status: "Em breve",
      popular: false
    },
    {
      icon: Shield,
      nome: "Zapier",
      categoria: "Automação",
      desc: "Conecte com milhares de apps via Zapier e automatize processos.",
      status: "Em breve",
      popular: false
    },
    {
      icon: CreditCard,
      nome: "PagSeguro",
      categoria: "Pagamentos",
      desc: "Alternativa nacional para recebimento de pagamentos online.",
      status: "Planejado",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" style={{animationDuration:"8s"}} />
      
      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI</h1>
              </a>
              <div className="flex gap-3">
                <button onClick={() => window.location.href = '/login'} className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium">Entrar</button>
                <button onClick={() => window.location.href = '/register'} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold">Começar Grátis</button>
              </div>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto">
            <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Home
            </a>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">Integrações</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">Conecte com </span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Suas Ferramentas
                </span>
              </h1>

              <p className="text-xl text-gray-400">
                Integre o AGENDAKI com os apps que você já usa e automatize processos
              </p>
            </div>
          </div>
        </section>

        {/* Integrações Populares */}
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Mais Populares</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integracoes.filter(i => i.popular).map((int, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <int.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      int.status === 'Disponível' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {int.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{int.nome}</h3>
                  <p className="text-sm text-gray-500 mb-3">{int.categoria}</p>
                  <p className="text-gray-400 text-sm">{int.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Todas as Integrações */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Todas as Integrações</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integracoes.filter(i => !i.popular).map((int, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                      <int.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      int.status === 'Disponível' 
                        ? 'bg-green-500/20 text-green-400' 
                        : int.status === 'Em breve'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {int.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{int.nome}</h3>
                  <p className="text-sm text-gray-500 mb-3">{int.categoria}</p>
                  <p className="text-gray-400 text-sm">{int.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Precisa de uma Integração Específica?</h2>
            <p className="text-gray-300 mb-6">
              Entre em contato e vamos avaliar adicionar a integração que você precisa
            </p>
            <button onClick={() => window.location.href = '/contato'} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold">
              Solicitar Integração
            </button>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
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
