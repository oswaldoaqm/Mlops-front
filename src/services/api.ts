import axios, { AxiosInstance } from 'axios'
import { API_BASE_URLS } from '@/constants'
import type {
  DatasetPage, FeaturePage,
  SpringPage, Modelo, Metrica,
  PredLogsPage, PredLogStats,
  InferenceRequest, InferenceResult,
  BatchRequest, BatchResult,
  DataDriftRow, FrameworkAccuracyRow,
  PredictionsByDatasetRow, TopModelWeeklyRow,
} from '@/types'

class APIService {
  private clients: Record<string, AxiosInstance>

  constructor() {
    this.clients = {
      ms1: axios.create({ baseURL: API_BASE_URLS.ms1, timeout: 10000 }),
      ms2: axios.create({ baseURL: API_BASE_URLS.ms2, timeout: 10000 }),
      ms3: axios.create({ baseURL: API_BASE_URLS.ms3, timeout: 10000 }),
      ms4: axios.create({ baseURL: API_BASE_URLS.ms4, timeout: 10000 }),
      ms5: axios.create({ baseURL: API_BASE_URLS.ms5, timeout: 30000 }),
    }
  }

  // ── MS1: Datasets ──────────────────────────────────────────
  async getDatasets(page = 1, size = 15, activo?: boolean, dominio?: string): Promise<DatasetPage> {
    try {
      const params: Record<string, any> = { page, size }
      if (activo !== undefined) params.activo = activo
      if (dominio) params.dominio = dominio
      const r = await this.clients.ms1.get('/api/datasets', { params })
      return r.data
    } catch { return { total: 0, page, size, items: [] } }
  }

  async createDataset(body: { nombre: string; dominio: string; descripcion?: string; activo?: boolean }) {
    const r = await this.clients.ms1.post('/api/datasets', body)
    return r.data
  }

  async updateDataset(id: number, body: Partial<{ nombre: string; dominio: string; descripcion: string; activo: boolean }>) {
    const r = await this.clients.ms1.put(`/api/datasets/${id}`, body)
    return r.data
  }

  async deleteDataset(id: number) {
    const r = await this.clients.ms1.delete(`/api/datasets/${id}`)
    return r.data
  }

  // ── MS1: Features ──────────────────────────────────────────
  async getFeatures(page = 1, size = 15, tipo_dato?: string): Promise<FeaturePage> {
    try {
      const params: Record<string, any> = { page, size }
      if (tipo_dato) params.tipo_dato = tipo_dato
      const r = await this.clients.ms1.get('/api/features', { params })
      return r.data
    } catch { return { total: 0, page, size, items: [] } }
  }

  async getFeaturesByDataset(datasetId: number, page = 1, size = 15): Promise<FeaturePage> {
    try {
      const r = await this.clients.ms1.get(`/api/features/dataset/${datasetId}`, { params: { page, size } })
      return r.data
    } catch { return { total: 0, page, size, items: [] } }
  }

  async createFeature(body: { nombre_variable: string; tipo_dato: string; descripcion?: string; es_categorica?: boolean; dataset_id: number }) {
    const r = await this.clients.ms1.post('/api/features', body)
    return r.data
  }

  async deleteFeature(id: number) {
    const r = await this.clients.ms1.delete(`/api/features/${id}`)
    return r.data
  }

  // ── MS2: Modelos ───────────────────────────────────────────
  async getModelos(page = 0, size = 15, activo?: boolean, framework?: string): Promise<SpringPage<Modelo>> {
    try {
      const params: Record<string, any> = { page, size }
      if (activo !== undefined) params.activo = activo
      if (framework) params.framework = framework
      const r = await this.clients.ms2.get('/api/modelos', { params })
      return r.data
    } catch { return { content: [], totalElements: 0, totalPages: 0, number: page, size } }
  }

  async createModelo(body: { nombre: string; framework: string; version: string; descripcion?: string; activo?: boolean }) {
    const r = await this.clients.ms2.post('/api/modelos', body)
    return r.data
  }

  async updateModelo(id: number, body: Partial<{ nombre: string; framework: string; version: string; descripcion: string; activo: boolean }>) {
    const r = await this.clients.ms2.put(`/api/modelos/${id}`, body)
    return r.data
  }

  async softDeleteModelo(id: number) {
    const r = await this.clients.ms2.delete(`/api/modelos/${id}`)
    return r.data
  }

