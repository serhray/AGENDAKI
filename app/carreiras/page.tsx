"use client"

import { Calendar, ArrowLeft, Sparkles, Heart, Rocket, Users, Zap } from "lucide-react"

export default function CarreirasPage() {
  const vagas = [
    {
      area: "Desenvolvimento",
      titulo: "Desenvolvedor Full Stack Sênior",
      tipo: "Tempo Integral",
      local: "Remoto",
      descricao: "Buscamos desenvolvedor experiente em Next.js, React e Node.js para trabalhar em features inovadoras."
    },
    {
      area: "Design",
      titulo: "Product Designer",
      tipo: "Tempo Integral",
      local: "Remoto",
      descricao: "Criar experiências incríveis para milhares de usuários. Experiência com Figma e design systems."
    },
    {
      area: "Marketing",
      titulo: "Growth Marketing Manager",
      tipo: "Tempo Integral",
      local: "Híbrido - SP",
      descricao: "Liderar estratégias de crescimento e aquisição de clientes. Experiência com SaaS B2B."
    }
  ]

  const valores = [
    { icon: Heart, titulo: "Cliente no Centro", desc: "Tudo que fazemos é pensando em criar valor para nossos clientes" },
    { icon: Rocket, titulo: "Inovação Constante", desc: "Sempre buscando formas melhores de resolver problemas" },
    { icon: Users, titulo: "Colaboração", desc: "Trabalhamos juntos, compartilhamos conhecimento e crescemos em equipe" },
    { icon: Zap, titulo: "Execução Rápida", desc: "Agilidade para testar, aprender e evoluir rapidamente" }
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
                <span className="text-gray-300">Carreiras</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">Faça Parte do </span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Futuro
                </span>
              </h1>

              <p className="text-xl text-gray-400">
                Venha transformar a gestão de agendamentos para milhares de negócios no Brasil
              </p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valores.map((valor, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all text-center">
                  <valor.icon className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{valor.titulo}</h3>
                  <p className="text-sm text-gray-400">{valor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vagas */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Vagas Abertas</h2>
              <p className="text-gray-400">Estamos crescendo e buscando talentos incríveis</p>
            </div>

            <div className="space-y-4">
              {vagas.map((vaga, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full mb-2">
                        {vaga.area}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{vaga.titulo}</h3>
                      <p className="text-gray-400 text-sm mb-3">{vaga.descricao}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>⏰ {vaga.tipo}</span>
                        <span>📍 {vaga.local}</span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all font-semibold whitespace-nowrap">
                      Candidatar-se
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Não encontrou sua vaga?</h3>
              <p className="text-gray-300 mb-6">
                Envie seu currículo para <a href="mailto:rh@agendaki.com" className="text-indigo-400 hover:text-indigo-300">rh@agendaki.com</a>
                <br />Estamos sempre em busca de pessoas talentosas!
              </p>
            </div>
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
