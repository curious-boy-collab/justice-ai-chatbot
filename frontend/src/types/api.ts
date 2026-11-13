export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  service: string
  version: string
  dependencies?: {
    aiModule?: boolean
    geminiConfigured?: boolean
    vectorStore?: {
      status?: string
      vectorCount?: number
      dimensions?: number
    }
    documentService?: {
      documentCount?: number
      totalChunks?: number
    }
  }
}

export interface NjdgAggregate {
  totalPendingCases: number
  civilCases: number
  criminalCases: number
  civilPercentage: number
  criminalPercentage: number
}

export interface NjdgAgeBracket {
  bracket: string
  count: number
  percentage: number
}

export interface NjdgCourtLevel {
  pending: number
  civil?: number
  criminal?: number
  disposedLastMonth: number
}

export interface NjdgStatsResponse {
  success: boolean
  asOfDate: string
  source: string
  sourceUrl: string
  isOfficialReport: boolean
  aggregate: NjdgAggregate
  ageWisePendency: NjdgAgeBracket[]
  courtLevelBreakdown: {
    supremeCourt: NjdgCourtLevel
    highCourtsTotal: NjdgCourtLevel
    districtCourtsTotal: NjdgCourtLevel
  }
  timestamp: string
}

export interface CourtJudgeSummary {
  courtName?: string
  courtCount?: number
  sanctioned: number
  working: number
  vacancies: number
  constitutionalProvision?: string
  administeredBy?: string
}

export interface HighCourtVacancyItem {
  court: string
  sanctioned: number
  working: number
  vacancies: number
}

export interface JudgeStatsResponse {
  success: boolean
  asOfDate: string
  source: string
  sourceUrl: string
  summary: {
    supremeCourt: CourtJudgeSummary
    highCourtsTotal: CourtJudgeSummary
    districtAndSubordinateCourtsTotal: CourtJudgeSummary
  }
  topHighCourtVacancies: HighCourtVacancyItem[]
  timestamp: string
}

export interface ParsedCNR {
  stateCode: string
  courtCode: string
  caseNumber: string
  filingYear: string
}

export interface CaseLookupResponse {
  success: boolean
  cnr: string
  isValidCnrFormat: boolean
  parsed: ParsedCNR
  isLive: boolean
  disclaimer: string
  officialPortalUrl: string
  timestamp: string
}

export interface DocumentItem {
  id: string
  title: string
  path: string
  format: string
  category: string
  division: string
  sourceUrl: string
  wordCount: number
  chunkCount: number
  lastUpdated: string
}

export interface KnowledgeStatsResponse {
  success: boolean
  documentCount: number
  totalChunks: number
  categories: string[]
  totalWordCount: number
  timestamp: string
}
