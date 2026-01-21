export default function Table({ columns, data, actions }) {
  return (
    <div className="w-full">
      <div className="space-y-3 sm:hidden">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum registro encontrado</div>
        ) : (
          data.map((row, idx) => (
            <div key={row.id || idx} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="space-y-3">
                {columns.map((col) => (
                  <div key={col.key} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {col.label}
                    </span>
                    <div className="text-sm text-gray-700 break-words">
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  </div>
                ))}
                {actions && (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    {actions(row)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
