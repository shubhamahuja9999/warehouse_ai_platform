import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { motion } from 'framer-motion'

const GRADIENT_COLORS = ['#6366f1', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-indigo-500/30 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-slate-300 text-xs">{label}</p>
        <p className="text-indigo-300 font-bold text-sm">{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function BarChartCard({ title, data, xKey, yKey, color = '#7c2bee' }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col gap-4 rounded-xl glass-card p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10 pointer-events-none group-hover:bg-primary/30 transition-colors duration-700"></div>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-sm group-hover:drop-shadow-[0_0_8px_rgba(124,43,238,0.8)] transition-all">auto_graph</span>
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold">{title}</h3>
          </div>
        </div>
      </div>
      {data && data.length > 0 ? (
        <div className="flex min-h-[250px] flex-1 flex-col gap-4 py-4 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,43,238,0.08)' }} />
            <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[220px] flex items-center justify-center text-slate-600 text-sm">
          <div className="flex flex-col items-center gap-2 animate-pulse-slow">
            <span className="material-symbols-outlined text-slate-500/50 text-4xl">hourglass_empty</span>
            <p>No data yet</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
