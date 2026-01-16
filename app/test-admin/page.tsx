"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function TestAdminPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const makeAdmin = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: session?.user?.email 
        }),
      })

      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Erro ao fazer requisição" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">
          Teste - Tornar Admin
        </h1>

        {session?.user?.email && (
          <div className="mb-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
            <strong>Email atual:</strong> {session.user.email}
          </div>
        )}

        <button
          onClick={makeAdmin}
          disabled={loading || !session}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processando..." : "Tornar ADMIN"}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-lg ${
            result.error ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
          }`}>
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {result?.success && (
          <div className="mt-4 p-4 bg-blue-500/20 text-blue-300 rounded-lg">
            <p className="text-sm">
              ✅ Sucesso! Agora faça logout e login novamente para acessar o painel admin em <strong>/admin</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
