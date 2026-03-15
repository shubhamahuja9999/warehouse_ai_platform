import { motion } from 'framer-motion'

export default function KPICard({ title, value, subtitle, icon, color = 'primary', trend }) {
  const c = {
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    orange:  'bg-orange-500/10 text-orange-500',
    amber:   'bg-amber-500/10 text-amber-500',
    rose:    'bg-rose-500/10 text-rose-500',
    indigo:  'bg-indigo-500/10 text-indigo-500',
    violet:  'bg-violet-500/10 text-violet-500'
  }[color] || 'bg-primary/10 text-primary'
  
  const hoverGradients = {
    primary: 'from-primary/10',
    emerald: 'from-emerald-500/10',
    orange:  'from-orange-500/10',
    amber:   'from-amber-500/10',
    rose:    'from-rose-500/10',
    indigo:  'from-indigo-500/10',
    violet:  'from-violet-500/10'
  }
  const h = hoverGradients[color] || 'from-primary/10'

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex flex-col gap-3 rounded-xl p-6 glass-card relative overflow-hidden group cursor-default"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${h} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="flex justify-between items-start z-10">
        <div className={`flex items-center justify-center size-10 rounded-lg ${c} shadow-[0_0_15px_inherit] opacity-80 group-hover:opacity-100 transition-opacity`}>
          {typeof icon === 'string' ? (
            <span className="material-symbols-outlined">{icon}</span>
          ) : (
            <span className="material-symbols-outlined">inventory</span>
          )}
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
            trend >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-orange-500 bg-orange-500/10'
          }`}>
            <span className="material-symbols-outlined text-[14px]">
              {trend >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="z-10 mt-2">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 drop-shadow-md">{title}</p>
        <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight drop-shadow-lg">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
