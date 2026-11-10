export type Language = 'en' | 'hi'

export type DataStatus =
  | 'official_reference'
  | 'live_api_reference'
  | 'procedural_guidance'
  | 'demo'

export interface Source {
  title: string
  url: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: Source[]
  dataStatus?: DataStatus
  lastChecked?: string
  isError?: boolean
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
  answer: string
  language: Language
  sources: Source[]
  dataStatus: DataStatus
  lastChecked: string
}

export interface APIErrorResponse {
  error: {
    code: string
    message: string
    language?: Language
  }
}
