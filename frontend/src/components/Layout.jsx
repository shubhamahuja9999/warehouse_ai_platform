const navItems = [
  { icon: 'dashboard',             label: 'Overview' },
  { icon: 'inventory_2',           label: 'SKU Analytics' },
  { icon: 'precision_manufacturing', label: 'Dead Stock' },
  { icon: 'local_shipping',        label: 'Returns' },
  { icon: 'route',                 label: 'Slotting' },
]

export default function Layout({ children, activeTab, setActiveTab }) {
  const { showroom, logout } = useAuth()

  const initials = showroom?.name
    ? showroom.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-dark font-display text-slate-100">
      {/* Sidebar - Stitch Exact Structure */}
      <div className="flex z-20 h-full min-h-screen w-64 flex-col justify-between bg-black/20 backdrop-blur-md border-r border-white/10 p-4 shrink-0">
        
        <div className="flex flex-col gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-primary/20 aspect-square rounded-[0.5rem] flex items-center justify-center size-10 shadow-[0_0_15px_rgba(124,43,238,0.3)] shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">precision_manufacturing</span>
            </div>
            <div className="flex flex-col truncate">
              <h1 className="text-white text-base font-semibold leading-tight truncate">Warehouse AI</h1>
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider truncate">Admin Portal</p>
            </div>
          </div>

          {/* Showroom badge */}
          {showroom && (
            <div className="mx-1 bg-white/5 border border-white/10 rounded-xl px-3 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{showroom.name}</p>
                  <p className="text-slate-400 text-xs text-primary">@{showroom.username}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex flex-col gap-2">
            {navItems.map(({ icon, label }, i) => {
              const isActive = label === activeTab
              return (
                <div
                  key={i}
                  onClick={() => setActiveTab(label)}
                  className={
                    isActive
                      ? `flex items-center gap-3 px-4 py-3 rounded-[0.5rem] bg-primary/20 border border-primary/30 shadow-[0_0_10px_rgba(124,43,238,0.1)] transition-all cursor-pointer`
                      : `flex items-center gap-3 px-4 py-3 rounded-[0.5rem] hover:bg-white/5 transition-colors group cursor-pointer`
                  }
                >
                  <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>
                    {icon}
                  </span>
                  <p className={`${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white transition-colors'} text-sm font-medium`}>
                    {label}
                  </p>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom — API status + Logout (Adapted to Stitch User Profile style) */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-[0.5rem] bg-white/5 border border-white/10">
            <div className="flex items-center justify-center bg-primary/20 aspect-square rounded-full size-10 border-2 border-primary/50 text-white font-bold text-sm shrink-0">
               {initials}
            </div>
            <div className="flex flex-col truncate">
              <p className="text-white text-sm font-medium truncate">{showroom?.name || 'J. Doe'}</p>
              <p className="text-slate-400 text-xs truncate">System Admin</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-[0.5rem] hover:bg-red-500/10 border border-transparent hover:border-red-500/20 group transition-all text-left w-full cursor-pointer"
          >
             <span className="material-symbols-outlined text-slate-400 group-hover:text-red-400 transition-colors">logout</span>
             <p className="text-slate-400 group-hover:text-red-400 text-sm font-medium transition-colors">Log Out</p>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col p-8 gap-8 overflow-y-auto relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {children}
      </div>
    </div>
  )
}
