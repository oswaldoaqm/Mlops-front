interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
}

export function DataTable<T extends Record<string, any>>({ columns, data, loading }: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 36, opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div style={{
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-3)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: '0.05em',
      }}>
        — NO DATA —
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--text-3)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid var(--border)',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="animate-slide-up"
              style={{
                animationDelay: `${i * 0.03}s`,
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  style={{
                    padding: '9px 12px',
                    fontSize: 12.5,
                    color: 'var(--text-2)',
                    fontFamily: col.key === 'log_id' || col.key === 'feature_id' || col.key === 'modelo_id' ? 'var(--font-mono)' : 'var(--font-sans)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.render
                    ? col.render(row[col.key as string], row)
                    : (row[col.key as string] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
