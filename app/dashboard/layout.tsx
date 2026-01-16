"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { 
  Calendar, Users, BarChart3, Settings, LogOut, 
  Home, Briefcase, Scissors, DollarSign, Bell,
  Building2, Crown, UserCog, PackageCheck
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { PlanBadge } from "@/components/PlanBadge"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [businessInfo, setBusinessInfo] = useState<any>(null)

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      fetch('/api/business/info')
        .then(res => res.json())
        .then(data => setBusinessInfo(data))
        .catch(err => console.error('Erro ao buscar info do negócio:', err))
    } else {
      // Se for admin, redireciona para o painel administrativo
      router.push('/admin')
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const isAdmin = session.user?.role === "ADMIN"

  // Se for admin, não renderiza nada (será redirecionado)
  if (isAdmin) {
    return null
  }

  // Menu items para OWNER
  const ownerMenuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Agendamentos", href: "/dashboard/agendamentos" },
    { icon: Calendar, label: "Calendário", href: "/dashboard/calendario" },
    { icon: Users, label: "Clientes", href: "/dashboard/clientes" },
    { icon: UserCog, label: "Profissionais", href: "/dashboard/profissionais" },
    { icon: Scissors, label: "Serviços", href: "/dashboard/servicos" },
    { icon: BarChart3, label: "Relatórios", href: "/dashboard/relatorios" },
    { icon: DollarSign, label: "Assinatura", href: "/dashboard/billing" },
    { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
  ]

  const menuItems = ownerMenuItems

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" style={{animationDuration:"8s"}} />
      
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AGENDAKI</h1>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  {isAdmin ? (
                    <>
                      <Crown className="h-3 w-3" />
                      Admin
                    </>
                  ) : (
                    "Dashboard"
                  )}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{session.user?.name?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                </div>
              </div>
              {!isAdmin && businessInfo?.business && (
                <div className="mt-2">
                  <PlanBadge 
                    plan={businessInfo.business.plan} 
                    planStatus={businessInfo.business.planStatus}
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
