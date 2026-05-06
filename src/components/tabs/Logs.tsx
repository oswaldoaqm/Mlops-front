import { useEffect, useState } from 'react'
import { apiService } from '@/services/api'
import { PAGE_SIZE } from '@/constants'
import type { PredLog } from '@/types'
import { Card } from '../Card'
import { DataTable } from '../DataTable'
import { Pagination } from '../Pagination'

const inputStyle = {
  padding: '7px 12px', borderRadius: 7, border: '1px solid var(--border-2)',
  background: 'var(--bg-3)', color: 'var(--text)', fontFamily: 'var(--font-mono)',
  fontSize: 13, outline: 'none', width: 120,
}

const selectStyle = {
  padding: '7px 12px', borderRadius: 7, border: '1px solid var(--border-2)',
  background: 'var(--bg-3)', color: 'var(--text-2)', fontFamily: 'var(--font-sans)',
  fontSize: 13, outline: 'none', cursor: 'pointer', minWidth: 140,
}

const estadoColors: Record<string, string> = {
  success: 'var(--green)', error: 'var(--red)', timeout: 'var(--amber)',
}

export function Logs() {
  const [logs, setLogs]       = useState<PredLog[]>([])
  const [page, setPage]       = useState(1)
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(false)
  const [modelId, setModelId] = useState('')
  const [estado, setEstado]   = useState('')

  useEffect(() => { loadLogs() }, [page])

  async function loadLogs() {
    setLoading(true)
    try {
      let r
      if (modelId) {
        r = await apiService.getPredLogsByModelo(parseInt(modelId), page, PAGE_SIZE)
      } else {
        r = await apiService.getPredLogs(page, PAGE_SIZE, estado || undefined)
      }
      setLogs(r.items)
      setTotal(r.total)
    } finally { setLoading(false) }
  }

  function handleSearch() { setPage(1); loadLogs() }

  async function handleDelete(id: string) {
    if (!confirm(`Delete log ${id}?`)) return
    await apiService.deletePredLog(id)
    loadLogs()
  }

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 4, textTransform: 'uppercase' }}>Prediction Logs · Ms3</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Inference History</h1>
      </div>

      <Card title="PredLogs · MongoDB Collection">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Model ID</div>
            <input type="number" value={modelId} onChange={e => setModelId(e.target.value)} placeholder="Any model" style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,160,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Estado</div>
            <select value={estado} onChange={e => setEstado(e.target.value)} style={selectStyle}>
              <option value="">All States</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="timeout">Timeout</option>
            </select>
          </div>
          <button onClick={handleSearch} style={{
            padding: '7px 18px', borderRadius: 7, border: '1px solid rgba(0,229,160,0.25)',
            background: 'var(--green-dim)', color: 'var(--green)', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.15s',
          }}>SEARCH</button>
        </div>

        <DataTable
          columns={[
            { key: '_id', label: 'Log ID', render: v => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)' }}>{String(v).slice(-10)}</span> },
            { key: 'modelo_nombre', label: 'Model' },
            { key: 'prediccion_output', label: 'Output', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontSize: 12 }}>{typeof v === 'number' ? v.toFixed(4) : v}</span>
            )},
            { key: 'prediccion_label', label: 'Label', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: estadoColors[v === 'churn' || v === 'fraud' || v === 'high_risk' ? 'error' : 'success'] || 'var(--text-2)' }}>{v}</span>
            )},
            { key: 'latencia_ms', label: 'Latency', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: v > 150 ? 'var(--amber)' : 'var(--text-2)' }}>{v}ms</span>
            )},
            { key: 'estado', label: 'Estado', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: `${estadoColors[v] || 'var(--text-3)'}18`, color: estadoColors[v] || 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                {v}
              </span>
            )},
            { key: 'dataset_origen', label: 'Dataset', render: v => <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{v}</span> },
            { key: 'timestamp', label: 'Time', render: v => (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>
                {v ? new Date(v).toLocaleString() : '—'}
              </span>
            )},
            { key: '_id', label: 'Del', render: v => (
              <button onClick={() => handleDelete(String(v))} style={{
                padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,77,106,0.2)',
                background: 'var(--red-dim)', color: 'var(--red)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 9,
              }}>✕</button>
            )},
          ]}
          data={logs}
          loading={loading}
        />
        <Pagination
          page={page - 1}
          onPrevious={() => setPage(p => Math.max(1, p - 1))}
          onNext={() => setPage(p => p + 1)}
          canPrevious={page > 1}
          canNext={logs.length === PAGE_SIZE}
          total={total}
        />
      </Card>
    </div>
  )
}
