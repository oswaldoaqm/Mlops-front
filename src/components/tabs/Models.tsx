import { useEffect, useState } from 'react'
import { apiService } from '@/services/api'
import { FRAMEWORKS, PAGE_SIZE } from '@/constants'
import type { Modelo, Metrica } from '@/types'
import { Card } from '../Card'
import { DataTable } from '../DataTable'
import { Pagination } from '../Pagination'

const selectStyle = {
  padding: '7px 12px', borderRadius: 7, border: '1px solid var(--border-2)',
  background: 'var(--bg-3)', color: 'var(--text-2)', fontFamily: 'var(--font-sans)',
  fontSize: 13, outline: 'none', cursor: 'pointer', minWidth: 160,
}

const inputStyle = {
  padding: '7px 12px', borderRadius: 7, border: '1px solid var(--border-2)',
  background: 'var(--bg-3)', color: 'var(--text)', fontFamily: 'var(--font-mono)',
  fontSize: 13, outline: 'none', width: 120,
}

const fwColors: Record<string, string> = {
  pytorch: 'var(--red)', tensorflow: 'var(--amber)', sklearn: 'var(--blue)',
  xgboost: 'var(--green)', lightgbm: 'var(--violet)',
}

type ActiveTab = 'models' | 'metricas'

export function Models() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('models')

  // Models
  const [models, setModels]         = useState<Modelo[]>([])
  const [mPage, setMPage]           = useState(0)
  const [mTotal, setMTotal]         = useState(0)
  const [mLoading, setMLoading]     = useState(false)
  const [mActivo, setMActivo]       = useState<string>('')
  const [mFramework, setMFramework] = useState('')

  // Metrics
  const [metricas, setMetricas]       = useState<Metrica[]>([])
  const [metPage, setMetPage]         = useState(0)
  const [metTotal, setMetTotal]       = useState(0)
  const [metLoading, setMetLoading]   = useState(false)
  const [metModelId, setMetModelId]   = useState('')

  useEffect(() => { loadModels() }, [mPage, mActivo, mFramework])
  useEffect(() => { loadMetricas() }, [metPage])

  async function loadModels() {
    setMLoading(true)
    try {
      const activoParam = mActivo === '' ? undefined : mActivo === 'true'
      const r = await apiService.getModelos(mPage, PAGE_SIZE, activoParam, mFramework || undefined)
      setModels(r.content)
      setMTotal(r.totalElements)
    } finally { setMLoading(false) }
  }

  async function loadMetricas() {
    setMetLoading(true)
    try {
      let r
      if (metModelId) {
        r = await apiService.getMetricasByModelo(parseInt(metModelId), metPage, PAGE_SIZE)
      } else {
        r = await apiService.getMetricas(metPage, PAGE_SIZE)
      }
      setMetricas(r.content)
      setMetTotal(r.totalElements)
    } finally { setMetLoading(false) }
  }

  function handleMetricasSearch() { setMetPage(0); loadMetricas() }

  async function handleSoftDelete(id: number) {
    if (!confirm(`Soft-delete modelo #${id}?`)) return
    await apiService.softDeleteModelo(id)
    loadModels()
  }

  const tabBtn = (id: ActiveTab, label: string) => (
    <button onClick={() => setActiveTab(id)} style={{
      padding: '6px 16px', borderRadius: 6,
      border: activeTab === id ? '1px solid rgba(0,229,160,0.25)' : '1px solid transparent',
      background: activeTab === id ? 'var(--green-dim)' : 'transparent',
      color: activeTab === id ? 'var(--green)' : 'var(--text-3)',
      cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11,
      fontWeight: activeTab === id ? 700 : 400, letterSpacing: '0.06em',
      textTransform: 'uppercase', transition: 'all 0.15s',
    }}>{label}</button>
  )

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 4, textTransform: 'uppercase' }}>Model Registry</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Registered Models</h1>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {tabBtn('models', 'Models')}
        {tabBtn('metricas', 'Métricas')}
      </div>

      {activeTab === 'models' && (
        <Card title="Model Registry · MS2">
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Framework</div>
              <select value={mFramework} onChange={e => { setMFramework(e.target.value); setMPage(0) }} style={selectStyle}>
                <option value="">All Frameworks</option>
                {FRAMEWORKS.map(fw => <option key={fw} value={fw}>{fw}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Status</div>
              <select value={mActivo} onChange={e => { setMActivo(e.target.value); setMPage(0) }} style={selectStyle}>
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <DataTable
            columns={[
              { key: 'id', label: 'ID', render: v => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>#{v}</span> },
              { key: 'nombre', label: 'Nombre' },
              { key: 'framework', label: 'Framework', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: `${fwColors[v?.toLowerCase()] || 'var(--text-3)'}18`, color: fwColors[v?.toLowerCase()] || 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{v}</span>
              )},
              { key: 'version', label: 'Version', render: v => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)' }}>v{v}</span> },
              { key: 'activo', label: 'Estado', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: v ? 'var(--green-dim)' : 'rgba(255,255,255,0.05)', color: v ? 'var(--green)' : 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                  {v ? 'ACTIVE' : 'INACTIVE'}
                </span>
              )},
              { key: 'createdAt', label: 'Created', render: v => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{v ? new Date(v).toLocaleDateString() : '—'}</span> },
              { key: 'id', label: 'Actions', render: (v, row) => (
                <button onClick={() => handleSoftDelete(row.id)} style={{
                  padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(255,77,106,0.2)',
                  background: 'var(--red-dim)', color: 'var(--red)', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                }}>DEACTIVATE</button>
              )},
            ]}
            data={models}
            loading={mLoading}
          />
          <Pagination page={mPage} onPrevious={() => setMPage(p => Math.max(0, p - 1))} onNext={() => setMPage(p => p + 1)} canPrevious={mPage > 0} canNext={models.length === PAGE_SIZE} total={mTotal} />
        </Card>
      )}

      {activeTab === 'metricas' && (
        <Card title="Métricas · Evaluation History">
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Modelo ID</div>
              <input type="number" value={metModelId} onChange={e => setMetModelId(e.target.value)} placeholder="Filter by model" style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,160,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'} />
            </div>
            <button onClick={handleMetricasSearch} style={{
              padding: '7px 18px', borderRadius: 7, border: '1px solid rgba(0,229,160,0.25)',
              background: 'var(--green-dim)', color: 'var(--green)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', transition: 'all 0.15s',
            }}>SEARCH</button>
          </div>

          <DataTable
            columns={[
              { key: 'id', label: 'ID', render: v => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>#{v}</span> },
              { key: 'tipoMetrica', label: 'Tipo', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--blue)' }}>{v}</span>
              )},
              { key: 'valorMetrica', label: 'Valor', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: 12 }}>{typeof v === 'number' ? v.toFixed(6) : v}</span>
              )},
              { key: 'datasetEvaluacion', label: 'Dataset', render: v => <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{v || '—'}</span> },
              { key: 'notas', label: 'Notas', render: v => <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{v ? (v.length > 40 ? v.slice(0,40)+'…' : v) : '—'}</span> },
              { key: 'createdAt', label: 'Created', render: v => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{v ? new Date(v).toLocaleDateString() : '—'}</span> },
            ]}
            data={metricas}
            loading={metLoading}
          />
          <Pagination page={metPage} onPrevious={() => setMetPage(p => Math.max(0, p - 1))} onNext={() => setMetPage(p => p + 1)} canPrevious={metPage > 0} canNext={metricas.length === PAGE_SIZE} total={metTotal} />
        </Card>
      )}
    </div>
  )
}
