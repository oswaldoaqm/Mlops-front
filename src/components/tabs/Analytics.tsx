import { useEffect, useState } from 'react'
import { apiService } from '@/services/api'
import type { DataDriftRow, FrameworkAccuracyRow, PredictionsByDatasetRow, TopModelWeeklyRow } from '@/types'
import { Card } from '../Card'
import { DataTable } from '../DataTable'

const FW_COLORS: Record<string, string> = {
  pytorch: 'var(--red)', tensorflow: 'var(--amber)', sklearn: 'var(--blue)',
  xgboost: 'var(--green)', lightgbm: 'var(--violet)',
}

function getFwColor(fw: string) {
  return FW_COLORS[fw?.toLowerCase()] || 'var(--blue)'
}

export function Analytics() {
  const [drift, setDrift]         = useState<DataDriftRow[]>([])
  const [framework, setFramework] = useState<FrameworkAccuracyRow[]>([])
  const [byDataset, setByDataset] = useState<PredictionsByDatasetRow[]>([])
  const [topModels, setTopModels] = useState<TopModelWeeklyRow[]>([])
  const [loading, setLoading]     = useState(true)
  const [athenaMsg, setAthenaMsg] = useState<string | null>(null)

  useEffect(() => { loadAnalytics() }, [])

  async function loadAnalytics() {
    setLoading(true)
    setAthenaMsg(null)
    try {
      const [d, fw, bd, tm] = await Promise.all([
        apiService.getDataDrift(),
        apiService.getFrameworkAccuracy(),
        apiService.getPredictionsByDataset(),
        apiService.getTopModelsWeekly(),
      ])
      setDrift(d)
      setFramework(fw)
      setByDataset(bd)
      setTopModels(tm)
      if ([d, fw, bd, tm].every(arr => arr.length === 0)) {
        setAthenaMsg('No data returned from Athena. Ensure AWS credentials are valid and Glue crawlers have run.')
      }
    } finally { setLoading(false) }
  }

  const hasAny = drift.length > 0 || framework.length > 0 || byDataset.length > 0 || topModels.length > 0

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 4, textTransform: 'uppercase' }}>Monitoring · Ms5 · AWS Athena</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Platform Insights</h1>
        </div>
        <button onClick={loadAnalytics} disabled={loading} style={{
          padding: '7px 16px', borderRadius: 7, border: '1px solid rgba(79,172,255,0.25)',
          background: 'var(--blue-dim)', color: 'var(--blue)', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', opacity: loading ? 0.6 : 1,
        }}>{loading ? '◐ QUERYING ATHENA…' : '⟳ REFRESH'}</button>
      </div>

      {athenaMsg && (
        <div style={{ padding: '14px 18px', borderRadius: 8, background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.25)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--amber)' }}>
          ⚠ {athenaMsg}
        </div>
      )}

      {/* Query 2: Framework Accuracy */}
      <Card title="Query 2 — Framework vs Accuracy Promedio">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 48 }} />)}
          </div>
        ) : framework.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {framework.map((fw, i) => {
              const acc = parseFloat(fw.promedio_accuracy) || 0
              const allAcc = framework.map(f => parseFloat(f.promedio_accuracy) || 0)
              const max = Math.max(...allAcc, 0.01)
              const pct = (acc / max * 100)
              const color = getFwColor(fw.framework)
              return (
                <div key={fw.framework} className="animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 3, height: 14, borderRadius: 2, background: color }} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-2)', fontWeight: 500, textTransform: 'uppercase' }}>{fw.framework}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{fw.total_modelos} models</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color }}>{acc.toFixed(4)}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'var(--surface)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, opacity: 0.85 }} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '24px 0', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            {loading ? 'QUERYING…' : 'NO DATA · Run Athena query first'}
          </div>
        )}
      </Card>

      {/* Query 1: Data Drift */}
      <Card title="Query 1 — Data Drift · Predicciones por Mes y Modelo">
        <DataTable
          columns={[
            { key: 'modelo_nombre', label: 'Model' },
            { key: 'mes', label: 'Month', render: v => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{v}</span> },
            { key: 'promedio_prediccion', label: 'Avg Prediction', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontSize: 12 }}>{parseFloat(v)?.toFixed(4) ?? v}</span>
            )},
            { key: 'total_predicciones', label: 'Total Preds', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{parseInt(v)?.toLocaleString() ?? v}</span>
            )},
          ]}
          data={drift}
          loading={loading}
        />
      </Card>

      {/* Query 3: Predictions by Dataset */}
      <Card title="Query 3 — Predicciones por Dataset de Origen">
        <DataTable
          columns={[
            { key: 'dataset_origen', label: 'Dataset' },
            { key: 'total_predicciones', label: 'Total Preds', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontSize: 12 }}>{parseInt(v)?.toLocaleString() ?? v}</span>
            )},
            { key: 'promedio_output', label: 'Avg Output', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontSize: 12 }}>{parseFloat(v)?.toFixed(4) ?? v}</span>
            )},
          ]}
          data={byDataset}
          loading={loading}
        />
      </Card>

      {/* Query 4: Top Models Weekly */}
      <Card title="Query 4 — Top 5 Modelos · Últimos 7 Días">
        <DataTable
          columns={[
            { key: 'modelo_id', label: 'ID', render: v => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>#{v}</span> },
            { key: 'modelo_nombre', label: 'Model' },
            { key: 'total_peticiones', label: 'Requests (7d)', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontSize: 12 }}>{parseInt(v)?.toLocaleString() ?? v}</span>
            )},
            { key: 'latencia_promedio', label: 'Avg Latency', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: parseFloat(v) > 150 ? 'var(--red)' : 'var(--green)' }}>
                {parseFloat(v)?.toFixed(2) ?? v}ms
              </span>
            )},
          ]}
          data={topModels}
          loading={loading}
        />
      </Card>
    </div>
  )
}
