"use client"

import { Calendar, ArrowLeft, Scissors, Dumbbell, Stethoscope, GraduationCap, Wrench, Sparkles, CheckCircle2, Users, Clock, TrendingUp, Star } from "lucide-react"

export default function CasosDeUsoPage() {
  const casosDeUso = [
    {
      icon: Scissors,
      title: "Salões de Beleza & Barbearias",
      desc: "Gerencie cortes, coloração, manicure e mais. Controle múltiplos profissionais e serviços.",
      features: [
        "Agenda por profissional",
        "Serviços com duração variável",
        "Lembretes para reduzir faltas",
        "Galeria de trabalhos"
      ],
      stats: { clientes: "500+", satisfacao: "99%" }
    },
    {
      icon: Stethoscope,
      title: "Clínicas & Consultórios",
      desc: "Perfeito para médicos, dentistas, psicólogos e fisioterapeutas. LGPD compliant.",
      features: [
        "Múltiplos especialistas",
        "Confirmação de consultas",
        "Histórico de pacientes",
        "Relatórios mensais"
      ],
      stats: { clientes: "300+", satisfacao: "98%" }
    },
    {
      icon: Dumbbell,
      title: "Academias & Personal Trainers",
      desc: "Agende treinos, avaliações e aulas. Gerencie horários de grupo e individuais.",
      features: [
        "Aulas em grupo",
        "Treinos personalizados",
        "Controle de presença",
        "Planos e pacotes"
      ],
      stats: { clientes: "150+", satisfacao: "97%" }
    },
    {
      icon: GraduationCap,
      title: "Escolas & Professores Particulares",
      desc: "Organize aulas, tutoria e reforço escolar. Perfeito para professores autônomos.",
      features: [
        "Aulas individuais ou grupo",
        "Materiais por aula",
        "Pagamentos recorrentes",
        "Progresso do aluno"
      ],
      stats: { clientes: "200+", satisfacao: "99%" }
    },
    {
      icon: Wrench,
      title: "Serviços Técnicos",
      desc: "Ideal para mecânicos, eletricistas, encanadores e prestadores de serviços.",
      features: [
        "Agendamento por localização",
        "Tempo de deslocamento",
        "Orçamentos online",
        "Fotos antes/depois"
      ],
      stats: { clientes: "100+", satisfacao: "96%" }
    },
    {
      icon: Star,
      title: "Spas & Estética",
      desc: "Massagens, tratamentos faciais, depilação e muito mais. Experiência premium.",
      features: [
        "Pacotes de serviços",
        "Produtos recomendados",
        "Programa de fidelidade",
        "Avaliações de clientes"
      ],
      stats: { clientes: "250+", satisfacao: "99%" }
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" style={{animationDuration:"8s"}} />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI</h1>
                </div>
              </a>
              <div className="flex gap-3">
                <button onClick={() => window.location.href = '/login'} className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium">Entrar</button>
                <button onClick={() => window.location.href = '/register'} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold">Começar Grátis</button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto">
            <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Home
            </a>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">Casos de Uso</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">Perfeito para </span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Qualquer Negócio
                </span>
              </h1>

              <p className="text-xl text-gray-400">
                Descubra como o AGENDAKI pode transformar a gestão de agendamentos do seu segmento
              </p>
            </div>
          </div>
        </section>

        {/* Casos de Uso */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto space-y-12">
            {casosDeUso.map((caso, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 hover:bg-white/10 transition-all">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                      <caso.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-bold mb-3">{caso.title}</h2>
                      <p className="text-lg text-gray-400">{caso.desc}</p>
                    </div>

                    <div className="flex gap-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          {caso.stats.clientes}
                        </div>
                        <div className="text-sm text-gray-400">Clientes</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {caso.stats.satisfacao}
                        </div>
                        <div className="text-sm text-gray-400">Satisfação</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {caso.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-4 border border-white/10">
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-12">
            <div className="text-center space-y-8">
              <h2 className="text-4xl font-bold">Números que Impressionam</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    1500+
                  </div>
                  <div className="text-sm text-gray-400">Negócios Ativos</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    50k+
                  </div>
                  <div className="text-sm text-gray-400">Agendamentos/Mês</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                    98%
                  </div>
                  <div className="text-sm text-gray-400">Satisfação Média</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-gray-400">Disponibilidade</div>
                </div>
              </div>

              <button onClick={() => window.location.href = '/register'} className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-500/50 font-bold text-xl hover:scale-110">
                Começar Gratuitamente
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
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
