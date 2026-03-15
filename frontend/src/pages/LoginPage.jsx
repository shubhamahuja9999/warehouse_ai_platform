import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorVisible, setErrorVisible] = useState(false)
  
  const { login, error, loading } = useAuth()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setErrorVisible(false)
    try {
      await login(username, password)
    } catch (err) {
      setErrorVisible(true)
      setTimeout(() => setErrorVisible(false), 5000)
    }
  }, [login, username, password])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 overflow-hidden bg-background-dark font-display text-slate-100" 
      style={{ 
        background: `linear-gradient(rgba(16, 17, 34, 0.8), rgba(16, 17, 34, 0.95)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      
      {/* Background Neural Orbs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div 
           animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-ultra/20 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Top Mini Nav */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button className="flex items-center justify-center size-10 rounded-full glass-panel hover:bg-white/10 transition-colors">
             <span className="material-symbols-outlined text-slate-100">arrow_back</span>
          </button>
          
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
            <div className="size-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#00f2ff]"></div>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-300">System Secure</span>
          </div>
          
          <button className="flex items-center justify-center size-10 rounded-full glass-panel hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-slate-100">help</span>
          </button>
        </div>

        {/* Main Neural Login Panel */}
        <div className="glass-panel rounded-xl p-8 relative overflow-hidden ring-1 ring-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ y: ["-100%", "500%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50 shadow-[0_0_15px_#00f2ff] pointer-events-none z-0" 
          />

          <div className="flex flex-col items-center mb-10 relative z-10">
            <div className="relative mb-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="size-24 rounded-full bg-gradient-to-tr from-primary to-accent-ultra ai-core-glow flex items-center justify-center p-1"
              >
                <div className="size-full rounded-full bg-background-dark flex items-center justify-center overflow-hidden relative">
                  <span className="material-symbols-outlined text-4xl text-accent-electric animate-pulse">hub</span>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                </div>
              </motion.div>
              <div className="absolute -inset-2 border border-primary/20 rounded-full"></div>
              <div className="absolute -inset-4 border border-primary/10 rounded-full"></div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="size-2.5 bg-electric-cyan rounded-full animate-pulse shadow-[0_0_10px_#00f2ff]"></span>
              <span className="text-electric-cyan text-[10px] font-black uppercase tracking-[0.3em] neon-glow-cyan">System Status: Active</span>
            </div>
            <h1 className="text-white text-5xl font-black tracking-tighter uppercase italic leading-[0.9] drop-shadow-2xl">
              Logistics Command Center
            </h1>
            <p className="text-slate-400 text-sm mt-6 font-medium max-w-sm border-l-2 border-white/10 pl-4">
              Authorized access only. High-fidelity neural link required for operational telemetry synchronization.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Error Message */}
            <AnimatePresence>
              {errorVisible && error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium overflow-hidden"
                >
                  <span className="material-symbols-outlined shrink-0 text-red-500">warning</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">Neural Identifier</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">account_circle</span>
                </div>
                <input 
                  type="text"
                  placeholder="north | downtown | east"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background-dark/50 border border-slate-700/50 rounded-lg py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-slate-100 font-mono text-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Access Token</label>
                 <span className="text-[10px] text-slate-500 font-mono">Default: pass123</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input 
                  type="password"
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background-dark/50 border border-slate-700/50 rounded-lg py-4 pl-12 pr-12 focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-600 text-slate-100 font-mono text-sm tracking-widest" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-slate-700 bg-background-dark text-primary focus:ring-primary/50" />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Persist Node</span>
              </label>
              <a href="#" className="text-sm text-accent-cyan hover:text-primary transition-colors hover:underline">Lost sequence?</a>
            </div>

            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden ${loading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {loading ? (
                 <div className="flex gap-2 items-center">
                    <span className="size-2 bg-white rounded-full animate-bounce"></span>
                    <span className="size-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="size-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 </div>
              ) : (
                <>
                  <span className="tracking-wider text-sm">ACTIVATE GRID</span>
                  <span className="material-symbols-outlined">bolt</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Secondary Auth Methods - Decorative */}
          <div className="mt-8 pt-8 border-t border-slate-800/50 relative z-10">
             <div className="flex items-center gap-4">
                 <div className="h-px flex-1 bg-slate-800"></div>
                 <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Secondary Auth</span>
                 <div className="h-px flex-1 bg-slate-800"></div>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-6">
                 <button className="flex items-center justify-center gap-2 glass-panel py-3 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white">
                     <span className="material-symbols-outlined text-sm">shield</span>
                     <span className="text-xs font-medium">HSM Core</span>
                 </button>
                 <button className="flex items-center justify-center gap-2 glass-panel py-3 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white">
                     <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                     <span className="text-xs font-medium">Remote Sync</span>
                 </button>
             </div>
          </div>
        </div>

        {/* Bottom Decorative Logos */}
        <div className="mt-8 flex justify-center gap-10 opacity-40 hover:opacity-100 transition-all duration-700">
             <div className="text-[10px] font-bold tracking-[0.2em] flex flex-col items-center gap-1 text-slate-400 group hover:text-primary transition-colors">
                 <span className="material-symbols-outlined text-lg">token</span>
                 BLOCKCHAIN SECURED
             </div>
             <div className="text-[10px] font-bold tracking-[0.2em] flex flex-col items-center gap-1 text-slate-400 group hover:text-accent-cyan transition-colors">
                 <span className="material-symbols-outlined text-lg">memory</span>
                 QC_READY_01
             </div>
        </div>
      </motion.div>

      {/* Fixed Status Bar overlay */}
      <div className="fixed bottom-6 text-[10px] text-slate-600 font-mono tracking-tighter w-full text-center">
        NODE_7721_STATUS: <span className="text-accent-cyan animate-pulse">STANDBY</span> // LATENCY: 12ms // CORE: STABLE
      </div>
      
    </div>
  )
}
