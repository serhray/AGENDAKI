"use client"

import { Calendar, ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react"

export default function PrivacidadePage() {
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
              <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/50 font-semibold">Voltar</button>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-12 w-12 text-indigo-400" />
              <h1 className="text-5xl font-bold">Política de Privacidade</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <p className="text-gray-400 text-lg">
                  Última atualização: 15 de Janeiro de 2026
                </p>
                <p className="text-gray-300 mt-4">
                  O AGENDAKI está comprometido em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Eye className="h-6 w-6 text-indigo-400" />
                    1. Informações que Coletamos
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Informações de Cadastro:</strong> Nome, email, telefone, CPF/CNPJ</li>
                    <li>• <strong>Informações de Uso:</strong> Logs de acesso, páginas visitadas, ações realizadas</li>
                    <li>• <strong>Informações de Agendamentos:</strong> Dados de clientes, horários, serviços</li>
                    <li>• <strong>Informações de Pagamento:</strong> Dados processados via Stripe (não armazenamos cartões)</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-indigo-400" />
                    2. Como Usamos suas Informações
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Fornecer e melhorar nossos serviços</li>
                    <li>• Processar agendamentos e pagamentos</li>
                    <li>• Enviar notificações importantes sobre sua conta</li>
                    <li>• Personalizar sua experiência</li>
                    <li>• Prevenir fraudes e garantir segurança</li>
                    <li>• Cumprir obrigações legais</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Lock className="h-6 w-6 text-indigo-400" />
                    3. Proteção de Dados
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Criptografia:</strong> Todos os dados são criptografados em trânsito (SSL/TLS) e em repouso</li>
                    <li>• <strong>Acesso Restrito:</strong> Apenas funcionários autorizados têm acesso aos dados</li>
                    <li>• <strong>Backups:</strong> Backups automáticos diários para prevenir perda de dados</li>
                    <li>• <strong>Monitoramento:</strong> Sistema de detecção de ameaças 24/7</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">4. Compartilhamento de Dados</h2>
                  <p className="text-gray-300 mb-4">
                    Não vendemos suas informações pessoais. Compartilhamos dados apenas quando necessário:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Provedores de Serviço:</strong> Stripe (pagamentos), Vercel (hospedagem)</li>
                    <li>• <strong>Requisitos Legais:</strong> Quando exigido por lei ou autoridades</li>
                    <li>• <strong>Com seu Consentimento:</strong> Outras situações apenas com sua aprovação explícita</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">5. Seus Direitos (LGPD)</h2>
                  <p className="text-gray-300 mb-4">
                    De acordo com a LGPD, você tem direito a:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Acessar</strong> seus dados pessoais</li>
                    <li>• <strong>Corrigir</strong> dados incompletos ou incorretos</li>
                    <li>• <strong>Solicitar exclusão</strong> de seus dados</li>
                    <li>• <strong>Portabilidade</strong> dos dados para outro serviço</li>
                    <li>• <strong>Revogar consentimento</strong> a qualquer momento</li>
                    <li>• <strong>Informações</strong> sobre o uso e compartilhamento de dados</li>
                  </ul>
                  <p className="text-gray-400 mt-4">
                    Para exercer seus direitos, entre em contato: <a href="mailto:privacidade@agendaki.com" className="text-indigo-400 hover:text-indigo-300">privacidade@agendaki.com</a>
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
                  <p className="text-gray-300">
                    Utilizamos cookies essenciais para autenticação e funcionamento do sistema. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar funcionalidades.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">7. Retenção de Dados</h2>
                  <p className="text-gray-300">
                    Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer serviços. Após cancelamento, dados são retidos por 90 dias para permitir reativação, depois são anonimizados ou excluídos.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">8. Atualizações desta Política</h2>
                  <p className="text-gray-300">
                    Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por email. Recomendamos revisar esta página regularmente.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Contato</h2>
                  <p className="text-gray-300 mb-4">
                    Dúvidas sobre privacidade? Entre em contato:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>📧 Email: <a href="mailto:privacidade@agendaki.com" className="text-indigo-400 hover:text-indigo-300">privacidade@agendaki.com</a></li>
                    <li>📍 São Paulo, SP - Brasil</li>
                  </ul>
                </div>
              </div>
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
