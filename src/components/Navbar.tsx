
interface NavbarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: '◈' },
  { id: 'features', label: 'Features', icon: '◫' },
  { id: 'models', label: 'Registry', icon: '◻' },
  { id: 'predict', label: 'Infer', icon: '◆' },
  { id: 'logs', label: 'Logs', icon: '≡' },
  { id: 'analytics', label: 'Analytics', icon: '▲' },
]

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 40, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--green-dim)',
            border: '1px solid rgba(0,229,160,0.3)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--green)',
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
          }}>
            M
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em' }}>
              MLOps<span style={{ color: 'var(--green)' }}>_lite</span>
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              platform v1.0
            </div>
          </div>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 'auto' }}>
          <div className="pulse-live" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>LIVE</span>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 6,
                border: activeTab === item.id
                  ? '1px solid rgba(0,229,160,0.25)'
                  : '1px solid transparent',
                background: activeTab === item.id
                  ? 'var(--green-dim)'
                  : 'transparent',
                color: activeTab === item.id ? 'var(--green)' : 'var(--text-3)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: activeTab === item.id ? 500 : 400,
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (activeTab !== item.id) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-2)'
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== item.id) {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-3)'
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: 10, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: timestamp */}
        <div style={{ marginLeft: 20, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.05em' }}>
          {new Date().toISOString().slice(0, 16).replace('T', ' ')}Z
        </div>
      </div>
    </nav>
  )
}
