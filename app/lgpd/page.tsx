"use client"

import { Calendar, Shield, CheckCircle2, Lock, Eye, FileText, UserCheck } from "lucide-react"

export default function LGPDPage() {
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
              <Shield className="h-12 w-12 text-green-400" />
              <h1 className="text-5xl font-bold">Conformidade LGPD</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <p className="text-gray-400 text-lg">
                  Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
                </p>
                <p className="text-gray-300 mt-4">
                  O AGENDAKI está em total conformidade com a LGPD brasileira. Levamos a sério a proteção dos seus dados pessoais.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                    Compromissos LGPD
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'Transparência total no uso de dados',
                      'Consentimento explícito para coleta',
                      'Direito de acesso aos seus dados',
                      'Correção de dados incorretos',
                      'Exclusão de dados a qualquer momento',
                      'Portabilidade de dados',
                      'Segurança e criptografia',
                      'DPO (Encarregado) dedicado'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Eye className="h-6 w-6 text-indigo-400" />
                    Princípios que Seguimos
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">1. Finalidade</h3>
                      <p className="text-gray-300">Coletamos dados apenas para propósitos específicos e legítimos relacionados ao serviço de agendamento.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">2. Adequação</h3>
                      <p className="text-gray-300">Tratamento de dados compatível com a finalidade informada ao titular.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">3. Necessidade</h3>
                      <p className="text-gray-300">Coletamos apenas dados estritamente necessários para fornecer o serviço.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">4. Transparência</h3>
                      <p className="text-gray-300">Informações claras e acessíveis sobre o tratamento de dados.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">5. Segurança</h3>
                      <p className="text-gray-300">Medidas técnicas e administrativas para proteger dados de acessos não autorizados.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <UserCheck className="h-6 w-6 text-indigo-400" />
                    Seus Direitos como Titular
                  </h2>
                  <p className="text-gray-300 mb-6">
                    De acordo com a LGPD, você tem total controle sobre seus dados:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-2">✓ Confirmação e Acesso</h3>
                      <p className="text-sm text-gray-400">Saber se tratamos seus dados e acessá-los</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-2">✓ Correção</h3>
                      <p className="text-sm text-gray-400">Corrigir dados incompletos, inexatos ou desatualizados</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-2">✓ Anonimização, Bloqueio ou Eliminação</h3>
                      <p className="text-sm text-gray-400">De dados desnecessários, excessivos ou tratados em desconformidade</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-2">✓ Portabilidade</h3>
                      <p className="text-sm text-gray-400">Receber seus dados em formato estruturado e legível</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-2">✓ Eliminação</h3>
                      <p className="text-sm text-gray-400">Excluir dados tratados com base no consentimento</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-2">✓ Informação sobre Compartilhamento</h3>
                      <p className="text-sm text-gray-400">Saber com quem compartilhamos seus dados</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold mb-2">✓ Revogação de Consentimento</h3>
                      <p className="text-sm text-gray-400">Retirar consentimento a qualquer momento</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Lock className="h-6 w-6 text-indigo-400" />
                    Bases Legais para Tratamento
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Tratamos seus dados com base em:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Consentimento:</strong> Quando você autoriza expressamente</li>
                    <li>• <strong>Execução de Contrato:</strong> Para fornecer o serviço contratado</li>
                    <li>• <strong>Obrigação Legal:</strong> Quando exigido por lei</li>
                    <li>• <strong>Legítimo Interesse:</strong> Para melhorias do serviço</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-indigo-400" />
                    Compartilhamento de Dados
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Seus dados podem ser compartilhados apenas com:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Operadores:</strong> Provedores que nos ajudam a fornecer o serviço (Stripe, Vercel)</li>
                    <li>• <strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
                    <li>• <strong>Terceiros com Consentimento:</strong> Apenas com sua autorização expressa</li>
                  </ul>
                  <p className="text-sm text-gray-400 mt-4">
                    Todos os operadores são cuidadosamente selecionados e seguem rigorosos padrões de segurança.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Retenção de Dados</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Conta Ativa:</strong> Durante toda vigência do contrato</li>
                    <li>• <strong>Após Cancelamento:</strong> 90 dias para possível reativação</li>
                    <li>• <strong>Dados Fiscais:</strong> 5 anos (conforme legislação tributária)</li>
                    <li>• <strong>Logs de Segurança:</strong> 6 meses</li>
                    <li>• <strong>Dados Anonimizados:</strong> Podem ser mantidos indefinidamente</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Medidas de Segurança</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-bold mb-2">🔒 Técnicas</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Criptografia SSL/TLS</li>
                        <li>• Criptografia em repouso</li>
                        <li>• Firewall avançado</li>
                        <li>• Backups automáticos</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="font-bold mb-2">👥 Administrativas</h3>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Acesso restrito</li>
                        <li>• Treinamento LGPD</li>
                        <li>• Política de segurança</li>
                        <li>• Auditoria regular</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Transferência Internacional</h2>
                  <p className="text-gray-300">
                    Alguns dados podem ser processados em servidores fora do Brasil (ex: Stripe nos EUA). Garantimos que todos os operadores internacionais seguem padrões equivalentes ou superiores à LGPD, com cláusulas contratuais adequadas.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Encarregado de Dados (DPO)</h2>
                  <p className="text-gray-300 mb-4">
                    Para exercer seus direitos ou esclarecer dúvidas sobre tratamento de dados:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>📧 Email: <a href="mailto:dpo@agendaki.com" className="text-indigo-400 hover:text-indigo-300">dpo@agendaki.com</a></li>
                    <li>📧 Alternativo: <a href="mailto:lgpd@agendaki.com" className="text-indigo-400 hover:text-indigo-300">lgpd@agendaki.com</a></li>
                    <li>⏱️ Prazo de resposta: até 15 dias úteis</li>
                  </ul>
                  <p className="text-sm text-gray-400 mt-4">
                    Você também pode registrar reclamações na ANPD (Autoridade Nacional de Proteção de Dados).
                  </p>
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
