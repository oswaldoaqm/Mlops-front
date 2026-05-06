interface KPICardProps {
  value: string
  label: string
  icon?: React.ReactNode
  sublabel?: string
  loading?: boolean
  accent?: 'green' | 'blue' | 'amber' | 'violet'
}

const accentMap = {
  green: { color: 'var(--green)', dim: 'var(--green-dim)', border: 'rgba(0,229,160,0.15)' },
  blue:  { color: 'var(--blue)',  dim: 'var(--blue-dim)',  border: 'rgba(79,172,255,0.15)' },
  amber: { color: 'var(--amber)', dim: 'var(--amber-dim)', border: 'rgba(245,158,11,0.15)' },
  violet:{ color: 'var(--violet)',dim: 'var(--violet-dim)',border: 'rgba(167,139,250,0.15)' },
}

export function KPICard({ value, label, sublabel, loading, accent = 'green' }: KPICardProps) {
  const a = accentMap[accent]
  return (
    <div
      className="animate-slide-up"
      style={{
        background: 'var(--bg-3)',
        border: `1px solid ${a.border}`,
        borderRadius: 10,
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: a.color, opacity: 0.5 }} />
      
      {/* Corner decoration */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 12,
        width: 24,
        height: 24,
        borderTop: `1px solid ${a.border}`,
        borderRight: `1px solid ${a.border}`,
        borderRadius: '0 6px 0 0',
        opacity: 0.6,
      }} />

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 6 }} />
      ) : (
        <div className="animate-count" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 28,
          fontWeight: 700,
          color: a.color,
          lineHeight: 1,
          marginBottom: sublabel ? 8 : 0,
        }}>
          {value}
        </div>
      )}

      {sublabel && (
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
          {sublabel}
        </div>
      )}
    </div>
  )
}