  // ── MS2: Métricas ──────────────────────────────────────────
  async getMetricas(page = 0, size = 15): Promise<SpringPage<Metrica>> {
    try {
      const r = await this.clients.ms2.get('/api/metricas', { params: { page, size } })
      return r.data
    } catch { return { content: [], totalElements: 0, totalPages: 0, number: page, size } }
  }

  async getMetricasByModelo(modeloId: number, page = 0, size = 15): Promise<SpringPage<Metrica>> {
    try {
      const r = await this.clients.ms2.get(`/api/metricas/modelo/${modeloId}`, { params: { page, size } })
      return r.data
    } catch { return { content: [], totalElements: 0, totalPages: 0, number: page, size } }
  }

  async createMetrica(body: { tipoMetrica: string; valorMetrica: number; datasetEvaluacion?: string; notas?: string; modeloId: number }) {
    const r = await this.clients.ms2.post('/api/metricas', body)
    return r.data
  }

  async deleteMetrica(id: number) {
    const r = await this.clients.ms2.delete(`/api/metricas/${id}`)
    return r.data
  }

  // ── MS3: PredLogs ──────────────────────────────────────────
  async getPredLogs(page = 1, limit = 15, estado?: string, modelo_id?: number): Promise<PredLogsPage> {
    try {
      const params: Record<string, any> = { page, limit }
      if (estado) params.estado = estado
      if (modelo_id) params.modelo_id = modelo_id
      const r = await this.clients.ms3.get('/api/predlogs', { params })
      return r.data
    } catch { return { total: 0, page, limit, items: [] } }
  }

  async getPredLogsByModelo(modeloId: number, page = 1, limit = 15): Promise<PredLogsPage> {
    try {
      const r = await this.clients.ms3.get(`/api/predlogs/modelo/${modeloId}`, { params: { page, limit } })
      return r.data
    } catch { return { total: 0, page, limit, items: [] } }
  }

  async getPredLogStats(): Promise<PredLogStats | null> {
    try {
      const r = await this.clients.ms3.get('/api/predlogs/stats/summary')
      return r.data
    } catch { return null }
  }

  async deletePredLog(id: string) {
    const r = await this.clients.ms3.delete(`/api/predlogs/${id}`)
    return r.data
  }

  // ── MS4: Inference Gateway ─────────────────────────────────
  async runInference(req: InferenceRequest): Promise<InferenceResult> {
    const r = await this.clients.ms4.post('/api/inference/predict', req)
    return r.data
  }

  async runBatchInference(req: BatchRequest): Promise<BatchResult> {
    const r = await this.clients.ms4.post('/api/inference/batch', req)
    return r.data
  }

  async getGatewayHealth() {
    try {
      const r = await this.clients.ms4.get('/api/inference/health')
      return r.data
    } catch { return null }
  }

  // ── MS5: Monitoring (Athena) ───────────────────────────────
  async getDataDrift(): Promise<DataDriftRow[]> {
    try {
      const r = await this.clients.ms5.get('/api/monitoring/data-drift')
      return r.data?.results ?? []
    } catch { return [] }
  }

  async getFrameworkAccuracy(): Promise<FrameworkAccuracyRow[]> {
    try {
      const r = await this.clients.ms5.get('/api/monitoring/framework-accuracy')
      return r.data?.results ?? []
    } catch { return [] }
  }

  async getPredictionsByDataset(): Promise<PredictionsByDatasetRow[]> {
    try {
      const r = await this.clients.ms5.get('/api/monitoring/predictions-by-dataset')
      return r.data?.results ?? []
    } catch { return [] }
  }

  async getTopModelsWeekly(): Promise<TopModelWeeklyRow[]> {
    try {
      const r = await this.clients.ms5.get('/api/monitoring/top-models-weekly')
      return r.data?.results ?? []
    } catch { return [] }
  }

  // ── Health checks ──────────────────────────────────────────
  async checkHealth(service: keyof typeof API_BASE_URLS) {
    try {
      const endpoints: Record<string, string> = {
        ms1: '/health', ms2: '/actuator/health',
        ms3: '/health', ms4: '/health', ms5: '/health',
      }
      const r = await this.clients[service].get(endpoints[service], { timeout: 3000 })
      return r.status === 200 ? 'ok' : 'degraded'
    } catch { return 'unreachable' }
  }
}

export const apiService = new APIService()
