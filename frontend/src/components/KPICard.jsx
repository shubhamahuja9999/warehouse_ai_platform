export default function KPICard({ title, value, subtitle, icon, color = 'primary', trend }) {
  const c = {
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    orange:  'bg-orange-500/10 text-orange-500',
    amber:   'bg-amber-500/10 text-amber-500',
    rose:    'bg-rose-500/10 text-rose-500',
  }[color] || 'bg-primary/10 text-primary'
  
  const hoverGradients = {
    primary: 'from-primary/5',
    emerald: 'from-emerald-500/5',
    orange:  'from-orange-500/5',
    amber:   'from-amber-500/5',
    rose:    'from-rose-500/5',
  }
  const h = hoverGradients[color] || 'from-primary/5'

  return (
    <div className="flex flex-col gap-3 rounded-xl p-6 bg-white/5 backdrop-blur-sm border border-slate-200/30 dark:border-white/10 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${h} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="flex justify-between items-start z-10">
        <div className={`flex items-center justify-center size-10 rounded-lg ${c}`}>
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
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
