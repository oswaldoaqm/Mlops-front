const badgeConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  produccion:       { bg: 'var(--green-dim)',  text: 'var(--green)',  dot: 'var(--green)',  label: 'PROD' },
  staging:          { bg: 'var(--amber-dim)',  text: 'var(--amber)',  dot: 'var(--amber)',  label: 'STAGING' },
  retirado:         { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-3)', dot: 'var(--text-3)', label: 'RETIRED' },
  en_entrenamiento: { bg: 'var(--blue-dim)',   text: 'var(--blue)',   dot: 'var(--blue)',   label: 'TRAINING' },
}

interface BadgeProps {
  label: string
  variant?: string
}

export function Badge({ label, variant }: BadgeProps) {
  const key = variant || label || ''
  const safeLabel = label || '—'
  const config = badgeConfig[key] || { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-2)', dot: 'var(--text-2)', label: safeLabel.toUpperCase() }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '2px 8px',
      borderRadius: 4,
      background: config.bg,
      color: config.text,
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.1em',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: config.dot, flexShrink: 0 }} />
      {config.label}
    </span>
  )
}
