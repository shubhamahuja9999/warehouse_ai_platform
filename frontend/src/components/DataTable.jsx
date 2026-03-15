export default function DataTable({ title, data, columns, maxRows = 10 }) {
  const rows = data ? data.slice(0, maxRows) : []

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200/30 dark:border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-sm p-6 relative overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-sm">table_rows</span>
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
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/5`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-900 dark:text-white font-medium">
                      {col.format ? col.format(row[col.key]) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-600 text-sm">No data to display</div>
      )}
    </div>
  )
}
