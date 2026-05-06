import { useState } from 'react'
import { apiService } from '@/services/api'
import type { InferenceResult, BatchResult } from '@/types'

const inputStyle = {
  width: '100%', padding: '9px 13px', borderRadius: 7, border: '1px solid var(--border-2)',
  background: 'var(--bg-3)', color: 'var(--text)', fontFamily: 'var(--font-mono)',
  fontSize: 13, outline: 'none', transition: 'border-color 0.15s',
}

const labelStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 5, display: 'block',
}

const btnStyle = (disabled: boolean, color = 'var(--green)', dim = 'var(--green-dim)', border = 'rgba(0,229,160,0.3)') => ({
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px',
  borderRadius: 8, border: `1px solid ${border}`,
  background: disabled ? `${dim}50` : dim,
  color, cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase' as const, transition: 'all 0.15s', opacity: disabled ? 0.6 : 1,
})

type Mode = 'single' | 'batch'

const DEFAULT_FEATURES = '{\n  "edad": 35,\n  "ingreso_mensual": 3500,\n  "num_transacciones": 12,\n  "saldo_promedio": 8500,\n  "dias_cliente": 730,\n  "score_credito": 650\n}'

export function Predict() {
  const [mode, setMode] = useState<Mode>('single')

  // Single
  const [modelId, setModelId]           = useState('1')
  const [featuresJson, setFeaturesJson] = useState(DEFAULT_FEATURES)
  const [result, setResult]             = useState<InferenceResult | null>(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [jsonError, setJsonError]       = useState<string | null>(null)

  // Batch
  const [batchModelId, setBatchModelId]   = useState('1')
  const [batchJson, setBatchJson]         = useState('[\n  {"edad": 30, "ingreso_mensual": 2000},\n  {"edad": 45, "ingreso_mensual": 5000},\n  {"edad": 25, "ingreso_mensual": 1200}\n]')
  const [batchResult, setBatchResult]     = useState<BatchResult | null>(null)
  const [batchLoading, setBatchLoading]   = useState(false)
  const [batchError, setBatchError]       = useState<string | null>(null)

  function parseJson(str: string): Record<string, any> | null {
    try { return JSON.parse(str) }
    catch { return null }
  }

  async function handlePredict() {
    setError(null); setJsonError(null); setResult(null)
    const features = parseJson(featuresJson)
    if (!features || typeof features !== 'object' || Array.isArray(features)) {
      setJsonError('Invalid JSON object for input_features')
      return
    }
    setLoading(true)
    try {
      const r = await apiService.runInference({ modelo_id: parseInt(modelId), input_features: features })
      setResult(r)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Inference failed')
    } finally { setLoading(false) }
  }

  async function handleBatch() {
    setBatchError(null); setBatchResult(null)
    const inputs = parseJson(batchJson)
    if (!Array.isArray(inputs)) { setBatchError('Input must be a JSON array'); return }
    if (inputs.length > 50) { setBatchError('Max 50 inputs per batch'); return }
    setBatchLoading(true)
    try {
      const r = await apiService.runBatchInference({ modelo_id: parseInt(batchModelId), inputs })
      setBatchResult(r)
    } catch (err: any) {
      setBatchError(err?.response?.data?.detail || err?.message || 'Batch failed')
    } finally { setBatchLoading(false) }
  }

  const modeBtn = (id: Mode, label: string) => (
    <button onClick={() => setMode(id)} style={{
      padding: '6px 16px', borderRadius: 6,
      border: mode === id ? '1px solid rgba(0,229,160,0.25)' : '1px solid transparent',
      background: mode === id ? 'var(--green-dim)' : 'transparent',
      color: mode === id ? 'var(--green)' : 'var(--text-3)',
      cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11,
      fontWeight: mode === id ? 700 : 400, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.15s',
    }}>{label}</button>
  )

  const labelColor = (label: string) => {
    if (label?.includes('churn') || label?.includes('fraud') || label === 'high_risk' || label === 'positive') return 'var(--red)'
    return 'var(--green)'
  }

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 4, textTransform: 'uppercase' }}>Inference Engine · Ms4 Gateway</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Prediction Simulator</h1>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {modeBtn('single', 'Single Inference')}
        {modeBtn('batch', 'Batch (≤50)')}
      </div>

      {/* ── Single ── */}
      {mode === 'single' && (
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: 'var(--green)', borderRadius: 2 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
              Single Inference Request · /api/inference/predict
            </span>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'start' }}>
              <div>
                <label style={labelStyle}>Model ID (Ms2)</label>
                <input type="number" value={modelId} onChange={e => setModelId(e.target.value)} min={1}
                  style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,160,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'} />
              </div>
              <div>
                <label style={labelStyle}>Input Features (JSON Object)</label>
                <textarea value={featuresJson} onChange={e => setFeaturesJson(e.target.value)} rows={8}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,229,160,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'} />
              </div>
            </div>

            {jsonError && (
              <div style={{ padding: '10px 14px', borderRadius: 6, background: 'var(--red-dim)', border: '1px solid rgba(255,77,106,0.2)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)' }}>
                ⚠ {jsonError}
              </div>
            )}

            <button onClick={handlePredict} disabled={loading} style={btnStyle(loading)}>
              {loading ? '◐ PROCESSING…' : '▶ RUN INFERENCE'}
            </button>

            {error && (
              <div style={{ padding: '14px 18px', borderRadius: 8, background: 'var(--red-dim)', border: '1px solid rgba(255,77,106,0.2)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--red)' }}>
                ✗ {error}
              </div>
            )}

            {result && (
              <div className="animate-slide-up" style={{ borderRadius: 10, border: '1px solid rgba(0,229,160,0.2)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: 'var(--green-dim)', borderBottom: '1px solid rgba(0,229,160,0.15)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ✓ Inference Complete · log/{result.log_id?.slice(-8) || '—'}
                </div>
                <div style={{ padding: 20, background: 'var(--bg-3)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 8, textTransform: 'uppercase' }}>Prediction Output</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: 'var(--blue)' }}>
                        {result.prediccion.output.toFixed(6)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 8, textTransform: 'uppercase' }}>Prediction Label</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: labelColor(result.prediccion.label), textTransform: 'uppercase' }}>
                        {result.prediccion.label}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    {[
                      { label: 'Model', value: result.modelo.nombre },
                      { label: 'Framework', value: result.modelo.framework },
                      { label: 'Version', value: `v${result.modelo.version}` },
                      { label: 'Latency', value: `${result.latencia_ms}ms` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Batch ── */}
      {mode === 'batch' && (
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: 'var(--blue)', borderRadius: 2 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
              Batch Inference · /api/inference/batch · max 50
            </span>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'start' }}>
              <div>
                <label style={labelStyle}>Model ID (Ms2)</label>
                <input type="number" value={batchModelId} onChange={e => setBatchModelId(e.target.value)} min={1}
                  style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = 'rgba(79,172,255,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'} />
              </div>
              <div>
                <label style={labelStyle}>Inputs (JSON Array of objects)</label>
                <textarea value={batchJson} onChange={e => setBatchJson(e.target.value)} rows={8}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(79,172,255,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-2)'} />
              </div>
            </div>

            <button onClick={handleBatch} disabled={batchLoading} style={btnStyle(batchLoading, 'var(--blue)', 'var(--blue-dim)', 'rgba(79,172,255,0.3)')}>
              {batchLoading ? '◐ PROCESSING BATCH…' : '▶ RUN BATCH'}
            </button>

            {batchError && (
              <div style={{ padding: '14px 18px', borderRadius: 8, background: 'var(--red-dim)', border: '1px solid rgba(255,77,106,0.2)', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--red)' }}>
                ✗ {batchError}
              </div>
            )}

            {batchResult && (
              <div className="animate-slide-up" style={{ borderRadius: 10, border: '1px solid rgba(79,172,255,0.2)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: 'var(--blue-dim)', borderBottom: '1px solid rgba(79,172,255,0.15)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--blue)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ✓ Batch Complete · {batchResult.exitosos}/{batchResult.total} success · {batchResult.errores} errors
                </div>
                <div style={{ padding: 20, background: 'var(--bg-3)', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                  {batchResult.results.map((item, i) => (
                    <div key={i} style={{
                      padding: '10px 14px', borderRadius: 6,
                      background: item.status === 'success' ? 'rgba(0,229,160,0.05)' : 'var(--red-dim)',
                      border: `1px solid ${item.status === 'success' ? 'rgba(0,229,160,0.15)' : 'rgba(255,77,106,0.2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>#{i + 1}</span>
                      {item.status === 'success' && item.result ? (
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue)' }}>{item.result.prediccion.output.toFixed(4)}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: labelColor(item.result.prediccion.label), textTransform: 'uppercase' }}>{item.result.prediccion.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{item.result.latencia_ms}ms</span>
                        </div>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)' }}>✗ {item.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
