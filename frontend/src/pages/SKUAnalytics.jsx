import { useData } from '../context/DataContext'
import { motion } from 'framer-motion'

export default function SKUAnalytics() {
  const { ordersData } = useData()

  return (
    <div className="flex-1 w-full space-y-6 pb-24">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-1 border-l-4 border-l-accent-cyan glow-cyan relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <span className="material-symbols-outlined text-3xl text-accent-cyan">shield</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">System Integrity</p>
          <p className="text-2xl font-bold text-slate-100">{ordersData ? '98.4%' : '0.0%'}</p>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-emerald-400 text-[10px]">trending_up</span>
            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-tighter">+0.2% vs last cycle</p>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex flex-col gap-1 border-l-4 border-l-ultraviolet glow-violet relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <span className="material-symbols-outlined text-3xl text-ultraviolet">data_exploration</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Queue Depth</p>
          <p className="text-2xl font-bold text-slate-100">12ms</p>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-rose-400 text-[10px]">trending_down</span>
            <p className="text-rose-400 text-[10px] font-bold uppercase tracking-tighter">-5.2% latency</p>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 flex flex-col gap-1 border-l-4 border-l-slate-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <span className="material-symbols-outlined text-3xl text-slate-400">visibility</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Operational Mask</p>
          <p className="text-2xl font-bold text-slate-100 uppercase tracking-tight">{ordersData ? 'Active' : 'Standby'}</p>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Monitoring Sectors 1-14</p>
        </div>
      </div>

      {/* Feed Section */}
      <main className="space-y-6">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-white text-base font-bold tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-cyan text-xl">query_stats</span>
            Intelligence Alerts
          </h2>
          <button className="text-accent-cyan text-[11px] font-bold hover:text-white transition uppercase tracking-widest">Archive History</button>
        </div>

        <div className="space-y-3">
          {ordersData ? (
            <>
              {/* Critical Alert */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-xl overflow-hidden relative border-l-4 border-l-ultraviolet group hover:bg-white/5 transition duration-300"
              >
                <div className="flex">
                  <div className="w-32 shrink-0 bg-center bg-cover relative hidden sm:block" 
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200')` }}>
                    <div className="absolute inset-0 bg-ultraviolet/20 mix-blend-overlay"></div>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-ultraviolet/20 text-ultraviolet text-[9px] px-2 py-0.5 rounded font-bold uppercase ring-1 ring-ultraviolet/30">Critical Alert</span>
                      <span className="text-[10px] text-slate-500 font-mono">2m ago</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">Throughput Peak: {ordersData.sku_frequency[0]?.sku}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Neural networks identify high demand for {ordersData.sku_frequency[0]?.sku}. Prepare replenishment queues immediately.</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-accent-cyan font-bold uppercase">
                        <span className="size-1.5 bg-accent-cyan rounded-full animate-pulse"></span>
                        Recalibration Active
                      </div>
                      <button className="text-ultraviolet text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Details
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Optimization Alert */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-xl p-4 border-l-4 border-l-accent-cyan group hover:bg-white/5 transition duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-accent-cyan/20 text-accent-cyan text-[9px] px-2 py-0.5 rounded font-bold uppercase ring-1 ring-accent-cyan/30">System Optimization</span>
                  <span className="text-[10px] text-slate-500 font-mono">14m ago</span>
                </div>
                <div className="flex gap-4">
                  <div className="size-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0 text-accent-cyan">
                    <span className="material-symbols-outlined text-xl">sync_alt</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white">Network Sync Stability</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 italic truncate">"Pathfinding efficiency increased by 22% for all distribution nodes."</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-bold text-sm">8.4k p/h</p>
                    <span className="text-[9px] text-accent-cyan font-bold">+18.4%</span>
                  </div>
                </div>
              </motion.div>

              {/* Success Alert */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-xl p-4 border-l-4 border-l-emerald-500 group hover:bg-white/5 transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-bold text-white">Asset Bottleneck Resolved</h4>
                      <span className="text-[10px] text-slate-500 font-mono">42m ago</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Global distribution node sequences synchronized via AI override.</p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="glass-panel rounded-xl p-20 flex flex-col items-center justify-center text-center border-dashed border-accent-cyan/20">
              <div className="size-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl text-accent-cyan animate-pulse">broadcast_on_home</span>
              </div>
              <p className="font-bold text-white tracking-widest uppercase italic">Awaiting Subspace Feed</p>
              <p className="text-xs text-slate-500 mt-2 max-w-[240px]">Initialize the core databanks to stream real-time intelligence telemetry.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
