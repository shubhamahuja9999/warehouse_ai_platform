import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../context/DataContext'
import KPICard from '../components/KPICard'
import DataTable from '../components/DataTable'
import BarChartCard from '../components/BarChartCard'

export default function InventoryMap() {
  const { ordersData } = useData()
  const [selectedZone, setSelectedZone] = useState('ALL')

  const zones = ['ALL', 'A', 'B', 'C', 'D']
  const zonePicks = ordersData?.zone_activity?.reduce((sum, zone) => sum + zone.picks, 0) || 0
  const topZone = ordersData?.zone_activity?.sort((a,b) => b.picks - a.picks)[0]

  return (
    <div className="flex-1 w-full space-y-6 pb-24">
      {/* Aegis OS Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20 text-[10px] font-bold uppercase tracking-widest neon-glow-cyan">Aegis OS v4.2</span>
            <span className="text-[10px] text-slate-500 font-mono">NODE_SPATIAL_SYNC: ACTIVE</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tighter text-white uppercase italic flex items-center gap-2">
            Spatial Logistics Map
            <span className="size-2 bg-electric-cyan rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]"></span>
          </h2>
        </div>
        
        <div className="flex bg-background-dark/80 backdrop-blur-xl p-1 rounded-lg border border-white/5 shadow-2xl">
          {zones.map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${selectedZone === zone ? 'bg-electric-cyan text-background-dark shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {ordersData ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Spatial Grid Interface */}
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl border border-glass-border glass-panel overflow-hidden group">
            {/* Background Floorplan */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" 
                alt="Warehouse Grid" 
                className="w-full h-full object-cover grayscale mix-blend-overlay"
              />
            </div>
            
            {/* Scanning Radar Effect */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-0 bottom-0 left-0 w-px bg-electric-cyan/50 shadow-[0_0_15px_#00f2ff] animate-[scan_4s_linear_infinite]"></div>
              <div className="absolute inset-0 hologram-grid opacity-20"></div>
            </div>

            {/* Floating Telemtry Nodes */}
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="glass-panel p-3 rounded-lg border-l-4 border-l-electric-cyan">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Spatial Activity</p>
                  <p className="text-2xl font-bold text-white">{zonePicks.toLocaleString()}</p>
                  <p className="text-[9px] text-electric-cyan font-bold">TELEMETRY_STREAM: NOMINAL</p>
                </div>
                <div className="text-right">
                  <div className="glass-panel p-2 rounded-lg border border-white/10 text-white font-mono text-[10px]">
                    COORD: 40.7128° N, 74.0060° W
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {ordersData.zone_activity?.slice(0, 4).map((z, i) => (
                  <div key={i} className="glass-panel p-3 rounded-lg flex items-center gap-3 border border-white/10 hover:border-electric-cyan/40 transition">
                    <div className="size-8 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center">
                      <span className="text-[10px] font-black">{z.zone}</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">Sector {z.zone}</p>
                      <p className="text-xs font-bold text-white">{z.picks} UNITS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Directives Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="material-symbols-outlined text-electric-cyan">terminal</span>
                <h3 className="text-white text-sm font-bold uppercase tracking-widest italic">Slotting Refactoring Directives</h3>
              </div>
              <DataTable 
                data={ordersData.slotting?.filter(s => selectedZone === 'ALL' || s.recommended_zone === selectedZone)} 
                columns={[
                  { key: 'sku', label: 'SKU' }, 
                  { key: 'picks', label: 'Velocity' }, 
                  { key: 'recommended_zone', label: 'Zone' }
                ]} 
              />
            </div>
            
            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-electric-cyan text-xs font-bold uppercase tracking-[0.2em] mb-4">Neural Suggestion</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Based on current heat signatures, Zone <span className="text-electric-cyan font-bold">{topZone?.zone}</span> is reaching saturation. Initiate inter-sector balancing immediately.
                  </p>
                  <button className="w-full bg-electric-cyan text-background-dark py-3 rounded-lg font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition">
                    Execute Balance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="glass-panel p-20 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-electric-cyan/20">
          <div className="size-20 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 flex items-center justify-center mb-8 neon-glow-cyan animate-pulse">
            <span className="material-symbols-outlined text-electric-cyan text-4xl">satellite_alt</span>
          </div>
          <h2 className="text-white font-black text-xl uppercase italic tracking-tighter">Aegis Radar Offline</h2>
          <p className="text-slate-500 text-xs mt-3 max-w-xs font-medium">Load operational telemetry to initialize the spatial mapping grid and sector analytics.</p>
        </div>
      )}
    </div>
  )
}
