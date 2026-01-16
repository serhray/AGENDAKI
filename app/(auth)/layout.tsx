export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" style={{animationDuration:"8s"}} />
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-900/20 via-transparent to-transparent animate-pulse" style={{animationDuration:"10s"}} />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
        {children}
      </div>
    </div>
  )
}
