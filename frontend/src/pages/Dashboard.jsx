import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Package, TrendingUp, AlertTriangle, RefreshCw,
  BarChart2, Loader2, ChevronRight, MapPin, Boxes, Clock
} from 'lucide-react'

import FileUploader from '../components/FileUploader'
import KPICard from '../components/KPICard'
import BarChartCard from '../components/BarChartCard'
import DataTable from '../components/DataTable'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { showroom } = useAuth()

  const [ordersFile, setOrdersFile]       = useState(null)
  const [inventoryFile, setInventoryFile] = useState(null)
  const [returnsFile, setReturnsFile]     = useState(null)

  const [ordersData, setOrdersData]       = useState(null)
  const [inventoryData, setInventoryData] = useState(null)
  const [returnsData, setReturnsData]     = useState(null)

  const [lastUploaded, setLastUploaded]   = useState({})
  const [loading, setLoading]             = useState({})
  const [error, setError]                 = useState({})
  const [initLoading, setInitLoading]     = useState(true)

  const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }))
  const setErr  = (key, val) => setError(p  => ({ ...p, [key]: val }))

  // ── Load this showroom's previously saved data on mount ──────────────────
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const { data } = await axios.get('/api/dashboard')
        if (data.orders) {
          setOrdersData(data.orders.data)
          setLastUploaded(p => ({ ...p, orders: data.orders.uploaded_at }))
        }
        if (data.inventory) {
          setInventoryData(data.inventory.data)
          setLastUploaded(p => ({ ...p, inventory: data.inventory.uploaded_at }))
        }
        if (data.returns) {
          setReturnsData(data.returns.data)
          setLastUploaded(p => ({ ...p, returns: data.returns.uploaded_at }))
        }
      } catch {
        // No saved data yet — that's fine
      } finally {
        setInitLoading(false)
      }
    }
    loadSaved()
  }, [showroom?.id])

  // ── Uploads ──────────────────────────────────────────────────────────────
  const handleOrders = async (file) => {
    setOrdersFile(file)
    setLoad('orders', true)
    setErr('orders', null)
    const form = new FormData()
    form.append('file', file)
    try {
      const { data } = await axios.post('/api/orders', form)
      setOrdersData(data)
      setLastUploaded(p => ({ ...p, orders: new Date().toISOString() }))
    } catch (e) {
      setErr('orders', e.response?.data?.detail || 'Failed to analyse orders')
    } finally {
      setLoad('orders', false)
    }
  }

  const handleInventory = async (file) => {
    setInventoryFile(file)
    setLoad('inventory', true)
    setErr('inventory', null)
    const form = new FormData()
    form.append('file', file)
    try {
      const { data } = await axios.post('/api/inventory', form)
      setInventoryData(data)
      setLastUploaded(p => ({ ...p, inventory: new Date().toISOString() }))
    } catch (e) {
      setErr('inventory', e.response?.data?.detail || 'Failed to analyse inventory')
    } finally {
      setLoad('inventory', false)
    }
  }

  const handleReturns = async (file) => {
    setReturnsFile(file)
    if (!ordersFile && !ordersData) return
    setLoad('returns', true)
    setErr('returns', null)
    const form = new FormData()
    form.append('orders_file', ordersFile)
    form.append('returns_file', file)
    try {
      const { data } = await axios.post('/api/returns', form)
      setReturnsData(data)
      setLastUploaded(p => ({ ...p, returns: new Date().toISOString() }))
    } catch (e) {
      setErr('returns', e.response?.data?.detail || 'Failed to analyse returns')
    } finally {
      setLoad('returns', false)
    }
  }

  const Spinner = () => (
    <div className="flex items-center gap-2 text-indigo-400 text-sm mt-2">
      <Loader2 size={14} className="animate-spin" />
      <span>Analysing…</span>
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
          <p className="text-slate-500 text-sm">Loading your showroom data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-2">
          <ChevronRight size={12} />
          <span>{showroom?.name?.toUpperCase() || 'WAREHOUSE INTELLIGENCE PLATFORM'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Operational Dashboard
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Upload CSV files to run analytics — your data is saved and private to your showroom
        </p>
      </div>

      {/* ── Upload strip ───────────────────────────────────────────── */}
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
          <FileUploader label="Returns CSV (requires Orders)" onFile={handleReturns} fileName={returnsFile?.name} />
          {loading.returns && <Spinner />}
          <ErrorBadge msg={error.returns} />
          <UploadedAt ts={lastUploaded.returns} />
        </div>
      </div>

      {/* ── Orders section ─────────────────────────────────────────── */}
      {ordersData && (
        <>
          <section>
            <SectionHeader icon={BarChart2} title="Orders Overview" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <KPICard title="Total Orders"        value={ordersData.total_orders?.toLocaleString()} icon={Package}       color="indigo" />
              <KPICard title="Unique SKUs"          value={ordersData.unique_skus?.toLocaleString()}  icon={Boxes}         color="violet" />
              <KPICard title="Forecast Next Week"   value={ordersData.forecast}  subtitle="Predicted orders" icon={TrendingUp}    color="emerald" />
              <KPICard title="Slow Moving SKUs"     value={ordersData.slow_skus?.length} subtitle="Bottom 20" icon={AlertTriangle} color="amber" />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartCard title="Top 20 SKUs by Order Frequency" data={ordersData.sku_frequency} xKey="sku" yKey="orders" />
            {ordersData.zone_activity && (
              <BarChartCard title="Zone Activity (Picks)" data={ordersData.zone_activity} xKey="zone" yKey="picks" />
            )}
          </div>

          <DataTable
            title="Slotting Recommendations"
            data={ordersData.slotting}
            columns={[
              { key: 'sku',               label: 'SKU' },
              { key: 'picks',             label: 'Pick Count',    format: v => v?.toLocaleString() },
              { key: 'recommended_zone',  label: 'Recommended Zone' },
            ]}
          />

          <DataTable
            title="Slow Moving SKUs (Bottom 20)"
            data={ordersData.slow_skus}
            columns={[
              { key: 'sku',    label: 'SKU' },
              { key: 'orders', label: 'Orders', format: v => v?.toLocaleString() },
            ]}
          />
        </>
      )}

      {/* ── Dead Stock ─────────────────────────────────────────────── */}
      {inventoryData && (
        <section>
          <SectionHeader icon={AlertTriangle} title="Dead Stock Analysis" />
          <div className="grid grid-cols-2 gap-4 mt-4 mb-6">
            <KPICard title="Dead Stock SKUs" value={inventoryData.dead_stock_count} subtitle="No sale in 90+ days" icon={AlertTriangle} color="rose" />
            <KPICard title="Total SKUs"      value={inventoryData.total_skus}        icon={Boxes}         color="indigo" />
          </div>
          <DataTable
            title="Dead Stock Items"
            data={inventoryData.dead_stock}
            columns={[
              { key: 'sku',             label: 'SKU' },
              { key: 'stock',           label: 'Stock Level',       format: v => v?.toLocaleString() },
              { key: 'days_since_sale', label: 'Days Since Last Sale', format: v => `${v} days` },
            ]}
          />
        </section>
      )}

      {/* ── Returns ────────────────────────────────────────────────── */}
      {returnsData && (
        <section>
          <SectionHeader icon={RefreshCw} title="Return Risk Analysis" />
          <div className="mt-4 mb-6">
            <KPICard
              title="Avg Return Rate"
              value={`${(returnsData.avg_return_rate * 100).toFixed(1)}%`}
              subtitle="Across all SKUs"
              icon={RefreshCw}
              color="rose"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartCard
              title="Top 20 High-Risk Return SKUs"
              data={returnsData.return_risk?.map(r => ({ ...r, return_rate_pct: +(r.return_rate * 100).toFixed(1) }))}
              xKey="sku"
              yKey="return_rate_pct"
            />
            <DataTable
              title="Return Risk Detail"
              data={returnsData.return_risk}
              columns={[
                { key: 'sku',         label: 'SKU' },
                { key: 'orders',      label: 'Orders' },
                { key: 'returns',     label: 'Returns' },
                { key: 'return_rate', label: 'Return Rate', format: v => `${(v * 100).toFixed(1)}%` },
              ]}
            />
          </div>
        </section>
      )}

      {/* ── Empty state ────────────────────────────────────────────── */}
      {!ordersData && !inventoryData && !returnsData && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
            <Package size={32} className="text-indigo-400 opacity-60" />
          </div>
          <h2 className="text-slate-300 font-semibold text-lg">No data yet for {showroom?.name}</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-xs">
            Upload CSV files above — results are saved privately for your showroom
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
