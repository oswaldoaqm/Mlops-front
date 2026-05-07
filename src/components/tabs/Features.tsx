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
  const [datasets, setDatasets]   = useState<Dataset[]>([])
  const [dsPage, setDsPage]       = useState(1)
  const [dsTotal, setDsTotal]     = useState(0)
  const [dsLoading, setDsLoading] = useState(false)
  const [dsActivo, setDsActivo]   = useState<string>('')
  const [dsDominio, setDsDominio] = useState('')

  // Modal crear dataset
  const [showCreateDs, setShowCreateDs] = useState(false)
  const [newDs, setNewDs] = useState({ nombre: '', dominio: '', descripcion: '' })
  const [creating, setCreating] = useState(false)

  // Features state
  const [features, setFeatures]     = useState<Feature[]>([])
  const [fPage, setFPage]           = useState(1)
  const [fTotal, setFTotal]         = useState(0)
  const [fLoading, setFLoading]     = useState(false)
  const [fTipo, setFTipo]           = useState('')
  const [fDatasetId, setFDatasetId] = useState('')

  // Modal crear feature
  const [showCreateFeat, setShowCreateFeat] = useState(false)
  const [newFeat, setNewFeat] = useState({
    nombre_variable: '', tipo_dato: 'float64',
    descripcion: '', es_categorica: false, dataset_id: ''
  })
  const [creatingFeat, setCreatingFeat] = useState(false)

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

  async function handleCreateDataset() {
    if (!newDs.nombre || !newDs.dominio) return
    setCreating(true)
    try {
      await apiService.createDataset({ ...newDs, activo: true })
      setNewDs({ nombre: '', dominio: '', descripcion: '' })
      setShowCreateDs(false)
      loadDatasets()
    } finally { setCreating(false) }
  }

  async function handleCreateFeature() {
    if (!newFeat.nombre_variable || !newFeat.dataset_id) return
    setCreatingFeat(true)
    try {
      await apiService.createFeature({
        nombre_variable: newFeat.nombre_variable,
        tipo_dato: newFeat.tipo_dato,
        descripcion: newFeat.descripcion,
        es_categorica: newFeat.es_categorica,
        dataset_id: parseInt(newFeat.dataset_id)
      })
      setNewFeat({ nombre_variable: '', tipo_dato: 'float64', descripcion: '', es_categorica: false, dataset_id: '' })
      setShowCreateFeat(false)
      loadFeatures()
    } finally { setCreatingFeat(false) }
  }

  async function handleDeleteDataset(id: number) {
    if (!confirm(`¿Eliminar dataset #${id}?`)) return
    await apiService.deleteDataset(id)
    loadDatasets()
  }

  async function handleDeleteFeature(id: number) {
    if (!confirm(`¿Eliminar feature #${id}?`)) return
    await apiService.deleteFeature(id)
    loadFeatures()
  }

  function handleFeaturesSearch() { setFPage(1); loadFeatures() }

  const tabBtn = (id: ActiveTab, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '6px 16px', borderRadius: 6,
        border: activeTab === id ? '1px solid rgba(0,229,160,0.25)' : '1px solid transparent',
        background: activeTab === id ? 'var(--green-dim)' : 'transparent',
        color: activeTab === id ? 'var(--green)' : 'var(--text-3)',
        cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11,
        fontWeight: activeTab === id ? 700 : 400, letterSpacing: '0.06em',
        textTransform: 'uppercase', transition: 'all 0.15s',
      }}
    >{label}</button>
  )

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 4, textTransform: 'uppercase' }}>Feature Store</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Feature Catalog</h1>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {tabBtn('datasets', 'Datasets')}
        {tabBtn('features', 'Features')}
      </div>

      {activeTab === 'datasets' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
            <button onClick={() => setShowCreateDs(true)} style={{
              padding: '7px 18px', borderRadius: 7, border: '1px solid rgba(0,229,160,0.25)',
              background: 'var(--green-dim)', color: 'var(--green)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>+ NEW DATASET</button>
          </div>

          {showCreateDs && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
            }}>
              <div style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 14, padding: 28, width: 420,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  New Dataset
                </div>
                {[
                  { label: 'NOMBRE', key: 'nombre', placeholder: 'customer_churn_2024' },
                  { label: 'DOMINIO', key: 'dominio', placeholder: 'finanzas' },
                  { label: 'DESCRIPCIÓN', key: 'descripcion', placeholder: 'Descripción del dataset' },
                ].map(field => (
                  <div key={field.key}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)',
                      letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>{field.label}</div>
                    <input
                      value={newDs[field.key as keyof typeof newDs]}
                      onChange={e => setNewDs(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: 7,
                        border: '1px solid var(--border-2)', background: 'var(--bg-3)',
                        color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12,
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button onClick={() => setShowCreateDs(false)} style={{
                    padding: '7px 16px', borderRadius: 7, border: '1px solid var(--border-2)',
                    background: 'transparent', color: 'var(--text-3)', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                  }}>CANCEL</button>
                  <button onClick={handleCreateDataset} disabled={creating} style={{
                    padding: '7px 18px', borderRadius: 7, border: '1px solid rgba(0,229,160,0.25)',
                    background: 'var(--green-dim)', color: 'var(--green)', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                    opacity: creating ? 0.6 : 1,
                  }}>{creating ? 'CREATING…' : 'CREATE'}</button>
                </div>
              </div>
            </div>
          )}

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
                { key: 'id', label: 'Del', render: v => (
                  <button onClick={() => handleDeleteDataset(Number(v))} style={{
                    padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,77,106,0.2)',
                    background: 'var(--red-dim)', color: 'var(--red)', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                  }}>✕</button>
                )},
              ]}
              data={datasets}
              loading={dsLoading}
            />
            <Pagination page={dsPage - 1} onPrevious={() => setDsPage(p => Math.max(1, p - 1))} onNext={() => setDsPage(p => p + 1)} canPrevious={dsPage > 1} canNext={datasets.length === PAGE_SIZE} total={dsTotal} />
          </Card>
        </>
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
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s',
            }}>SEARCH</button>
            <button onClick={() => setShowCreateFeat(true)} style={{
              padding: '7px 18px', borderRadius: 7, border: '1px solid rgba(0,229,160,0.25)',
              background: 'var(--green-dim)', color: 'var(--green)', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>+ NEW FEATURE</button>
          </div>

          {showCreateFeat && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
            }}>
              <div style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 14, padding: 28, width: 420,
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  New Feature
                </div>
                {[
                  { label: 'NOMBRE VARIABLE', key: 'nombre_variable', placeholder: 'edad_cliente' },
                  { label: 'DESCRIPCIÓN', key: 'descripcion', placeholder: 'Descripción de la variable' },
                  { label: 'DATASET ID', key: 'dataset_id', placeholder: '1' },
                ].map(field => (
                  <div key={field.key}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)',
                      letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>{field.label}</div>
                    <input
                      value={newFeat[field.key as keyof typeof newFeat] as string}
                      onChange={e => setNewFeat(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: 7,
                        border: '1px solid var(--border-2)', background: 'var(--bg-3)',
                        color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12,
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)',
                    letterSpacing: '0.1em', marginBottom: 5, textTransform: 'uppercase' }}>TIPO DE DATO</div>
                  <select
                    value={newFeat.tipo_dato}
                    onChange={e => setNewFeat(prev => ({ ...prev, tipo_dato: e.target.value }))}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 7,
                      border: '1px solid var(--border-2)', background: 'var(--bg-3)',
                      color: 'var(--text-2)', fontFamily: 'var(--font-sans)', fontSize: 13,
                      outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {TIPO_DATOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={newFeat.es_categorica}
                    onChange={e => setNewFeat(prev => ({ ...prev, es_categorica: e.target.checked }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)' }}>
                    ES CATEGÓRICA
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button onClick={() => setShowCreateFeat(false)} style={{
                    padding: '7px 16px', borderRadius: 7, border: '1px solid var(--border-2)',
                    background: 'transparent', color: 'var(--text-3)', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                  }}>CANCEL</button>
                  <button onClick={handleCreateFeature} disabled={creatingFeat} style={{
                    padding: '7px 18px', borderRadius: 7, border: '1px solid rgba(0,229,160,0.25)',
                    background: 'var(--green-dim)', color: 'var(--green)', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                    opacity: creatingFeat ? 0.6 : 1,
                  }}>{creatingFeat ? 'CREATING…' : 'CREATE'}</button>
                </div>
              </div>
            </div>
          )}

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
              { key: 'id', label: 'Del', render: v => (
                <button onClick={() => handleDeleteFeature(Number(v))} style={{
                  padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,77,106,0.2)',
                  background: 'var(--red-dim)', color: 'var(--red)', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                }}>✕</button>
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