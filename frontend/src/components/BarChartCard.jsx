import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

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

export default function BarChartCard({ title, data, xKey, yKey, color = '#6366f1' }) {
  return (
    <div className="glass rounded-2xl p-6 border border-indigo-500/15 shadow-xl">
      <h3 className="text-base font-semibold text-slate-200 mb-5">{title}</h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[220px] flex items-center justify-center text-slate-600 text-sm">
          No data yet
        </div>
      )}
    </div>
  )
}
