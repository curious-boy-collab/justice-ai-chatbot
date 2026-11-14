import type {
  HealthResponse,
  NjdgStatsResponse,
  JudgeStatsResponse,
  CaseLookupResponse,
  DocumentItem,
  KnowledgeStatsResponse
} from '../types/api'

export class ApiError extends Error {
  public status: number
  public code?: string
  public isNetworkError?: boolean

  constructor(message: string, status = 500, code?: string, isNetworkError = false) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.isNetworkError = isNetworkError
  }
}

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '/api'

const DEFAULT_TIMEOUT_MS = 15000

/**
 * Core HTTP fetch wrapper with timeout, JSON parsing, and unified error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      signal: options.signal || controller.signal,
    })

    clearTimeout(timeoutId)

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const payload = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const errorMessage =
        (typeof payload === 'object' && payload?.error?.message) ||
        (typeof payload === 'object' && payload?.message) ||
        `Request failed with status ${response.status}`
      const errorCode = (typeof payload === 'object' && payload?.error?.code) || undefined
      throw new ApiError(errorMessage, response.status, errorCode)
    }

    if (!isJson) {
      throw new ApiError('Unexpected non-JSON response from server', response.status)
    }

    return payload as T
  } catch (error: unknown) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. The judicial server took too long to respond.', 408, 'REQUEST_TIMEOUT')
    }

    const message = error instanceof Error ? error.message : 'Network error or backend unreachable'
    throw new ApiError(message, 0, 'NETWORK_ERROR', true)
  }
}

/**
 * Health check endpoint
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health')
}

/**
 * Official NJDG pendency and court level breakdown statistics
 */
export async function fetchNjdgStats(): Promise<NjdgStatsResponse> {
  return apiRequest<NjdgStatsResponse>('/stats/njdg')
}

/**
 * Official Judge sanctioned strength and vacancy numbers
 */
export async function fetchJudgeStats(): Promise<JudgeStatsResponse> {
  return apiRequest<JudgeStatsResponse>('/stats/judges')
}

/**
 * Case Number Record (CNR) lookup & structural verification
 */
export async function lookupCaseByCNR(cnr: string): Promise<CaseLookupResponse> {
  const cleanCnr = encodeURIComponent(cnr.trim().toUpperCase())
  try {
    return await apiRequest<CaseLookupResponse>(`/cases/lookup?cnr=${cleanCnr}`)
  } catch (err: unknown) {
    const raw = cnr.trim().toUpperCase()
    // When backend is unavailable (e.g. static GitHub Pages), provide client-side CNR verification
    if (raw.length === 16 && /^[A-Z]{4}\d{12}$/.test(raw)) {
      return {
        success: true,
        cnr: raw,
        isValidCnrFormat: true,
        parsed: {
          stateCode: raw.slice(0, 2),
          courtCode: raw.slice(2, 4),
          caseNumber: raw.slice(4, 12),
          filingYear: raw.slice(12, 16),
        },
        isLive: false,
        disclaimer: 'CNR format verified. Live case records require CAPTCHA verification on the official eCourts Services portal.',
        officialPortalUrl: `https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/cnr_search&cnr=${encodeURIComponent(raw)}`,
        timestamp: new Date().toISOString(),
      }
    }
    throw err
  }
}

/**
 * List all official Department of Justice indexed documents
 */
export async function fetchKnowledgeDocuments(): Promise<{ success: boolean; count: number; documents: DocumentItem[] }> {
  return apiRequest<{ success: boolean; count: number; documents: DocumentItem[] }>('/documents')
}

/**
 * Knowledge base metrics (chunks, categories, total words)
 */
export async function fetchKnowledgeStats(): Promise<KnowledgeStatsResponse> {
  return apiRequest<KnowledgeStatsResponse>('/documents/stats')
}
