// ── MS1: Features ──────────────────────────────────────────
export interface Dataset {
  id: number
  nombre: string
  dominio: string
  descripcion?: string
  activo: boolean
  created_at: string
  updated_at?: string
}

export interface DatasetPage {
  total: number
  page: number
  size: number
  items: Dataset[]
}

export interface Feature {
  id: number
  nombre_variable: string
  tipo_dato: 'float64' | 'int64' | 'string' | 'bool' | 'datetime'
  descripcion?: string
  es_categorica: boolean
  dataset_id: number
  created_at: string
}

export interface FeaturePage {
  total: number
  page: number
  size: number
  items: Feature[]
}

// ── MS2: Models ────────────────────────────────────────────
export interface Modelo {
  id: number
  nombre: string
  framework: string
  version: string
  descripcion?: string
  activo: boolean
  createdAt: string
  updatedAt?: string
}

export interface SpringPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface Metrica {
  id: number
  tipoMetrica: string
  valorMetrica: number
  datasetEvaluacion?: string
  notas?: string
  createdAt: string
}

// ── MS3: PredLogs ──────────────────────────────────────────
export interface PredLog {
  _id: string
  modelo_id: number
  modelo_nombre: string
  dataset_origen: string
  input_features: Record<string, number>
  prediccion_output: number
  prediccion_label: string
  latencia_ms: number
  estado: 'success' | 'error' | 'timeout'
  timestamp: string
}

export interface PredLogsPage {
  total: number
  page: number
  limit: number
  items: PredLog[]
}

export interface PredLogStats {
  total_logs: number
  por_estado: { _id: string; count: number }[]
  latencia_ms: { avg: number; min: number; max: number }
}

// ── MS4: Inference Gateway ─────────────────────────────────
export interface InferenceRequest {
  modelo_id: number
  input_features: Record<string, number | string>
}

export interface InferenceResult {
  modelo: { id: number; nombre: string; framework: string; version: string }
  prediccion: { output: number; label: string }
  latencia_ms: number
  log_id: string
}

export interface BatchRequest {
  modelo_id: number
  inputs: Record<string, number | string>[]
}

export interface BatchResult {
  modelo_id: number
  total: number
  exitosos: number
  errores: number
  results: { status: 'success' | 'error'; result?: InferenceResult; error?: string; input?: Record<string, any> }[]
}

// ── MS5: Monitoring ────────────────────────────────────────
export interface DataDriftRow {
  modelo_nombre: string
  mes: string
  promedio_prediccion: string
  total_predicciones: string
}

export interface FrameworkAccuracyRow {
  framework: string
  total_modelos: string
  promedio_accuracy: string
}

export interface PredictionsByDatasetRow {
  dataset_origen: string
  total_predicciones: string
  promedio_output: string
}

export interface TopModelWeeklyRow {
  modelo_id: string
  modelo_nombre: string
  total_peticiones: string
  latencia_promedio: string
}
