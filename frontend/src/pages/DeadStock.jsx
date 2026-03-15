import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import DataTable from '../components/DataTable'
import KPICard from '../components/KPICard'

export default function SystemHub() {
  const { inventoryData, ordersData, showroom } = useData()

  const totalDeadStockValue = inventoryData?.dead_stock?.reduce((sum, item) => sum + item.stock, 0) || 0
  const oldestItem = inventoryData?.dead_stock?.sort((a, b) => b.days_since_sale - a.days_since_sale)[0]

  return (
    <div className="flex-1 w-full space-y-6 pb-24">
      {/* System Calibration Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-ultraviolet/10 text-ultraviolet border border-ultraviolet/20 text-[10px] font-bold uppercase tracking-widest neon-glow-violet">Calibration Mode</span>
            <span className="text-[10px] text-slate-500 font-mono">SYS_CORE: OPTIMAL</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tighter text-white uppercase italic flex items-center gap-2">
            System Calibration
            <span className="material-symbols-outlined text-ultraviolet animate-spin-slow">settings</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="glass-panel px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white border border-white/5 transition">
            Export Logs
          </button>
          <button className="bg-ultraviolet text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl neon-glow-violet hover:scale-105 transition active:scale-95">
            Synchronize Core
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Neural Status */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <span className="material-symbols-outlined text-5xl text-electric-cyan">neurology</span>
            </div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="size-2 bg-electric-cyan rounded-full animate-pulse"></span>
              Neural Memory Banks
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span className="text-slate-400">Logic Integrity</span>
                  <span className="text-electric-cyan">94%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-electric-cyan neon-glow-cyan"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span className="text-slate-400">Pathfinding Cache</span>
                  <span className="text-ultraviolet">82%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-ultraviolet neon-glow-violet"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span className="text-slate-400">I/O Throughput</span>
                  <span className="text-emerald-400">100%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-4">Node Connectivity</h3>
            <div className="space-y-3">
              <StatusNode name="Global Command" status="Connected" />
              <StatusNode name="Local Ledger" status={inventoryData ? 'Syncing' : 'Offline'} />
              <StatusNode name="Neural Gateway" status="Active" />
            </div>
          </div>
        </div>

        {/* Right Column: Ledger Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {inventoryData ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-rose-500 glow-rose">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Immobilized Capital</p>
                  <p className="text-3xl font-bold text-white tracking-tighter">{totalDeadStockValue?.toLocaleString()}</p>
                  <p className="text-[10px] text-rose-500 font-bold uppercase mt-2 italic">Alert: Sub-optimal footprint velocity</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Oldest Asset Link</p>
                  <p className="text-3xl font-bold text-white tracking-tighter">{oldestItem?.days_since_sale}d</p>
                  <p className="text-[10px] text-orange-400 font-bold uppercase mt-2">SKU: {oldestItem?.sku}</p>
                </div>
              </div>

              <DataTable 
                title="Immobilized Capital Ledger" 
                data={inventoryData.dead_stock} 
                columns={[
                  { key: 'sku', label: 'SKU Code' }, 
                  { key: 'stock', label: 'Units Locked' },
                  { key: 'days_since_sale', label: 'Aging (Days)' }
                ]} 
              />
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] glass-panel rounded-2xl flex flex-col items-center justify-center text-center p-12 border-dashed border-white/10">
              <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-slate-500 text-3xl">database_off</span>
              </div>
              <h2 className="text-white font-black text-lg uppercase italic">Capital Ledger Offline</h2>
              <p className="text-slate-500 text-xs mt-2 max-w-xs">Analysis required: Upload inventory telemetry to calculate immobilized capital and aging bottlenecks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusNode({ name, status }) {
  const isActive = status === 'Connected' || status === 'Active' || status === 'Syncing'
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/20 transition">
      <div className="flex items-center gap-3">
        <div className={`size-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}></div>
        <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tighter">{name}</span>
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
        {status}
      </span>
    </div>
  )
}
