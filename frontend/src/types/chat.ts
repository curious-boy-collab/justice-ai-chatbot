export type Language = 'en' | 'hi'

export type DataStatus =
  | 'official_reference'
  | 'live_api_reference'
  | 'procedural_guidance'
  | 'demo'

export interface Source {
  title: string
  url: string
  label?: string
  category?: string
  snippet?: string
  relevanceScore?: number
}

export interface RetrievalInfo {
  documentCount?: number
  chunksRetrieved?: number
  strategy?: string
  confidence?: string
  confidenceScore?: number
}

export interface DataFreshness {
  lastUpdated?: string
  sourceStatus?: string
  asOfDate?: string
  cacheStatus?: string
  disclaimer?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: Source[]
  dataStatus?: DataStatus
  lastChecked?: string
  retrieval?: RetrievalInfo
  dataFreshness?: DataFreshness
  suggestedQuestions?: string[]
  isError?: boolean
  isNoResults?: boolean
}

export interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  language: Language
  messages: Message[]
}

export interface ChatRequest {
  query: string
  language: Language
  sessionId?: string
}

export interface AIResponsePayload {
  answer?: string
  reply?: string
  language?: Language
  sources?: Source[]
  citations?: Source[]
  dataStatus?: DataStatus
  lastChecked?: string
  retrieval?: RetrievalInfo
  dataFreshness?: DataFreshness
  suggestedQuestions?: string[]
  isLive?: boolean
  success?: boolean
}

export interface APIErrorResponse {
  error: {
    code: string
    message: string
    language?: Language
  }
}
