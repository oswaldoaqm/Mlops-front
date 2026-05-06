import { useEffect, useState } from 'react'
import { apiService } from '@/services/api'
import { TIPO_DATOS, PAGE_SIZE } from '@/constants'
import type { Dataset, Feature } from '@/types'
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
  fontSize: 13, outline: 'none', width: 140,
}

const typeColors: Record<string, string> = {
  float64: 'var(--blue)', int64: 'var(--green)', string: 'var(--violet)',
  bool: 'var(--amber)', datetime: 'var(--red)',
}

type ActiveTab = 'datasets' | 'features'

export function Features() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('datasets')

  // Datasets state
  const [datasets, setDatasets]     = useState<Dataset[]>([])
  const [dsPage, setDsPage]         = useState(1)
  const [dsTotal, setDsTotal]       = useState(0)
  const [dsLoading, setDsLoading]   = useState(false)
  const [dsActivo, setDsActivo]     = useState<string>('')
  const [dsDominio, setDsDominio]   = useState('')

  // Features state
  const [features, setFeatures]       = useState<Feature[]>([])
  const [fPage, setFPage]             = useState(1)
  const [fTotal, setFTotal]           = useState(0)
  const [fLoading, setFLoading]       = useState(false)
  const [fTipo, setFTipo]             = useState('')
  const [fDatasetId, setFDatasetId]   = useState('')

  useEffect(() => { loadDatasets() }, [dsPage, dsActivo, dsDominio])
  useEffect(() => { loadFeatures() }, [fPage, fTipo])

  async function loadDatasets() {
    setDsLoading(true)
    try {
      const activoParam = dsActivo === '' ? undefined : dsActivo === 'true'
      const r = await apiService.getDatasets(dsPage, PAGE_SIZE, activoParam, dsDominio || undefined)
      setDatasets(r.items)
      setDsTotal(r.total)
    } finally { setDsLoading(false) }
  }

  async function loadFeatures() {
    setFLoading(true)
    try {
      let r
      if (fDatasetId) {
        r = await apiService.getFeaturesByDataset(parseInt(fDatasetId), fPage, PAGE_SIZE)
      } else {
        r = await apiService.getFeatures(fPage, PAGE_SIZE, fTipo || undefined)
      }
      setFeatures(r.items)
      setFTotal(r.total)
    } finally { setFLoading(false) }
  }

  function handleFeaturesSearch() { setFPage(1); loadFeatures() }

  const tabBtn = (id: ActiveTab, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '6px 16px', borderRadius: 6, border: activeTab === id ? '1px solid rgba(0,229,160,0.25)' : '1px solid transparent',
        background: activeTab === id ? 'var(--green-dim)' : 'transparent',
        color: activeTab === id ? 'var(--green)' : 'var(--text-3)',
        cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11,
        fontWeight: activeTab === id ? 700 : 400, letterSpacing: '0.06em', textTransform: 'uppercase',
        transition: 'all 0.15s',
      }}
    >{label}</button>
  )

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 4, textTransform: 'uppercase' }}>Feature Store</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Feature Catalog</h1>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {tabBtn('datasets', 'Datasets')}
        {tabBtn('features', 'Features')}
      </div>

      {activeTab === 'datasets' && (
        <Card title="Datasets · MS1 Registry">
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Status</div>
              <select value={dsActivo} onChange={e => { setDsActivo(e.target.value); setDsPage(1) }} style={selectStyle}>
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Domain</div>
              <input
                value={dsDominio}
                onChange={e => { setDsDominio(e.target.value); setDsPage(1) }}
                placeholder="e.g. finanzas"
                style={{ ...inputStyle, width: 160 }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,160,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
              />
            </div>
          </div>

          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'nombre', label: 'Nombre' },
              { key: 'dominio', label: 'Dominio', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--blue-dim)', color: 'var(--blue)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{v}</span>
              )},
              { key: 'descripcion', label: 'Descripción', render: v => (
                <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{v ? (v.length > 50 ? v.slice(0,50)+'…' : v) : '—'}</span>
              )},
              { key: 'activo', label: 'Estado', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: v ? 'var(--green-dim)' : 'rgba(255,255,255,0.05)', color: v ? 'var(--green)' : 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                  {v ? 'ACTIVE' : 'INACTIVE'}
                </span>
              )},
              { key: 'created_at', label: 'Created', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{v ? new Date(v).toLocaleDateString() : '—'}</span>
              )},
            ]}
            data={datasets}
            loading={dsLoading}
          />
          <Pagination page={dsPage - 1} onPrevious={() => setDsPage(p => Math.max(1, p - 1))} onNext={() => setDsPage(p => p + 1)} canPrevious={dsPage > 1} canNext={datasets.length === PAGE_SIZE} total={dsTotal} />
        </Card>
      )}

      {activeTab === 'features' && (
        <Card title="Features · Variable Catalog">
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Tipo de Dato</div>
              <select value={fTipo} onChange={e => { setFTipo(e.target.value); setFPage(1) }} style={selectStyle}>
                <option value="">All Types</option>
                {TIPO_DATOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>Dataset ID</div>
              <input
                type="number" value={fDatasetId} onChange={e => setFDatasetId(e.target.value)}
                placeholder="Filter by dataset"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,160,0.4)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'}
              />
            </div>
            <button onClick={handleFeaturesSearch} style={{
              padding: '7px 18px', borderRadius: 7, border: '1px solid rgba(0,229,160,0.25)',
              background: 'var(--green-dim)', color: 'var(--green)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', transition: 'all 0.15s',
            }}>SEARCH</button>
          </div>

          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'nombre_variable', label: 'Variable' },
              { key: 'tipo_dato', label: 'Tipo', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px', borderRadius: 4, background: `${typeColors[v] || 'var(--text-3)'}18`, color: typeColors[v] || 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{v}</span>
              )},
              { key: 'es_categorica', label: 'Categórica', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: v ? 'var(--violet)' : 'var(--text-3)' }}>{v ? 'YES' : 'NO'}</span>
              )},
              { key: 'dataset_id', label: 'Dataset ID', render: v => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue)' }}>#{v}</span>
              )},
              { key: 'descripcion', label: 'Descripción', render: v => (
                <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{v ? (v.length > 40 ? v.slice(0,40)+'…' : v) : '—'}</span>
              )},
            ]}
            data={features}
            loading={fLoading}
          />
          <Pagination page={fPage - 1} onPrevious={() => setFPage(p => Math.max(1, p - 1))} onNext={() => setFPage(p => p + 1)} canPrevious={fPage > 1} canNext={features.length === PAGE_SIZE} total={fTotal} />
        </Card>
      )}
    </div>
  )
}
