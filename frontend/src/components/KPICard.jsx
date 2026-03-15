import { motion } from 'framer-motion'

export default function KPICard({ title, value, subtitle, icon, color = 'primary', trend }) {
  // Map our generic colors to the new V2 palette
  const c = {
    primary: 'text-primary border-l-primary',
    emerald: 'text-emerald-400 border-l-emerald-400',
    orange:  'text-orange-400 border-l-orange-400',
    amber:   'text-amber-400 border-l-amber-400',
    rose:    'text-rose-400 border-l-rose-400',
    indigo:  'text-indigo-400 border-l-indigo-400',
    violet:  'text-accent-ultra border-l-accent-ultra'
  }[color] || 'text-primary border-l-primary'
  
  const bgColors = {
    primary: 'bg-primary'
  }

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-panel p-6 rounded-xl flex flex-col gap-2 border-l-4 ${c} relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start z-10">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <div className="flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          {typeof icon === 'string' ? (
            <span className="material-symbols-outlined">{icon}</span>
          ) : (
             // Fallback for when Icon components are passed directly from lucide (we are phasing these out but need backwards compat)
            <span className="material-symbols-outlined font-fill">analytics</span>
          )}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 z-10">
        <p className="text-3xl font-bold text-slate-100 tracking-tight">{value}</p>
      </div>

      <div className="z-10 mt-1 flex items-center justify-between">
         {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
         {trend !== undefined && (
           <span className={`text-xs font-bold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
             {trend >= 0 ? '+' : ''}{trend}%
           </span>
         )}
      </div>

      {/* Decorative Progress Bar */}
      <div className="w-full bg-white/5 h-1 mt-3 rounded-full overflow-hidden z-10">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
           transition={{ duration: 1, delay: 0.2 }}
           className={`h-full rounded-full ${bgColors[color] || 'bg-white/40'}`} 
         />
      </div>
    </motion.div>
  )
}
