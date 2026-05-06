const API_URL = import.meta.env.VITE_API_URL ?? 'https://91ka2ysb93.execute-api.us-east-1.amazonaws.com'

export const API_BASE_URLS = {
  ms1: `${API_URL}/features`,
  ms2: `${API_URL}/models`,
  ms3: `${API_URL}/predlogs`,
  ms4: `${API_URL}/gateway`,
  ms5: `${API_URL}/monitoring`,
}

export const PAGE_SIZE = 15

export const FRAMEWORKS = ['pytorch', 'tensorflow', 'sklearn', 'xgboost', 'lightgbm']

export const TIPO_DATOS = ['float64', 'int64', 'string', 'bool', 'datetime']

export const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  success: { bg: 'var(--green-dim)', text: 'var(--green)' },
  error:   { bg: 'var(--red-dim)',   text: 'var(--red)' },
  timeout: { bg: 'var(--amber-dim)', text: 'var(--amber)' },
}
