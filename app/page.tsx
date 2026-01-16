"use client"

import { Calendar, Users, BarChart3, Sparkles, Clock, Shield, TrendingUp, CheckCircle2, Star, ArrowRight, Zap, Bell, Lock, Crown } from "lucide-react"

export default function Home() {
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
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI</h1>
                  <p className="text-xs text-gray-400">Agendamento Inteligente</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => window.location.href = '/login'} className="px-5 py-2 text-gray-300 hover:text-white transition-colors font-medium">Entrar</button>
                <button onClick={() => window.location.href = '/register'} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold flex items-center gap-2">Começar Grátis <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm animate-[fadeIn_0.6s_ease-out]">
              <Sparkles className="h-4 w-4 text-yellow-400 animate-spin" style={{animationDuration:"3s"}} />
              <span className="text-gray-300">Mais de <strong className="text-white">1000 negócios</strong> confiam na gente</span>
            </div>

            {/* Título */}
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight animate-[fadeIn_0.8s_ease-out]">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-[gradient_3s_ease_infinite]">
                Agendamentos
              </span>
              <br />
              <span className="text-white">que Convertem Mais</span>
            </h2>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto animate-[fadeIn_1s_ease-out]">
              Sistema completo de gestão de agendamentos com IA, lembretes automáticos e relatórios em tempo real para seu negócio crescer
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeIn_1.2s_ease-out]">
              <button onClick={() => window.location.href = '/register'} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-500/50 font-bold text-lg hover:scale-105 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Testar 14 Dias Grátis
              </button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/10 transition-all font-semibold text-lg hover:scale-105">
                Ver Como Funciona
              </button>
            </div>

            {/* Checks */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 animate-[fadeIn_1.4s_ease-out]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Suporte em português</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-gray-400">Taxa de Satisfação</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 animate-[fadeIn_0.4s_ease-out]">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">50k+</div>
              <div className="text-gray-400">Agendamentos/Mês</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 animate-[fadeIn_0.5s_ease-out]">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-400">Disponibilidade</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 animate-[fadeIn_0.6s_ease-out]">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">&lt; 2s</div>
              <div className="text-gray-400">Tempo de Resposta</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 pb-32">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Recursos Poderosos
                </span>
              </h3>
              <p className="text-xl text-gray-400">Tudo que você precisa para gerenciar seu negócio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:rotate-1 animate-[fadeIn_0.3s_ease-out] group">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Agenda Inteligente</h4>
                <p className="text-gray-400">Sistema que evita conflitos e otimiza automaticamente os horários disponíveis</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:rotate-1 animate-[fadeIn_0.4s_ease-out] group">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Gestão de Clientes</h4>
                <p className="text-gray-400">Perfis completos com histórico, preferências e análise de comportamento</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:rotate-1 animate-[fadeIn_0.5s_ease-out] group">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Relatórios Avançados</h4>
                <p className="text-gray-400">Dashboards em tempo real com insights e métricas de performance</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:rotate-1 animate-[fadeIn_0.6s_ease-out] group">
                <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/50 group-hover:scale-110 transition-transform">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Lembretes Automáticos</h4>
                <p className="text-gray-400">Notificações por email e WhatsApp para reduzir faltas em até 90%</p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:rotate-1 animate-[fadeIn_0.7s_ease-out] group">
                <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Segurança Total</h4>
                <p className="text-gray-400">Criptografia de ponta e conformidade com LGPD para proteger seus dados</p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105 hover:rotate-1 animate-[fadeIn_0.8s_ease-out] group">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Otimização de Horários</h4>
                <p className="text-gray-400">IA que sugere os melhores horários baseado em padrões históricos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 pb-32">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Planos Transparentes
                </span>
              </h3>
              <p className="text-xl text-gray-400">Escolha o plano ideal para seu negócio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Plano Freemium */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all animate-[fadeIn_0.3s_ease-out]">
                <div className="space-y-6">
                  <div>
                    <div className="inline-block px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs font-bold mb-3">
                      GRÁTIS PARA SEMPRE
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Freemium</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">R$0</span>
                      <span className="text-gray-400">/mês</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>1 profissional</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>20 agendamentos/mês</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Notificações por e-mail</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Relatórios básicos</span>
                    </li>
                  </ul>
                  <button onClick={() => window.location.href = '/register'} className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold">
                    Começar Grátis
                  </button>
                </div>
              </div>

              {/* Plano Inicial */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 animate-[fadeIn_0.4s_ease-out]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Inicial</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">R$49</span>
                      <span className="text-gray-400">/mês</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Ideal para autônomos</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Até 2 profissionais</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Agendamentos ilimitados</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>WhatsApp + E-mail + SMS</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Relatórios mensais</span>
                    </li>
                  </ul>
                  <button onClick={() => window.location.href = '/register?plan=inicial'} className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold">
                    Começar Agora
                  </button>
                </div>
              </div>

              {/* Plano Profissional */}
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border-2 border-indigo-500/50 rounded-2xl p-6 hover:scale-105 transition-all relative animate-[fadeIn_0.5s_ease-out]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star className="h-3 w-3 animate-spin" style={{animationDuration:"3s"}} />
                    Mais Popular
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Profissional</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">R$99</span>
                      <span className="text-gray-400">/mês</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Para pequenas equipes</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Até 6 profissionais</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Tudo do plano Inicial</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Relatórios avançados</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>API de integração</span>
                    </li>
                  </ul>
                  <button onClick={() => window.location.href = '/register?plan=professional'} className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all font-semibold shadow-lg">
                    Assinar Agora
                  </button>
                </div>
              </div>

              {/* Plano Premium */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 animate-[fadeIn_0.6s_ease-out]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Premium</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">R$199</span>
                      <span className="text-gray-400">/mês</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Solução completa</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Até 15 profissionais</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Tudo do plano Profissional</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Suporte prioritário 24/7</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>Integrações personalizadas</span>
                    </li>
                  </ul>
                  <button onClick={() => window.location.href = '/register?plan=premium'} className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold">
                    Contratar Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="container mx-auto px-4 pb-32">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/50 rounded-3xl p-12 text-center space-y-6 hover:scale-105 transition-all">
              <h3 className="text-4xl md:text-5xl font-bold">
                Pronto para transformar <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  seu negócio?
                </span>
              </h3>
              <p className="text-xl text-gray-400">
                Junte-se a mais de 1000 negócios que já estão crescendo com o AGENDAKI
              </p>
              <button onClick={() => window.location.href = '/register'} className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-500/50 font-bold text-xl hover:scale-110 inline-flex items-center gap-3">
                <Zap className="h-6 w-6" />
                Começar Gratuitamente
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Logo */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI</h1>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Sistema completo de agendamento para seu negócio crescer
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold mb-4">Produto</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Recursos</a></li>
                  <li><a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors cursor-pointer">Preços</a></li>
                  <li><a href="/casos-de-uso" className="hover:text-white transition-colors cursor-pointer">Casos de Uso</a></li>
                  <li><a href="/integracoes" className="hover:text-white transition-colors cursor-pointer">Integrações</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Empresa</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/sobre" className="hover:text-white transition-colors cursor-pointer">Sobre</a></li>
                  <li><a href="/blog" className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
                  <li><a href="/carreiras" className="hover:text-white transition-colors cursor-pointer">Carreiras</a></li>
                  <li><a href="/contato" className="hover:text-white transition-colors cursor-pointer">Contato</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/privacidade" className="hover:text-white transition-colors cursor-pointer">Privacidade</a></li>
                  <li><a href="/termos" className="hover:text-white transition-colors cursor-pointer">Termos</a></li>
                  <li><a href="/lgpd" className="hover:text-white transition-colors cursor-pointer">LGPD</a></li>
                  <li><a href="/seguranca" className="hover:text-white transition-colors cursor-pointer">Segurança</a></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
              © 2026 AGENDAKI. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}
