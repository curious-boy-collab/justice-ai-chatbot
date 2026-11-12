import {
  Users, AlertTriangle, ExternalLink, ArrowLeft,
  TrendingDown, Scale, Building2, Gavel, Info
} from 'lucide-react'

interface JudgeVacancyPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const courtData = [
  {
    name: 'Supreme Court of India',
    icon: Scale,
    sanctioned: 34,
    working: 32,
    vacancy: 2,
    color: '#0a1f44',
    sourceUrl: 'https://main.sci.gov.in',
    sourceLabel: 'Supreme Court of India',
    note: 'Chief Justice of India + 33 Judges',
  },
  {
    name: 'High Courts (All 25)',
    icon: Building2,
    sanctioned: 1114,
    working: 770,
    vacancy: 344,
    color: '#1a3f7c',
    sourceUrl: 'https://doj.gov.in/list-of-high-court-judges/',
    sourceLabel: 'doj.gov.in judge list',
    note: 'Figures across all 25 High Courts',
  },
  {
    name: 'District & Sub. Courts',
    icon: Gavel,
    sanctioned: 25628,
    working: 19152,
    vacancy: 6476,
    color: '#102e68',
    sourceUrl: 'https://doj.gov.in',
    sourceLabel: 'Department of Justice',
    note: 'Includes Judicial Magistrates & CJMs',
  },
]

const topHCVacancies = [
  { hc: 'Allahabad HC', sanctioned: 160, working: 92, vacancy: 68 },
  { hc: 'Bombay HC', sanctioned: 94, working: 65, vacancy: 29 },
  { hc: 'Delhi HC', sanctioned: 60, working: 44, vacancy: 16 },
  { hc: 'Calcutta HC', sanctioned: 72, working: 48, vacancy: 24 },
  { hc: 'Madras HC', sanctioned: 75, working: 55, vacancy: 20 },
  { hc: 'Karnataka HC', sanctioned: 62, working: 48, vacancy: 14 },
  { hc: 'Gujarat HC', sanctioned: 52, working: 40, vacancy: 12 },
  { hc: 'Rajasthan HC', sanctioned: 50, working: 36, vacancy: 14 },
]

export default function JudgeVacancyPage({ onBack, onStartChat }: JudgeVacancyPageProps) {
  return (
    <div className="min-h-screen bg-[#f8fafd]">
      {/* Header */}
      <div className="bg-[#0a1f44] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-start gap-4">
            <div className="bg-[#ff9933] rounded-xl p-3 flex-shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Judge Strength & Vacancy Report</h1>
              <p className="text-blue-200 text-sm mt-1">
                Sanctioned vs working strength across Supreme Court, High Courts and District Courts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo banner */}
      <div className="bg-orange-50 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-orange-700 text-sm">
            <strong>⚠️ Demo Data Only</strong> — All figures shown are illustrative and may differ from official records.
            Verify at{' '}
            <a href="https://doj.gov.in/list-of-high-court-judges/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
              doj.gov.in
            </a>{' '}
            for official sanctioned and working strength.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Key vacancy cards */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">Overall Judicial Strength</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courtData.map((c) => {
              const Icon = c.icon
              const vacancyPct = Math.round((c.vacancy / c.sanctioned) * 100)
              const fillPct = Math.round((c.working / c.sanctioned) * 100)
              return (
                <div
                  key={c.name}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="p-2 rounded-lg"
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
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Working: <strong className="text-[#0a1f44]">{c.working.toLocaleString()}</strong></span>
                      <span>Sanctioned: <strong>{c.sanctioned.toLocaleString()}</strong></span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${fillPct}%`, backgroundColor: fillPct > 85 ? '#138808' : fillPct > 70 ? '#ff9933' : '#c0392b' }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{fillPct}% sanctioned strength filled</div>
                  </div>

                  {/* Vacancy badge */}
                  <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700 font-semibold">{c.vacancy.toLocaleString()} Vacancies</span>
                    </div>
                    <span className="text-xs font-bold text-red-500">{vacancyPct}%</span>
                  </div>

                  <a
                    href={c.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-[#ff9933] transition-colors"
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0a1f44]">High Court Vacancy Detail</h2>
              <p className="text-xs text-gray-400 mt-0.5">Top 8 High Courts by sanctioned strength</p>
            </div>
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              ⚠️ Demo Data
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f0f4fb]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">High Court</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sanctioned</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Working</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vacancies</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fill %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topHCVacancies.map((row) => {
                  const fill = Math.round((row.working / row.sanctioned) * 100)
                  return (
                    <tr key={row.hc} className="hover:bg-[#f8fafd] transition-colors">
                      <td className="px-6 py-3 font-medium text-[#0a1f44]">{row.hc}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{row.sanctioned}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-semibold">{row.working}</td>
                      <td className="px-4 py-3 text-right text-red-500 font-semibold">{row.vacancy}</td>
                      <td className="px-6 py-3 text-right">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
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

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-800 text-sm mb-1">About Judicial Appointments</div>
            <p className="text-sm text-blue-700">
              Supreme Court Judges are appointed by the President of India on the recommendation of the Supreme Court Collegium.
              High Court Judges are appointed by the President on the recommendation of the High Court Collegium and the Government.
              District judges are appointed by the Governor in consultation with the respective High Court.
            </p>
            <a
              href="https://doj.gov.in/appointments-of-judges/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
            >
              <ExternalLink className="w-3 h-3" />
              doj.gov.in — Appointments of Judges
            </a>
          </div>
        </div>

        {/* Chat CTA */}
        <div className="bg-[#0a1f44] rounded-xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-2">Have questions about judge appointments?</h2>
          <p className="text-blue-200 text-sm mb-4">Ask JusticeAI for detailed explanations and official sources.</p>
          <button
            onClick={() => onStartChat('What are the current judge vacancies in India?')}
            className="inline-flex items-center gap-2 bg-[#ff9933] hover:bg-[#e8871a] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Ask JusticeAI
          </button>
        </div>
      </div>
    </div>
  )
}
