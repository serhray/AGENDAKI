"use client"

import { Calendar, ArrowLeft, Sparkles, TrendingUp, Users, Clock } from "lucide-react"

export default function BlogPage() {
  const posts = [
    {
      categoria: "Dicas",
      titulo: "10 Estratégias para Reduzir Faltas em Agendamentos",
      resumo: "Descubra técnicas comprovadas para diminuir o no-show e aumentar sua taxa de comparecimento.",
      data: "15 Jan 2026",
      leitura: "5 min"
    },
    {
      categoria: "Tendências",
      titulo: "O Futuro dos Agendamentos Online em 2026",
      resumo: "As principais tendências tecnológicas que estão transformando a forma como agendamos serviços.",
      data: "12 Jan 2026",
      leitura: "7 min"
    },
    {
      categoria: "Case de Sucesso",
      titulo: "Como um Salão Aumentou 40% sua Receita com AGENDAKI",
      resumo: "História real de transformação digital e crescimento de um salão de beleza em São Paulo.",
      data: "10 Jan 2026",
      leitura: "6 min"
    },
    {
      categoria: "Tutorial",
      titulo: "Configurando seu Primeiro Negócio no AGENDAKI",
      resumo: "Guia passo a passo para começar a usar a plataforma e fazer seu primeiro agendamento.",
      data: "8 Jan 2026",
      leitura: "4 min"
    },
    {
      categoria: "Marketing",
      titulo: "Como Usar Lembretes Automáticos para Fidelizar Clientes",
      resumo: "Estratégias de comunicação que aumentam a retenção e satisfação dos seus clientes.",
      data: "5 Jan 2026",
      leitura: "5 min"
    },
    {
      categoria: "Produtividade",
      titulo: "Otimizando sua Agenda: Dicas de Profissionais",
      resumo: "Aprenda com especialistas como organizar melhor seu tempo e atender mais clientes.",
      data: "3 Jan 2026",
      leitura: "6 min"
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
                <span className="text-gray-300">Blog</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">Novidades e </span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Conteúdos
                </span>
              </h1>

              <p className="text-xl text-gray-400">
                Dicas, tutoriais e insights para você crescer seu negócio
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
                <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full mb-4">
                  {post.categoria}
                </div>
                
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.titulo}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.resumo}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.data}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.leitura}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-400 mb-6">Conteúdo em desenvolvimento. Em breve mais artigos!</p>
            <button onClick={() => window.location.href = '/register'} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold">
              Começar a Usar Agora
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
