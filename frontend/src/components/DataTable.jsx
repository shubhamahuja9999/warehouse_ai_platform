import { motion } from 'framer-motion'

export default function DataTable({ title, data, columns, maxRows = 10 }) {
  const rows = data ? data.slice(0, maxRows) : []

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col gap-4 rounded-xl glass-card p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
      {title && (
        <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-sm group-hover:drop-shadow-[0_0_8px_rgba(124,43,238,0.8)] transition-all">table_rows</span>
            <h3 className="text-slate-900 dark:text-white text-lg font-semibold">{title}</h3>
        </div>
      )}
      {rows.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              {rows.map((row, i) => (
                <motion.tr
                  variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
                  key={i}
                  className={`border-b border-white/5 transition-colors duration-150 relative cursor-default`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-900 dark:text-white font-medium">
                      {col.format ? col.format(row[col.key]) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-slate-600 text-sm animate-pulse-slow">
          <span className="material-symbols-outlined text-slate-500/50 text-3xl mb-2">hourglass_empty</span>
          No data to display
        </div>
      )}
    </motion.div>
  )
}
