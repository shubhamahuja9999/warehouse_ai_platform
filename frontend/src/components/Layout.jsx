import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut } from 'lucide-react'

const navItems = [
  { icon: 'dashboard', label: 'Command' },
  { icon: 'bolt', label: 'Alerts' },
  { icon: 'inventory_2', label: 'Assets' },
  { icon: 'settings_suggest', label: 'System' },
]

export default function Layout({ children, activeTab, setActiveTab }) {
  const { showroom, logout } = useAuth()

  return (
    <div className="relative min-h-screen flex flex-col font-display text-slate-100 bg-background-dark overflow-hidden pb-16">
      <div className="fixed inset-0 hologram-grid opacity-40 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="fixed inset-0 grid-overlay opacity-50 pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 flex items-center justify-between p-4 glass-panel border-b border-glass-border">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-ultraviolet rounded-full blur opacity-25 group-hover:opacity-50 transition"></div>
            <div className="relative bg-background-dark border border-glass-border rounded-full p-1">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" 
                alt="User Profile" 
                className="size-10 rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold tracking-tight leading-none">Logistics Command</h1>
            <span className="text-electric-cyan text-[10px] font-bold uppercase tracking-[0.2em]">Operational Level 5</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative glass-panel p-2 rounded-lg text-white hover:bg-white/5 transition">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button className="relative glass-panel p-2 rounded-lg text-white hover:bg-white/5 transition" onClick={logout}>
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 size-2 bg-ultraviolet rounded-full neon-glow-violet"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full h-full flex flex-col gap-6 lg:gap-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-glass-border px-6 pb-6 pt-3">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          {navItems.slice(0, 2).map(({ icon, label }, i) => {
            const isActive = label === activeTab
            return (
              <button key={i} onClick={() => setActiveTab(label)} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-electric-cyan' : 'text-slate-500 hover:text-white'}`}>
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>{icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
              </button>
            )
          })}
          
          <div className="relative -top-8">
            <button className="size-14 rounded-full bg-primary text-white flex items-center justify-center neon-glow-cyan border-4 border-background-dark shadow-xl hover:scale-110 transition active:scale-95">
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          </div>

          {navItems.slice(2).map(({ icon, label }, i) => {
            const isActive = label === activeTab
            return (
              <button key={i} onClick={() => setActiveTab(label)} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-electric-cyan' : 'text-slate-500 hover:text-white'}`}>
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>{icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
