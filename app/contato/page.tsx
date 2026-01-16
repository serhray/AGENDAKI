"use client"

import { Calendar, ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send, Sparkles, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria o envio real
    setEnviado(true)
    setTimeout(() => {
      setEnviado(false)
      setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
    }, 3000)
  }

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
                <span className="text-gray-300">Contato</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">Vamos </span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Conversar?
                </span>
              </h1>

              <p className="text-xl text-gray-400">
                Estamos aqui para ajudar. Entre em contato e nossa equipe responderá em até 24 horas.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
              
              {enviado ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto" />
                  <h3 className="text-xl font-bold">Mensagem Enviada!</h3>
                  <p className="text-gray-300">Responderemos em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone (opcional)</label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Assunto</label>
                    <select
                      required
                      value={formData.assunto}
                      onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Selecione...</option>
                      <option value="duvida">Dúvida sobre o produto</option>
                      <option value="suporte">Suporte técnico</option>
                      <option value="comercial">Contato comercial</option>
                      <option value="parceria">Proposta de parceria</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mensagem</label>
                    <textarea
                      required
                      value={formData.mensagem}
                      onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Descreva como podemos ajudar..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 space-y-6">
                <h2 className="text-2xl font-bold">Outras Formas de Contato</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:contato@agendaki.com" className="text-gray-400 hover:text-white transition-colors">
                        contato@agendaki.com
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Resposta em até 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">WhatsApp</h3>
                      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        (11) 99999-9999
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Seg-Sex, 9h-18h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefone</h3>
                      <a href="tel:+551140004000" className="text-gray-400 hover:text-white transition-colors">
                        (11) 4000-4000
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Seg-Sex, 9h-18h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Endereço</h3>
                      <p className="text-gray-400">
                        São Paulo, SP<br />
                        Brasil
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-4">Perguntas Frequentes</h3>
                <p className="text-gray-300 mb-4">
                  Antes de entrar em contato, veja se sua dúvida já foi respondida em nossa central de ajuda.
                </p>
                <button onClick={() => window.location.href = '/login'} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-medium">
                  Ver Central de Ajuda
                </button>
              </div>
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
