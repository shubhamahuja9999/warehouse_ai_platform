export default function Returns() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Returns Management</h1>
        <p className="text-slate-400">Track and predict customer return patterns.</p>
      </header>
      <div className="glass rounded-2xl p-8 border-indigo-500/20 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 animate-pulse glow">Fetching Return Predictions...</p>
      </div>
    </div>
  )
}
