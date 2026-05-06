import { useEffect, useState } from 'react'
import { apiService } from '@/services/api'
import type { PredLogStats } from '@/types'
import { KPICard } from '../KPICard'

const svcStyle = {
  padding: '12px 14px',
  borderRadius: 8,
  background: 'var(--bg-3)',
  border: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export function Dashboard() {
  const [stats, setStats] = useState<PredLogStats | null>(null)
  const [health, setHealth] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    setLoading(true)
    try {
      const [s, h1, h2, h3, h4, h5] = await Promise.all([
        apiService.getPredLogStats(),
        apiService.checkHealth('ms1'),
        apiService.checkHealth('ms2'),
        apiService.checkHealth('ms3'),
        apiService.checkHealth('ms4'),
        apiService.checkHealth('ms5'),
      ])
      setStats(s)
      setHealth({ ms1: h1, ms2: h2, ms3: h3, ms4: h4, ms5: h5 })
    } finally { setLoading(false) }
  }

  const successState = stats?.por_estado?.find(e => e._id === 'success')
  const successCount = successState?.count ?? 0
  const totalLogs = stats?.total_logs ?? 0
  const successRate = totalLogs > 0 ? ((successCount / totalLogs) * 100).toFixed(1) : '—'
  const avgLat = stats?.latencia_ms?.avg?.toFixed(1) ?? '—'

  const kpis = [
    { value: totalLogs > 0 ? totalLogs.toLocaleString() : '…', label: 'Total Logs',     sublabel: 'Predictions recorded',    accent: 'blue'   as const },
    { value: successRate !== '—' ? successRate + '%' : '…',    label: 'Success Rate',   sublabel: 'Inference outcomes',       accent: 'green'  as const },
    { value: avgLat !== '—' ? avgLat + 'ms' : '…',             label: 'Avg Latency',    sublabel: 'Inference response time',  accent: 'amber'  as const },
    { value: stats ? String(stats.por_estado?.length ?? 0) : '…', label: 'Estado Types', sublabel: 'Log state categories',   accent: 'violet' as const },
  ]

  const services = [
    { label: 'Feature Store',     key: 'ms1', port: '8001', tech: 'Python·FastAPI' },
    { label: 'Model Registry',    key: 'ms2', port: '8002', tech: 'Java·Spring' },
    { label: 'PredLogs Service',  key: 'ms3', port: '8003', tech: 'Node·Express' },
    { label: 'Inference Gateway', key: 'ms4', port: '8004', tech: 'Python·FastAPI' },
    { label: 'Monitoring',        key: 'ms5', port: '8005', tech: 'Python·Athena' },
  ]

  const allOk = Object.values(health).length > 0 && Object.values(health).every(h => h === 'ok')

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 6, textTransform: 'uppercase' }}>
            System Overview
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            MLOps Dashboard
          </h1>
        </div>
        <div style={{
          padding: '6px 12px', borderRadius: 6,
          background: allOk ? 'var(--green-dim)' : 'var(--amber-dim)',
          border: `1px solid ${allOk ? 'rgba(0,229,160,0.2)' : 'rgba(245,158,11,0.2)'}`,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: allOk ? 'var(--green)' : 'var(--amber)',
          letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span className="pulse-live" style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: allOk ? 'var(--green)' : 'var(--amber)' }} />
          {allOk ? 'ALL SYSTEMS OPERATIONAL' : 'CHECKING SERVICES…'}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {kpis.map((kpi, i) => (
          <div key={kpi.label} style={{ animationDelay: `${i * 0.07}s` }}>
            <KPICard {...kpi} loading={loading} />
          </div>
        ))}
      </div>

      {/* Log state breakdown */}
      {stats && stats.por_estado.length > 0 && (
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: 'var(--violet)', borderRadius: 2 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
              Prediction Outcomes
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)' }}>
              BY STATE · ALL TIME
            </span>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats.por_estado.map(s => {
              const pct = totalLogs > 0 ? (s.count / totalLogs * 100) : 0
              const color = s._id === 'success' ? 'var(--green)' : s._id === 'error' ? 'var(--red)' : 'var(--amber)'
              return (
                <div key={s._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s._id}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color }}>
                      {s.count.toLocaleString()} · {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--surface)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, opacity: 0.85 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Latency stats */}
      {stats?.latencia_ms && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Min Latency', value: `${stats.latencia_ms.min?.toFixed(1)}ms`, color: 'var(--green)' },
            { label: 'Avg Latency', value: `${stats.latencia_ms.avg?.toFixed(1)}ms`, color: 'var(--blue)' },
            { label: 'Max Latency', value: `${stats.latencia_ms.max?.toFixed(1)}ms`, color: 'var(--amber)' },
          ].map(item => (
            <div key={item.label} style={{ padding: '16px 18px', borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Services health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        {services.map(svc => {
          const status = health[svc.key] || 'checking'
          const statusColor = status === 'ok' ? 'var(--green)' : status === 'checking' ? 'var(--text-3)' : 'var(--red)'
          return (
            <div key={svc.key} style={svcStyle}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>{svc.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', marginTop: 2 }}>
                  {svc.key} · :{svc.port} · {svc.tech}
                </div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: status === 'ok' ? '0 0 6px var(--green)' : 'none' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
