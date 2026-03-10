import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Package, Eye, EyeOff, LogIn, Loader2, AlertCircle } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { showroom: 'Downtown Showroom', username: 'downtown' },
  { showroom: 'North Wing',        username: 'north'    },
  { showroom: 'East Branch',       username: 'east'     },
]

export default function LoginPage() {
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username.trim(), password)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (uname) => {
    setUsername(uname)
    setPassword('pass123')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Logo + tagline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/30 mb-4">
            <Package size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Warehouse AI</h1>
          <p className="text-slate-400 text-sm mt-1">Intelligence Platform — Showroom Login</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
          <h2 className="text-lg font-bold text-white mb-6">Sign in to your showroom</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. downtown"
                required
                autoFocus
                className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500
                  focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-slate-500
                    focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-rose-400 flex-shrink-0" />
                <p className="text-rose-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
                text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2
                transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                shadow-lg shadow-indigo-500/25 mt-2"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                : <><LogIn size={16} /> Sign In</>
              }
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-slate-700/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Demo Showrooms</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(({ showroom, username: u }) => (
                <button
                  key={u}
                  onClick={() => fillDemo(u)}
                  className="text-xs bg-slate-800/60 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/30
                    rounded-xl px-2 py-2.5 text-slate-400 hover:text-indigo-300 transition-all duration-200 text-center leading-tight"
                >
                  {showroom}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-600 mt-2 text-center">All demo accounts use password: <span className="text-slate-500 font-mono">pass123</span></p>
          </div>
        </div>

      </div>
    </div>
  )
}
