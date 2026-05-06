import { type ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
  actions?: ReactNode
}

export function Card({ title, children, actions }: CardProps) {
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 16, background: 'var(--green)', borderRadius: 2 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
            {title}
          </span>
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        {children}
      </div>
    </div>
  )
}
