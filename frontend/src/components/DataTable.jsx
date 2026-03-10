export default function DataTable({ title, data, columns, maxRows = 10 }) {
  const rows = data ? data.slice(0, maxRows) : []

  return (
    <div className="glass rounded-2xl border border-indigo-500/15 shadow-xl overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h3 className="text-base font-semibold text-slate-200">{title}</h3>
        </div>
      )}
      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-3 text-left text-xs font-semibold text-indigo-300 uppercase tracking-wider"
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
                  className={`border-t border-slate-700/30 transition-colors duration-150 hover:bg-indigo-500/5
                    ${i % 2 === 0 ? 'bg-slate-800/10' : 'bg-transparent'}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-slate-300 font-medium">
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
