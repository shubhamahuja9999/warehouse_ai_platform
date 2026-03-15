import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Clock } from 'lucide-react'

import FileUploader from '../components/FileUploader'
import KPICard from '../components/KPICard'
import BarChartCard from '../components/BarChartCard'
import DataTable from '../components/DataTable'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const STORAGE_KEY = 'warehouse_data'

export default function Dashboard() {
  const { showroom } = useAuth()
  const { 
    ordersFile, inventoryFile, returnsFile,
    ordersData, inventoryData, returnsData,
    lastUploaded, loading: loadingStatus, error,
    setOrdersData, setInventoryData, setReturnsData,
    setOrdersFile, setInventoryFile, setReturnsFile,
    setLoad, setErr, setLastUploaded, clearAllData
  } = useData()

  const [initLoading, setInitLoading] = useState(true)

  useEffect(() => {
    setInitLoading(false)
  }, [showroom?.id])

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target.result
          const lines = text.split('\n').filter(l => l.trim())
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
          const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
            return headers.reduce((obj, header, i) => { obj[header] = values[i]; return obj }, {})
          })
          resolve(data)
        } catch (err) { reject(err) }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const analyzeOrders = async (data) => {
    const skuCounts = {}
    const skuZones = {}
    data.forEach(row => {
      const sku = row.sku || row.SKU || row.product_id || row.ProductID
      const qty = parseInt(row.quantity || row.qty || row.Quantity || 1)
      const zone = row.zone || row.Zone || row.location || 'A'
      if (sku) {
        skuCounts[sku] = (skuCounts[sku] || 0) + qty
        skuZones[sku] = zone
      }
    })
    const skuFreq = Object.entries(skuCounts).map(([sku, orders]) => ({ sku, orders })).sort((a, b) => b.orders - a.orders)
    const zoneActivity = {}
    Object.entries(skuZones).forEach(([sku, zone]) => {
      zoneActivity[zone] = (zoneActivity[zone] || 0) + (skuCounts[sku] || 0)
    })
    return {
      sku_frequency: skuFreq.slice(0, 20),
      slotting: skuFreq.slice(0, 20).map((s, i) => ({ sku: s.sku, picks: s.orders, recommended_zone: ['A', 'B', 'C', 'D'][i % 4] })),
      total_orders: data.length,
      total_picks: Object.values(skuCounts).reduce((a, b) => a + b, 0),
      unique_skus: Object.keys(skuCounts).length,
      zone_activity: Object.entries(zoneActivity).map(([zone, picks]) => ({ zone, picks }))
    }
  }

  const analyzeInventory = async (data) => {
    const dead = data.filter(row => {
      const days = parseInt(row.days_since_sale || row.DaysSinceSale || row.last_sale_days || 0)
      return days > 90
    })
    return {
      inventory: data.slice(0, 50).map(row => ({
        sku: row.sku || row.SKU || row.product_id,
        stock: parseInt(row.stock || row.Stock || row.quantity || 0),
        zone: row.zone || row.Zone || 'A'
      })),
      dead_stock: dead.slice(0, 50).map(row => ({
        sku: row.sku || row.SKU || row.product_id,
        stock: parseInt(row.stock || row.Stock || row.quantity || 0),
        days_since_sale: parseInt(row.days_since_sale || row.DaysSinceSale || 0)
      })),
      dead_stock_count: dead.length,
      total_skus: data.length
    }
  }

  const handleOrders = async (file) => {
    setOrdersFile(file)
    setLoad('orders', true)
    setErr('orders', null)
    try {
      const data = await parseCSV(file)
      const result = await analyzeOrders(data)
      setOrdersData(result)
      setLastUploaded(p => ({ ...p, orders: new Date().toISOString() }))
    } catch (e) {
      setErr('orders', 'Failed to analyze orders')
    } finally {
      setLoad('orders', false)
    }
  }

  const handleInventory = async (file) => {
    setInventoryFile(file)
    setLoad('inventory', true)
    setErr('inventory', null)
    try {
      const data = await parseCSV(file)
      const result = await analyzeInventory(data)
      setInventoryData(result)
      setLastUploaded(p => ({ ...p, inventory: new Date().toISOString() }))
    } catch (e) {
      setErr('inventory', 'Failed to analyze inventory')
    } finally {
      setLoad('inventory', false)
    }
  }

  const handleReturns = async (file) => {
    setReturnsFile(file)
    setLoad('returns', true)
    setErr('returns', null)
    try {
      const data = await parseCSV(file)
      setReturnsData({ returns: data.slice(0, 20).map(row => ({
        sku: row.sku || row.SKU,
        reason: row.reason || 'Unknown Anomaly',
        date: row.date || 'Today'
      }))})
      setLastUploaded(p => ({ ...p, returns: new Date().toISOString() }))
    } catch (e) {
      setErr('returns', 'Failed to analyze returns')
    } finally {
      setLoad('returns', false)
    }
  }

  const Spinner = () => (
    <div className="flex items-center gap-2 text-electric-cyan text-[10px] font-bold uppercase tracking-widest mt-2">
      <Loader2 size={12} className="animate-spin" />
      <span>Calibrating...</span>
    </div>
  )

  const ErrorBadge = ({ msg }) => msg ? (
    <p className="text-rose-400 text-xs mt-2 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">{msg}</p>
  ) : null

  const UploadedAt = ({ ts }) => ts ? (
    <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-[10px] font-bold uppercase">
      <Clock size={11} />
      <span>Node Sync: {new Date(ts).toLocaleTimeString()}</span>
    </div>
  ) : null

  const isGlobalLoading = loadingStatus?.orders || loadingStatus?.inventory || loadingStatus?.returns

  if (initLoading || isGlobalLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-2xl border border-white/5 min-h-[400px]">
        <Loader2 className="w-12 h-12 text-electric-cyan animate-spin mb-6 drop-shadow-[0_0_10px_#00f2ff]" />
        <h2 className="text-xl font-black text-white uppercase tracking-widest italic neon-glow-cyan">Synchronizing Core...</h2>
        <p className="text-slate-500 text-[10px] mt-3 font-mono">NODE_INDEX_SYNC & DATA_INTEGRITY_CHECK [ACTIVE]</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Hero */}
      <section className="w-full">
        <div className="relative overflow-hidden rounded-2xl border border-glass-border glass-panel group min-h-[250px] flex flex-col justify-end p-8">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1573167243171-240024620021?auto=format&fit=crop&q=80&w=1600" 
              alt="Logistic Command" 
              className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-40 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
            <div className="absolute inset-0 hologram-grid opacity-20"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="size-2.5 bg-electric-cyan rounded-full animate-pulse shadow-[0_0_10px_#00f2ff]"></span>
              <span className="text-electric-cyan text-[10px] font-black uppercase tracking-[0.3em] neon-glow-cyan">Logistics Network Status: Active</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase italic drop-shadow-2xl">
              Global Fleet Command
            </h2>
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex flex-col">
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Asset Throughput</span>
                <span className="text-white text-xl font-bold">{ordersData?.total_picks?.toLocaleString() || "---"}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-6">
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Active Nodes</span>
                <span className="text-white text-xl font-bold">{ordersData?.zone_activity?.length || "---"}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-6">
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Operational Level</span>
                <span className="text-emerald-400 text-xl font-bold uppercase tracking-widest italic">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSV Uploader Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative group hover:border-electric-cyan/30 transition">
          <FileUploader label="Link Orders" onFile={handleOrders} fileName={ordersFile?.name} />
          {loadingStatus.orders && <Spinner />}
          <ErrorBadge msg={error.orders} />
          <UploadedAt ts={lastUploaded.orders} />
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative group hover:border-electric-cyan/30 transition">
          <FileUploader label="Sync Inventory" onFile={handleInventory} fileName={inventoryFile?.name} />
          {loadingStatus.inventory && <Spinner />}
          <ErrorBadge msg={error.inventory} />
          <UploadedAt ts={lastUploaded.inventory} />
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative group hover:border-electric-cyan/30 transition">
          <FileUploader label="Feed Returns" onFile={handleReturns} fileName={returnsFile?.name} />
          {loadingStatus.returns && <Spinner />}
          <ErrorBadge msg={error.returns} />
          <UploadedAt ts={lastUploaded.returns} />
        </div>
      </section>

      {/* Data Visuals Area */}
      {(!ordersData && !inventoryData && !returnsData) ? (
        <div className="glass-panel p-20 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-white/10 mt-6">
          <div className="size-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-slate-500 text-4xl">cloud_off</span>
          </div>
          <h2 className="text-white font-black text-xl uppercase italic tracking-tighter">System Interface Offline</h2>
          <p className="text-slate-500 text-xs mt-3 max-w-xs font-medium">Link operational telemetry to initialize the command center and calibrate the global grid.</p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="space-y-8">
               <div className="flex items-center gap-3 px-2">
                 <span className="material-symbols-outlined text-electric-cyan">terminal</span>
                 <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] italic">Telemetry Overview</h3>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {ordersData?.zone_activity?.slice(0, 4).map((z, i) => (
                   <KPICard 
                     key={i}
                     title={`Sector ${z.zone}`} 
                     value={z.picks.toLocaleString()} 
                     subtitle="Volume" 
                     icon="hub" 
                     color={i % 2 === 0 ? 'cyan' : 'violet'} 
                   />
                 ))}
               </div>

               <DataTable 
                 title="Anomaly Log (Returns)" 
                 data={returnsData?.returns || []} 
                 columns={[
                   { key: 'sku', label: 'SKU' }, 
                   { key: 'reason', label: 'Anomaly' }, 
                   { key: 'date', label: 'Timestamp' }
                 ]} 
               />
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-3 px-2">
                 <span className="material-symbols-outlined text-ultraviolet">dynamic_form</span>
                 <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] italic">Distribution Graph</h3>
               </div>
               
               <BarChartCard 
                 title="Sector Distribution" 
                 data={ordersData?.zone_activity || []} 
                 xKey="zone" 
                 yKey="picks" 
               />

               <DataTable 
                 title="Live Operational Ledger" 
                 data={inventoryData?.inventory || []} 
                 columns={[
                   { key: 'sku', label: 'SKU' }, 
                   { key: 'stock', label: 'Volume' }, 
                   { key: 'zone', label: 'Sector' }
                 ]} 
               />
               <button className="text-primary text-[10px] font-black hover:text-white transition uppercase tracking-[0.3em] w-full text-right" onClick={clearAllData}>
                 Force Core Reset
               </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

const StatsMini = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</span>
    <span className="text-white font-bold text-lg tracking-tight">{value}</span>
  </div>
)
