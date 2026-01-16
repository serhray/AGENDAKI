"use client"

import { Calendar, Shield, Lock, Eye, Server, AlertTriangle, CheckCircle2, Key } from "lucide-react"

export default function SegurancaPage() {
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
              <h1 className="text-5xl font-bold">Segurança</h1>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <p className="text-gray-300 text-lg">
                  A segurança dos seus dados é nossa prioridade máxima. Implementamos múltiplas camadas de proteção para garantir que suas informações estejam sempre seguras.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Lock className="h-8 w-8 text-indigo-400" />
                    Certificações e Conformidades
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'LGPD', desc: 'Lei Geral de Proteção de Dados (Brasil)' },
                      { name: 'SSL/TLS', desc: 'Criptografia de ponta a ponta' },
                      { name: 'PCI DSS', desc: 'Pagamentos seguros via Stripe' },
                      { name: 'ISO 27001', desc: 'Padrões de segurança da informação' }
                    ].map((cert, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold">{cert.name}</h3>
                          <p className="text-sm text-gray-400">{cert.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Lock className="h-6 w-6 text-indigo-400" />
                    Criptografia
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">🔐 Em Trânsito (TLS 1.3)</h3>
                      <p className="text-gray-300">Todas as comunicações entre seu navegador e nossos servidores são criptografadas com TLS 1.3, o padrão mais moderno e seguro.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">🔒 Em Repouso (AES-256)</h3>
                      <p className="text-gray-300">Dados armazenados são criptografados com AES-256, o mesmo padrão usado por bancos e governos.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">🔑 Senhas (Bcrypt)</h3>
                      <p className="text-gray-300">Senhas são hasheadas com bcrypt e salting, impossibilitando recuperação mesmo em caso de vazamento.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Key className="h-6 w-6 text-indigo-400" />
                    Autenticação e Acesso
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Autenticação Robusta:</strong> Senhas fortes obrigatórias (mín. 8 caracteres)</li>
                    <li>• <strong>Sessões Seguras:</strong> Tokens JWT com expiração automática</li>
                    <li>• <strong>Controle de Acesso:</strong> Sistema de permissões baseado em roles (ADMIN, OWNER)</li>
                    <li>• <strong>Logout Automático:</strong> Após 30 dias de inatividade</li>
                    <li>• <strong>Detecção de Anomalias:</strong> Alertas de login suspeito</li>
                    <li>• <strong>Limitação de Tentativas:</strong> Proteção contra força bruta</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Server className="h-6 w-6 text-indigo-400" />
                    Infraestrutura
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-2">🌐 Vercel Edge Network</h3>
                      <p className="text-gray-300">Hospedagem em infraestrutura de nível empresarial com 99.99% de SLA</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">💾 PostgreSQL com Prisma Accelerate</h3>
                      <p className="text-gray-300">Banco de dados com conexão pooling, cache inteligente e replicação automática</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">🛡️ Firewall e DDoS Protection</h3>
                      <p className="text-gray-300">Proteção multicamadas contra ataques DDoS e acessos não autorizados</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">📍 Geolocalização</h3>
                      <p className="text-gray-300">Servidores distribuídos globalmente para baixa latência e alta disponibilidade</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Eye className="h-6 w-6 text-indigo-400" />
                    Monitoramento e Auditoria
                  </h2>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Monitoramento 24/7:</strong> Equipe de segurança monitora ameaças constantemente</li>
                    <li>• <strong>Logs Detalhados:</strong> Registro de todas as ações críticas no sistema</li>
                    <li>• <strong>Alertas em Tempo Real:</strong> Notificação imediata de atividades suspeitas</li>
                    <li>• <strong>Auditoria Regular:</strong> Revisões periódicas de segurança e código</li>
                    <li>• <strong>Testes de Penetração:</strong> Simulações de ataques para identificar vulnerabilidades</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Backup e Recuperação</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Backups Automáticos Diários</h3>
                        <p className="text-sm text-gray-400">Backup completo do banco de dados todo dia às 3h (horário de Brasília)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Retenção de 30 Dias</h3>
                        <p className="text-sm text-gray-400">Mantemos backups dos últimos 30 dias para recuperação de dados</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Recuperação Rápida</h3>
                        <p className="text-sm text-gray-400">RTO (Recovery Time Objective) de 4 horas em caso de falhas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Replicação Geográfica</h3>
                        <p className="text-sm text-gray-400">Backups armazenados em múltiplas regiões geográficas</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Pagamentos Seguros</h2>
                  <p className="text-gray-300 mb-4">
                    Processamos pagamentos exclusivamente através do <strong>Stripe</strong>, líder global em segurança de pagamentos:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>PCI DSS Level 1:</strong> Máximo nível de certificação da indústria de cartões</li>
                    <li>• <strong>Não Armazenamos Cartões:</strong> Dados de pagamento ficam apenas no Stripe</li>
                    <li>• <strong>3D Secure:</strong> Autenticação adicional para maior segurança</li>
                    <li>• <strong>Detecção de Fraude:</strong> Machine learning identifica transações suspeitas</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    Resposta a Incidentes
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Em caso de incidente de segurança:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Detecção Imediata:</strong> Sistemas automatizados detectam anomalias</li>
                    <li>• <strong>Contenção Rápida:</strong> Isolamento imediato de sistemas afetados</li>
                    <li>• <strong>Investigação:</strong> Análise forense para identificar causa raiz</li>
                    <li>• <strong>Notificação:</strong> Clientes afetados notificados em até 72h</li>
                    <li>• <strong>Remediação:</strong> Correção de vulnerabilidades e fortalecimento</li>
                    <li>• <strong>Transparência:</strong> Relatório público sobre o incidente</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Boas Práticas Recomendadas</h2>
                  <p className="text-gray-300 mb-4">
                    Você também pode contribuir para segurança da sua conta:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li>✓ Use senhas fortes e únicas (mínimo 12 caracteres)</li>
                    <li>✓ Não compartilhe suas credenciais</li>
                    <li>✓ Faça logout em dispositivos compartilhados</li>
                    <li>✓ Mantenha seu email de recuperação atualizado</li>
                    <li>✓ Revise regularmente os acessos à sua conta</li>
                    <li>✓ Reporte atividades suspeitas imediatamente</li>
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Programa de Bug Bounty</h2>
                  <p className="text-gray-300 mb-4">
                    Pesquisadores de segurança são bem-vindos para reportar vulnerabilidades:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>📧 Email: <a href="mailto:security@agendaki.com" className="text-indigo-400 hover:text-indigo-300">security@agendaki.com</a></li>
                    <li>⚡ Resposta em até 24 horas</li>
                    <li>🏆 Reconhecimento público (com permissão)</li>
                  </ul>
                  <p className="text-sm text-gray-400 mt-4">
                    Por favor, reporte de forma responsável e dê-nos tempo para corrigir antes de divulgar publicamente.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Perguntas sobre Segurança?</h2>
                  <p className="text-gray-300 mb-4">
                    Nossa equipe de segurança está disponível para esclarecer dúvidas:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>📧 Email: <a href="mailto:security@agendaki.com" className="text-indigo-400 hover:text-indigo-300">security@agendaki.com</a></li>
                    <li>🔒 Relatórios de vulnerabilidade: <a href="mailto:security@agendaki.com" className="text-indigo-400 hover:text-indigo-300">security@agendaki.com</a></li>
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
