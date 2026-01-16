"use client"

import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, Building2, LogOut, Crown, Sparkles
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null
  }

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Building2, label: "Negócios", href: "/admin/businesses" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-gray-900/80 via-purple-900/30 to-gray-900/80 backdrop-blur-xl border-r border-purple-500/20 flex flex-col shadow-2xl">
          {/* Logo */}
          <div className="p-6 border-b border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-purple-500/10 animate-pulse"></div>
            <Link href="/admin" className="relative flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-pulse">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  Admin Panel
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </h1>
                <p className="text-xs text-purple-300 font-medium">AGENDAKI SYSTEM</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white shadow-lg shadow-yellow-500/50"
                      : "text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border hover:border-purple-500/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? "" : "group-hover:scale-110"
                  }`} />
                  <span className="font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-purple-500/20 bg-gradient-to-b from-purple-500/10 to-transparent">
            <div className="flex items-center gap-3 mb-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {session.user?.name?.[0] || session.user?.email?.[0] || "A"}
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white text-sm font-bold truncate flex items-center gap-1">
                  {session.user?.name || "Admin"}
                  <Crown className="h-3 w-3 text-yellow-400" />
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all border border-red-500/30 hover:border-red-500/50 group"
            >
              <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
