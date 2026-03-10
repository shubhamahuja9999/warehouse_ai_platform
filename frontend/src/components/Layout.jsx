import { LayoutDashboard, Package, AlertTriangle, RefreshCw, BarChart2, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: BarChart2,       label: 'SKU Analytics' },
  { icon: Package,         label: 'Dead Stock' },
  { icon: RefreshCw,       label: 'Returns' },
  { icon: AlertTriangle,   label: 'Slotting' },
]

export default function Layout({ children }) {
  const { showroom, logout } = useAuth()

  const initials = showroom?.name
    ? showroom.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="flex h-screen bg-[#0a0f1e] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass border-r border-indigo-900/30 flex flex-col pt-6 pb-4 px-4">

        {/* Brand */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Warehouse AI</p>
              <p className="text-indigo-400 text-xs">Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Showroom badge */}
        {showroom && (
          <div className="mb-6 mx-1 bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-3 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{showroom.name}</p>
                <p className="text-indigo-400 text-xs">@{showroom.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                i === 0
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
              }`}
            >
              <Icon size={16} className={i === 0 ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom — API status + Logout */}
        <div className="mt-auto space-y-2 px-1">
          <div className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 px-3 py-2.5">
            <p className="text-indigo-300 text-xs font-semibold mb-1">Backend API</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 text-xs">localhost:8000</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400
              hover:bg-rose-500/10 transition-all duration-200 group border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={16} className="group-hover:text-rose-400 transition-colors" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
