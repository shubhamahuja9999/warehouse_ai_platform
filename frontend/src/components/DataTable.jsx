import { motion } from 'framer-motion'

export default function DataTable({ title, data, columns, maxRows = 10 }) {
  const rows = data ? data.slice(0, maxRows) : []

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel rounded-xl overflow-hidden flex flex-col group relative"
    >
      {title && (
        <div className="p-6 border-b border-primary/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">{title}</h2>
            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:text-cyan-accent transition-colors">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
        </div>
      )}
      
      {rows.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              className="divide-y divide-primary/10"
            >
              {rows.map((row, i) => (
                <motion.tr
                  variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
                  whileHover={{ backgroundColor: "rgba(37,54,244,0.05)" }}
                  key={i}
                  className="transition-colors duration-150 relative cursor-default group/row"
                >
                  {columns.map((col, colIdx) => (
                    <td key={col.key} className={`px-6 py-4 ${colIdx === 0 ? 'font-medium text-slate-100' : 'text-slate-300'}`}>
                      {col.format ? col.format(row[col.key]) : row[col.key]}
                    </td>
                  ))}
                  {/* Hover indicator lines */}
                  <td className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover/row:opacity-100 transition-opacity" />
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-primary/30 text-4xl animate-pulse">table_chart</span>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Awaiting Data Stream</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
