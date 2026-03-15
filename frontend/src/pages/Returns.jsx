import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import BarChartCard from '../components/BarChartCard'
import DataTable from '../components/DataTable'
import KPICard from '../components/KPICard'
import { RefreshCw, TrendingDown, AlertCircle } from 'lucide-react'

export default function Returns() {
  const { returnsData, showroom } = useData()

  if (!returnsData) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            boxShadow: ["0 0 15px rgba(244,63,94,0.3)", "0 0 35px rgba(244,63,94,0.6)", "0 0 15px rgba(244,63,94,0.3)"]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6"
        >
          <span className="material-symbols-outlined text-rose-500 text-4xl opacity-80">assignment_return</span>
        </motion.div>
        <h2 className="text-slate-900 dark:text-white font-semibold text-xl">No Returns Data Available</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md text-center">
          Upload your returns CSV file on the Overview page to analyze return risks and product dissatisfaction for {showroom?.name || 'your showroom'}.
        </p>
      </div>
    )
  }

  const worstPerformer = returnsData.return_risk?.[0]

  return (
    <motion.div 
      initial="hidden" animate="show"
      variants={{ show: { transition: { staggerChildren: 0.15 } } }}
      className="space-y-8"
    >
      <motion.header variants={{ hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0 } }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-rose-500 text-3xl">assignment_return</span>
          <h1 className="text-3xl font-bold tracking-tight text-white">Return Risk Analysis</h1>
        </div>
        <p className="text-slate-400">Identify high-return SKUs and analyze overall return health.</p>
      </motion.header>

      <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: "spring" } } }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Average Return Rate" value={`${(returnsData.avg_return_rate * 100).toFixed(1)}%`} subtitle="Across all SKUs" icon={RefreshCw} color="indigo" />
        
        {worstPerformer && (
          <>
            <KPICard title="Highest Risk SKU" value={worstPerformer.sku} subtitle={`${(worstPerformer.return_rate * 100).toFixed(1)}% return rate`} icon={AlertCircle} color="rose" />
            <KPICard title="Highest Return Vol" value={worstPerformer.returns} subtitle={`SKU: ${worstPerformer.sku}`} icon={TrendingDown} color="orange" />
          </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { type: "spring" } } }} className="flex w-full">
          <div className="w-full">
            <BarChartCard 
              title="Top 20 High-Risk Return SKUs" 
              data={returnsData.return_risk?.map(r => ({ ...r, return_rate_pct: +(r.return_rate * 100).toFixed(1) }))} 
              xKey="sku" yKey="return_rate_pct" 
              color="#f43f5e"
            />
          </div>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { type: "spring" } } }} className="flex w-full">
          <div className="w-full">
             <DataTable 
              title="Return Risk Detail" 
              data={returnsData.return_risk} 
              columns={[
                { key: 'sku', label: 'SKU' }, 
                { key: 'orders', label: 'Total Orders' }, 
                { key: 'returns', label: 'Returns' }, 
                { key: 'return_rate', label: 'Return Rate', format: v => `${(v * 100).toFixed(1)}%` }
              ]} 
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
