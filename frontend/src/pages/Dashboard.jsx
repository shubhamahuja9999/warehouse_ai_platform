import { useState, useEffect } from 'react'
import {
  Package, TrendingUp, AlertTriangle, RefreshCw,
  BarChart2, Loader2, ChevronRight, Boxes, Clock
} from 'lucide-react'

import FileUploader from '../components/FileUploader'
import KPICard from '../components/KPICard'
import BarChartCard from '../components/BarChartCard'
import DataTable from '../components/DataTable'
import { useAuth } from '../context/AuthContext'

const STORAGE_KEY = 'warehouse_data'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch { return {} }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function Dashboard() {
  const { showroom } = useAuth()

  const [ordersFile, setOrdersFile] = useState(null)
  const [inventoryFile, setInventoryFile] = useState(null)
  const [returnsFile, setReturnsFile] = useState(null)

  const [ordersData, setOrdersData] = useState(null)
  const [inventoryData, setInventoryData] = useState(null)
  const [returnsData, setReturnsData] = useState(null)

  const [lastUploaded, setLastUploaded] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({})
  const [initLoading, setInitLoading] = useState(true)

  const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }))
  const setErr = (key, val) => setError(p => ({ ...p, [key]: val }))

  useEffect(() => {
    const saved = loadFromStorage()
    if (saved.orders) { setOrdersData(saved.orders); setLastUploaded(p => ({ ...p, orders: saved.ordersUploadTime })) }
    if (saved.inventory) { setInventoryData(saved.inventory); setLastUploaded(p => ({ ...p, inventory: saved.inventoryUploadTime })) }
    if (saved.returns) { setReturnsData(saved.returns); setLastUploaded(p => ({ ...p, returns: saved.returnsUploadTime })) }
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
    const slow = skuFreq.slice(-20)
    const zoneActivity = {}
    Object.entries(skuZones).forEach(([sku, zone]) => {
      zoneActivity[zone] = (zoneActivity[zone] || 0) + (skuCounts[sku] || 0)
    })
    const forecast = Math.round(skuFreq.reduce((sum, s) => sum + s.orders, 0) / data.length * 7)
    return {
      sku_frequency: skuFreq.slice(0, 20),
      slow_skus: slow,
      slotting: skuFreq.slice(0, 20).map((s, i) => ({ sku: s.sku, picks: s.orders, recommended_zone: ['A', 'B', 'C', 'D'][i % 4] })),
      forecast,
      total_orders: data.length,
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
      const now = new Date().toISOString()
      setLastUploaded(p => ({ ...p, orders: now }))
      saveToStorage({ ...loadFromStorage(), orders: result, ordersUploadTime: now })
    } catch (e) {
      setErr('orders', 'Failed to analyze orders - check CSV format')
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
      const now = new Date().toISOString()
      setLastUploaded(p => ({ ...p, inventory: now }))
      saveToStorage({ ...loadFromStorage(), inventory: result, inventoryUploadTime: now })
    } catch (e) {
      setErr('inventory', 'Failed to analyze inventory - check CSV format')
    } finally {
      setLoad('inventory', false)
    }
  }

  const handleReturns = async (file) => {
    setReturnsFile(file)
    if (!ordersFile && !ordersData) return
    setLoad('returns', true)
    setErr('returns', null)
    try {
      const returnsDataArr = await parseCSV(file)
      const returnRates = {}
      returnsDataArr.forEach(row => {
        const sku = row.sku || row.SKU || row.product_id
        const ret = parseInt(row.returns || row.Returns || 1)
        if (sku) returnRates[sku] = (returnRates[sku] || 0) + ret
      })
      const ordersSkus = {}
      if (ordersData?.sku_frequency) {
        ordersData.sku_frequency.forEach(s => ordersSkus[s.sku] = s.orders)
      }
      const risk = Object.entries(returnRates).map(([sku, returns]) => ({
        sku,
        orders: ordersSkus[sku] || 0,
        returns,
        return_rate: returns / ((ordersSkus[sku] || 1))
      })).sort((a, b) => b.return_rate - a.return_rate)
      const result = { return_risk: risk.slice(0, 20), avg_return_rate: risk.reduce((s, r) => s + r.return_rate, 0) / risk.length || 0 }
      setReturnsData(result)
      const now = new Date().toISOString()
      setLastUploaded(p => ({ ...p, returns: now }))
      saveToStorage({ ...loadFromStorage(), returns: result, returnsUploadTime: now })
    } catch (e) {
      setErr('returns', 'Failed to analyze returns - check CSV format')
    } finally {
      setLoad('returns', false)
    }
  }

  const Spinner = () => (
    <div className="flex items-center gap-2 text-indigo-400 text-sm mt-2">
      <Loader2 size={14} className="animate-spin" />
      <span>Analyzing...</span>
    </div>
  )

  const ErrorBadge = ({ msg }) => msg ? (
    <p className="text-rose-400 text-xs mt-2 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">{msg}</p>
  ) : null

  const UploadedAt = ({ ts }) => ts ? (
    <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-xs">
      <Clock size={11} />
      <span>Last updated {new Date(ts).toLocaleString()}</span>
    </div>
  ) : null

  if (initLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-indigo-400 animate-spin" />
          <p className="text-slate-500 text-sm">Loading your showroom data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2">
          <ChevronRight size={12} />
          <span>{showroom?.name?.toUpperCase() || 'WAREHOUSE INTELLIGENCE PLATFORM'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Operational Dashboard
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Upload CSV files to run analytics - your data is saved locally
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <FileUploader label="Orders CSV" onFile={handleOrders} fileName={ordersFile?.name} />
          {loading.orders && <Spinner />}
          <ErrorBadge msg={error.orders} />
          <UploadedAt ts={lastUploaded.orders} />
        </div>
        <div>
          <FileUploader label="Inventory CSV" onFile={handleInventory} fileName={inventoryFile?.name} />
          {loading.inventory && <Spinner />}
          <ErrorBadge msg={error.inventory} />
          <UploadedAt ts={lastUploaded.inventory} />
        </div>
        <div>
          <FileUploader label="Returns CSV" onFile={handleReturns} fileName={returnsFile?.name} />
          {loading.returns && <Spinner />}
          <ErrorBadge msg={error.returns} />
          <UploadedAt ts={lastUploaded.returns} />
        </div>
      </div>

      {ordersData && (
        <>
          <section>
            <SectionHeader icon={BarChart2} title="Orders Overview" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <KPICard title="Total Orders" value={ordersData.total_orders?.toLocaleString()} icon={Package} color="indigo" />
              <KPICard title="Unique SKUs" value={ordersData.unique_skus?.toLocaleString()} icon={Boxes} color="violet" />
              <KPICard title="Forecast Next Week" value={ordersData.forecast} subtitle="Predicted orders" icon={TrendingUp} color="emerald" />
              <KPICard title="Slow Moving SKUs" value={ordersData.slow_skus?.length} subtitle="Bottom 20" icon={AlertTriangle} color="amber" />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartCard title="Top 20 SKUs by Order Frequency" data={ordersData.sku_frequency} xKey="sku" yKey="orders" />
            {ordersData.zone_activity && (
              <BarChartCard title="Zone Activity (Picks)" data={ordersData.zone_activity} xKey="zone" yKey="picks" />
            )}
          </div>

          <DataTable title="Slotting Recommendations" data={ordersData.slotting} columns={[{ key: 'sku', label: 'SKU' }, { key: 'picks', label: 'Pick Count', format: v => v?.toLocaleString() }, { key: 'recommended_zone', label: 'Recommended Zone' }]} />

          <DataTable title="Slow Moving SKUs (Bottom 20)" data={ordersData.slow_skus} columns={[{ key: 'sku', label: 'SKU' }, { key: 'orders', label: 'Orders', format: v => v?.toLocaleString() }]} />
        </>
      )}

      {inventoryData && (
        <section>
          <SectionHeader icon={AlertTriangle} title="Dead Stock Analysis" />
          <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
            <KPICard title="Dead Stock SKUs" value={inventoryData.dead_stock_count} subtitle="No sale in 90+ days" icon={AlertTriangle} color="rose" />
            <KPICard title="Total SKUs" value={inventoryData.total_skus} icon={Boxes} color="indigo" />
          </div>
          <DataTable title="Dead Stock Items" data={inventoryData.dead_stock} columns={[{ key: 'sku', label: 'SKU' }, { key: 'stock', label: 'Stock Level', format: v => v?.toLocaleString() }, { key: 'days_since_sale', label: 'Days Since Last Sale', format: v => `${v} days` }]} />
        </section>
      )}

      {returnsData && (
        <section>
          <SectionHeader icon={RefreshCw} title="Return Risk Analysis" />
          <div className="mt-4 mb-6">
            <KPICard title="Avg Return Rate" value={`${(returnsData.avg_return_rate * 100).toFixed(1)}%`} subtitle="Across all SKUs" icon={RefreshCw} color="rose" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartCard title="Top 20 High-Risk Return SKUs" data={returnsData.return_risk?.map(r => ({ ...r, return_rate_pct: +(r.return_rate * 100).toFixed(1) }))} xKey="sku" yKey="return_rate_pct" />
            <DataTable title="Return Risk Detail" data={returnsData.return_risk} columns={[{ key: 'sku', label: 'SKU' }, { key: 'orders', label: 'Orders' }, { key: 'returns', label: 'Returns' }, { key: 'return_rate', label: 'Return Rate', format: v => `${(v * 100).toFixed(1)}%` }]} />
          </div>
        </section>
      )}

      {!ordersData && !inventoryData && !returnsData && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 glow animate-pulse-slow">
            <Package size={32} className="text-indigo-400 opacity-80" />
          </div>
          <h2 className="text-slate-300 font-semibold text-lg">No data yet for {showroom?.name}</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-xs">
            Upload CSV files above - results are saved locally
          </p>
        </div>
      )}
    </div>
  )
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
        <Icon size={15} className="text-indigo-400" />
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/20 to-transparent" />
    </div>
  )
}
