"use client"

import { Calendar, FileText } from "lucide-react"

export default function TermosPage() {
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
              <FileText className="h-12 w-12 text-indigo-400" />
              <h1 className="text-5xl font-bold">Termos de Uso</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <p className="text-gray-400 text-lg">
                  Última atualização: 15 de Janeiro de 2026
                </p>
                <p className="text-gray-300 mt-4">
                  Bem-vindo ao AGENDAKI. Ao usar nossa plataforma, você concorda com estes termos. Leia atentamente.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
                  <p className="text-gray-300">
                    Ao se cadastrar e usar o AGENDAKI, você concorda em cumprir estes Termos de Uso. Se não concordar, não utilize a plataforma.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">2. Descrição do Serviço</h2>
                  <p className="text-gray-300 mb-4">
                    O AGENDAKI é uma plataforma SaaS (Software como Serviço) para gestão de agendamentos online. Oferecemos:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Sistema de agendamento online</li>
                    <li>• Gestão de profissionais e serviços</li>
                    <li>• Calendário e relatórios</li>
                    <li>• Notificações automáticas</li>
                    <li>• Página pública de agendamento</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">3. Elegibilidade</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Você deve ter pelo menos 18 anos</li>
                    <li>• Deve fornecer informações verdadeiras e completas</li>
                    <li>• Deve ser pessoa física ou jurídica legalmente constituída</li>
                    <li>• Responsável por manter a segurança de sua conta</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">4. Sua Conta</h2>
                  <p className="text-gray-300 mb-4">
                    <strong>Responsabilidades:</strong>
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Manter sua senha segura e confidencial</li>
                    <li>• Notificar imediatamente sobre uso não autorizado</li>
                    <li>• Ser responsável por todas as atividades em sua conta</li>
                    <li>• Não compartilhar credenciais com terceiros</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">5. Planos e Pagamentos</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Trial:</strong> 14 dias grátis em todos os planos pagos</li>
                    <li>• <strong>Cobrança:</strong> Mensal, processada via Stripe</li>
                    <li>• <strong>Renovação:</strong> Automática, salvo cancelamento</li>
                    <li>• <strong>Cancelamento:</strong> A qualquer momento, sem multa</li>
                    <li>• <strong>Reembolso:</strong> Proporcional aos dias não utilizados</li>
                    <li>• <strong>Atraso:</strong> Pode resultar em suspensão da conta</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">6. Uso Aceitável</h2>
                  <p className="text-gray-300 mb-4">
                    <strong>Você concorda em NÃO:</strong>
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Violar leis ou regulamentos</li>
                    <li>• Usar para atividades ilegais ou fraudulentas</li>
                    <li>• Tentar acessar sistemas não autorizados</li>
                    <li>• Fazer engenharia reversa da plataforma</li>
                    <li>• Enviar spam ou conteúdo malicioso</li>
                    <li>• Sobrecarregar propositalmente nossos servidores</li>
                    <li>• Revender ou redistribuir o serviço sem autorização</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">7. Propriedade Intelectual</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Todo conteúdo da plataforma é protegido por direitos autorais</li>
                    <li>• Você mantém direitos sobre seus dados e conteúdo</li>
                    <li>• Concede-nos licença para operar e melhorar o serviço</li>
                    <li>• Marcas, logos e design são propriedade do AGENDAKI</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">8. Disponibilidade</h2>
                  <p className="text-gray-300 mb-4">
                    Nos esforçamos para manter o serviço disponível 24/7, mas:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Pode haver interrupções para manutenção</li>
                    <li>• Não garantimos 100% de uptime</li>
                    <li>• Notificaremos sobre manutenções programadas</li>
                    <li>• Não nos responsabilizamos por problemas de terceiros (internet, etc)</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">9. Limitação de Responsabilidade</h2>
                  <p className="text-gray-300">
                    O AGENDAKI não se responsabiliza por danos indiretos, lucros cessantes, perda de dados ou outros prejuízos resultantes do uso ou impossibilidade de uso da plataforma. Nossa responsabilidade máxima é limitada ao valor pago nos últimos 12 meses.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">10. Suspensão e Encerramento</h2>
                  <p className="text-gray-300 mb-4">
                    Podemos suspender ou encerrar sua conta se:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Violar estes termos</li>
                    <li>• Usar o serviço de forma fraudulenta</li>
                    <li>• Houver atraso no pagamento</li>
                    <li>• A pedido de autoridades legais</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">11. Modificações</h2>
                  <p className="text-gray-300">
                    Podemos modificar estes termos a qualquer momento. Notificaremos sobre mudanças significativas por email. Uso continuado após alterações constitui aceitação.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">12. Lei Aplicável</h2>
                  <p className="text-gray-300">
                    Estes termos são regidos pelas leis brasileiras. Foro da Comarca de São Paulo, SP.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Contato</h2>
                  <p className="text-gray-300 mb-4">
                    Dúvidas sobre os termos? Entre em contato:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>📧 Email: <a href="mailto:legal@agendaki.com" className="text-indigo-400 hover:text-indigo-300">legal@agendaki.com</a></li>
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
