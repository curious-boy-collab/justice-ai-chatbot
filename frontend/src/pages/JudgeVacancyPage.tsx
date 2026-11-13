import { useState, useEffect, useCallback } from 'react'
import {
  Users, AlertTriangle, ExternalLink, ArrowLeft,
  TrendingDown, Scale, Building2, Gavel, Info, RefreshCw, CheckCircle2
} from 'lucide-react'
import { fetchJudgeStats } from '../services/apiClient'
import type { JudgeStatsResponse } from '../types/api'
import Footer from '../components/Layout/Footer'

interface JudgeVacancyPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const FALLBACK_JUDGE_STATS: JudgeStatsResponse = {
  success: true,
  asOfDate: '2026-03-01',
  source: 'Department of Justice, Ministry of Law & Justice, Government of India',
  sourceUrl: 'https://doj.gov.in/appointments-of-judges/',
  summary: {
    supremeCourt: {
      courtName: 'Supreme Court of India',
      sanctioned: 34,
      working: 33,
      vacancies: 1,
      constitutionalProvision: 'Article 124 of Constitution of India',
    },
    highCourtsTotal: {
      courtCount: 25,
      sanctioned: 1114,
      working: 778,
      vacancies: 336,
      constitutionalProvision: 'Article 217 of Constitution of India',
    },
    districtAndSubordinateCourtsTotal: {
      sanctioned: 25200,
      working: 19850,
      vacancies: 5350,
      administeredBy: 'Respective High Courts and State Governments (Article 233-235)',
    },
  },
  topHighCourtVacancies: [
    { court: 'Allahabad High Court', sanctioned: 160, working: 89, vacancies: 71 },
    { court: 'Bombay High Court', sanctioned: 94, working: 66, vacancies: 28 },
    { court: 'Calcutta High Court', sanctioned: 72, working: 50, vacancies: 22 },
    { court: 'Punjab & Haryana High Court', sanctioned: 85, working: 55, vacancies: 30 },
    { court: 'Madras High Court', sanctioned: 75, working: 63, vacancies: 12 },
    { court: 'Delhi High Court', sanctioned: 60, working: 44, vacancies: 16 },
  ],
  timestamp: new Date().toISOString(),
}

