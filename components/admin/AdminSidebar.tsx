"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  Users, 
  Settings,
  ChevronLeft,
  Crown,
  LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Building2, label: "Negócios", href: "/admin/businesses" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Users, label: "Usuários", href: "/admin/users" },
    { icon: Settings, label: "Configurações", href: "/admin/settings" },
  ]

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-black/20 backdrop-blur-sm border-r border-white/10 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Admin</h1>
              <p className="text-xs text-gray-400">Painel de Controle</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <ChevronLeft
            className={`h-5 w-5 text-gray-400 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>
    </aside>
  )
}
