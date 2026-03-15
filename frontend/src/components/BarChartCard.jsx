import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { motion } from 'framer-motion'

const GRADIENT_COLORS = ['#2536f4', '#00f2ff', '#9d00ff', '#1a1b3a', '#101122']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border border-primary/30 rounded-xl px-4 py-3 shadow-[0_0_15px_rgba(0,242,255,0.2)]">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-cyan-accent font-bold text-lg">{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function BarChartCard({ title, data, xKey, yKey }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel rounded-xl p-6 flex flex-col relative group overflow-hidden"
    >
      <div className="flex justify-between items-center z-10 mb-6">
        <div>
           <h3 className="text-xl font-bold text-slate-100">{title}</h3>
           <p className="text-slate-500 text-sm">Real-time throughput analysis</p>
        </div>
        <div className="flex gap-2">
            <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary text-white shadow-[0_0_10px_rgba(37,54,244,0.4)]">Live</button>
            <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">History</button>
        </div>
      </div>

      {data && data.length > 0 ? (
        <div className="h-[250px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f2ff" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#2536f4" stopOpacity={0.3}/>
                 </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,54,244,0.1)" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Space Grotesk' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Space Grotesk' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,54,244,0.1)' }} />
              <Bar dataKey={yKey} radius={[4, 4, 0, 0]} fill="url(#barGradient)">
                {data.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[250px] flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-primary/30 text-4xl animate-pulse">analytics</span>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Awaiting Data Stream</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