export default function JudgeVacancyPage({ onBack, onStartChat }: JudgeVacancyPageProps) {
  const [data, setData] = useState<JudgeStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiveApi, setIsLiveApi] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetchJudgeStats()
      setData(response)
      setIsLiveApi(true)
    } catch (err: unknown) {
      console.warn('Judge stats API offline, using official baseline:', err)
      setData(FALLBACK_JUDGE_STATS)
      setIsLiveApi(false)
      const msg = err instanceof Error ? err.message : 'Backend unreachable'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const stats = data || FALLBACK_JUDGE_STATS

  const tiers = [
    {
      name: stats.summary.supremeCourt.courtName || 'Supreme Court of India',
      icon: Scale,
      sanctioned: stats.summary.supremeCourt.sanctioned,
      working: stats.summary.supremeCourt.working,
      vacancy: stats.summary.supremeCourt.vacancies,
      color: '#0a1f44',
      sourceUrl: 'https://main.sci.gov.in',
      sourceLabel: 'Supreme Court of India',
      note: stats.summary.supremeCourt.constitutionalProvision || 'Chief Justice of India + 33 Judges',
    },
    {
      name: `High Courts (All ${stats.summary.highCourtsTotal.courtCount || 25})`,
      icon: Building2,
      sanctioned: stats.summary.highCourtsTotal.sanctioned,
      working: stats.summary.highCourtsTotal.working,
      vacancy: stats.summary.highCourtsTotal.vacancies,
      color: '#1a3f7c',
      sourceUrl: stats.sourceUrl,
      sourceLabel: 'doj.gov.in vacancy list',
      note: stats.summary.highCourtsTotal.constitutionalProvision || 'Appointed under Article 217',
    },
    {
      name: 'District & Subordinate Courts',
      icon: Gavel,
      sanctioned: stats.summary.districtAndSubordinateCourtsTotal.sanctioned,
      working: stats.summary.districtAndSubordinateCourtsTotal.working,
      vacancy: stats.summary.districtAndSubordinateCourtsTotal.vacancies,
      color: '#102e68',
      sourceUrl: 'https://doj.gov.in',
      sourceLabel: 'Department of Justice',
      note: stats.summary.districtAndSubordinateCourtsTotal.administeredBy || 'State Judicial Services (Art. 233-235)',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      {/* Header */}
      <div className="bg-[#0a1f44] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-[#ff9933] rounded-xl p-3 flex-shrink-0">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Judge Strength &amp; Vacancy Report</h1>
                <p className="text-blue-200 text-sm mt-1">
                  Official sanctioned vs. working strength across Higher and Subordinate Judiciary
                </p>
              </div>
            </div>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#102e68] hover:bg-[#1a3f7c] text-blue-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 self-start md:self-auto"
              title="Refresh judge statistics from backend API"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Fetching...' : 'Refresh Status'}
            </button>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className={`border-b ${isLiveApi ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isLiveApi ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-emerald-900 text-sm font-medium">
                  <strong>Live Backend API Connected:</strong> Official DoJ report as of {stats.asOfDate}.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span className="text-orange-900 text-sm font-medium">
                  <strong>Reference Data:</strong> {errorMessage ? `(${errorMessage})` : 'Baseline records'}. Verify official statements at doj.gov.in.
                </span>
              </>
            )}
          </div>
          <a
            href={stats.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 hover:text-[#ff9933] font-semibold flex items-center gap-1"
          >
            Official DoJ Statements
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Loading skeleton */}
        {isLoading && !data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 h-56" />
            ))}
          </div>
        )}

        {/* Key vacancy cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0a1f44]">Judicial Strength by Court Tier</h2>
            <span className="text-xs text-gray-500">As of: {stats.asOfDate}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((c) => {
              const Icon = c.icon
              const vacancyPct = c.sanctioned > 0 ? Math.round((c.vacancy / c.sanctioned) * 100) : 0
              const fillPct = c.sanctioned > 0 ? Math.round((c.working / c.sanctioned) * 100) : 0
              return (
                <div
                  key={c.name}
                  className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="p-2.5 rounded-lg"
                      style={{ backgroundColor: c.color + '15' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: c.color }} />
                    </div>
                    <div>
                      <div className="font-bold text-[#0a1f44] text-sm">{c.name}</div>
                      <div className="text-xs text-gray-400">{c.note}</div>
                    </div>
                  </div>

                  {/* Strength bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                      <span>Working: <strong className="text-[#0a1f44]">{c.working.toLocaleString('en-IN')}</strong></span>
                      <span>Sanctioned: <strong>{c.sanctioned.toLocaleString('en-IN')}</strong></span>
                    </div>
                    <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${fillPct}%`,
                          backgroundColor: fillPct > 85 ? '#138808' : fillPct > 70 ? '#ff9933' : '#c0392b',
                        }}
                      />
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1.5 flex justify-between">
                      <span>{fillPct}% capacity filled</span>
                      <span>{100 - fillPct}% vacant</span>
                    </div>
                  </div>

                  {/* Vacancy badge */}
                  <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700 font-semibold">{c.vacancy.toLocaleString('en-IN')} Vacancies</span>
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{vacancyPct}%</span>
                  </div>

                  <a
                    href={c.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3.5 flex items-center gap-1 text-xs text-blue-600 hover:text-[#ff9933] transition-colors font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {c.sourceLabel}
                  </a>
                </div>
              )
            })}
          </div>
        </div>

        {/* HC breakdown table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0a1f44]">High Court Vacancy Roster</h2>
              <p className="text-xs text-gray-500 mt-0.5">Top high courts with significant sanctioned posts &amp; vacancies</p>
            </div>
            <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full">
              DoJ Roster
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f0f4fb]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">High Court</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Sanctioned</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Working</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Vacancies</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Fill %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.topHighCourtVacancies.map((row) => {
                  const fill = Math.round((row.working / row.sanctioned) * 100)
                  return (
                    <tr key={row.court} className="hover:bg-[#f8fafd] transition-colors">
                      <td className="px-6 py-3.5 font-medium text-[#0a1f44]">{row.court}</td>
                      <td className="px-4 py-3.5 text-right text-gray-600 font-medium">{row.sanctioned}</td>
                      <td className="px-4 py-3.5 text-right text-emerald-700 font-semibold">{row.working}</td>
                      <td className="px-4 py-3.5 text-right text-red-600 font-semibold">{row.vacancies}</td>
                      <td className="px-6 py-3.5 text-right">
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: fill > 85 ? '#dcfce7' : fill > 70 ? '#fff7ed' : '#fee2e2',
                            color: fill > 85 ? '#166534' : fill > 70 ? '#c2410c' : '#991b1b',
                          }}
                        >
                          {fill}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointment Process Info */}
        <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-5 flex gap-3.5">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-900 text-sm mb-1">Judicial Appointments &amp; Collegium System</div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Judges of the Supreme Court and High Courts are appointed by the President of India pursuant to Articles 124 and 217 of the Constitution, following recommendations initiated by the Supreme Court Collegium and respective High Court Collegiums under the Memorandum of Procedure (MoP).
            </p>
            <div className="mt-2.5 flex flex-wrap gap-4 text-xs font-medium">
              <a
                href="https://doj.gov.in/appointments-of-judges/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-[#ff9933] inline-flex items-center gap-1"
              >
                DoJ Appointment Procedures
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://main.sci.gov.in/collegium-resolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-[#ff9933] inline-flex items-center gap-1"
              >
                Supreme Court Collegium Resolutions
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Chat CTA */}
        <div className="bg-[#0a1f44] rounded-2xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-1">Have questions about judge appointments or collegium rules?</h2>
          <p className="text-blue-200 text-sm mb-4">Ask JusticeAI for detailed legal explanations and official citations.</p>
          <button
            onClick={() => onStartChat('What are the current judge vacancies in India?')}
            className="inline-flex items-center gap-2 bg-[#ff9933] hover:bg-[#e8871a] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-md text-sm"
          >
            Ask JusticeAI About Vacancies
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
