import {
  BarChart3, ExternalLink, AlertTriangle, TrendingUp,
  TrendingDown, Scale, Building2, Gavel, ArrowLeft
} from 'lucide-react'

interface NJDGDashboardProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const courtStats = [
  {
    court: 'Supreme Court of India',
    icon: Scale,
    pending: '80,765',
    disposed: '55,432',
    filed: '61,284',
    color: '#0a1f44',
  },
  {
    court: 'High Courts (25)',
    icon: Building2,
    pending: '61,23,418',
    disposed: '24,56,789',
    filed: '25,98,241',
    color: '#1a3f7c',
  },
  {
    court: 'District & Sub. Courts',
    icon: Gavel,
    pending: '4,43,27,980',
    disposed: '1,32,45,678',
    filed: '1,38,56,124',
    color: '#102e68',
  },
  {
    court: 'Fast Track Special Courts',
    icon: TrendingUp,
    pending: '2,34,567',
    disposed: '1,45,234',
    filed: '98,432',
    color: '#138808',
  },
]

const agingData = [
  { label: 'Under 1 year', percent: 28, color: '#138808' },
  { label: '1–5 years', percent: 35, color: '#ff9933' },
  { label: '5–10 years', percent: 22, color: '#dc6b1a' },
  { label: '10–20 years', percent: 11, color: '#c0392b' },
  { label: 'Over 20 years', percent: 4, color: '#7b241c' },
]

export default function NJDGDashboard({ onBack, onStartChat }: NJDGDashboardProps) {
  return (
    <div className="min-h-screen bg-[#f8fafd]">
      {/* Page header */}
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
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">NJDG Case Pendency Dashboard</h1>
              <p className="text-blue-200 text-sm mt-1">
                National Judicial Data Grid — Indicative statistics for judicial transparency
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo data banner */}
      <div className="bg-orange-50 border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-orange-700 text-sm">
            <strong>⚠️ Demo Data Only</strong> — These figures are illustrative and do NOT represent live government data.
            Visit{' '}
            <a
              href="https://njdg.ecourts.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              njdg.ecourts.gov.in
            </a>{' '}
            for real-time official statistics.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Summary stat cards */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">Court-wise Pendency Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courtStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.court}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: stat.color + '15' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Demo</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{stat.court}</div>
                  <div className="text-2xl font-bold text-[#0a1f44] mb-3">{stat.pending}</div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Disposed</span>
                      <span className="text-green-600 font-medium">{stat.disposed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Filed</span>
                      <span className="text-blue-600 font-medium">{stat.filed}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Case aging breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#0a1f44]">Case Age Distribution</h2>
              <p className="text-sm text-gray-500">District & Subordinate Courts — illustrative breakdown</p>
            </div>
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              ⚠️ Demo Data
            </span>
          </div>
          <div className="space-y-4">
            {agingData.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="font-bold" style={{ color: item.color }}>{item.percent}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Source: illustrative data based on NJDG reporting structure. Verify actuals at njdg.ecourts.gov.in.
          </p>
        </div>

        {/* Court-wise breakdown table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0a1f44]">High Court-wise Summary</h2>
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              ⚠️ Demo Data
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f0f4fb]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">High Court</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pending</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Filed</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Disposed</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'Allahabad', pending: '10,23,456', filed: '4,56,789', disposed: '4,12,344', up: true },
                  { name: 'Bombay', pending: '3,21,789', filed: '1,98,234', disposed: '1,87,654', up: false },
                  { name: 'Delhi', pending: '1,87,432', filed: '98,765', disposed: '1,02,345', up: false },
                  { name: 'Calcutta', pending: '2,34,567', filed: '1,23,456', disposed: '1,10,234', up: true },
                  { name: 'Madras', pending: '1,54,321', filed: '87,654', disposed: '90,123', up: false },
                  { name: 'Karnataka', pending: '1,23,456', filed: '65,432', disposed: '71,234', up: false },
                  { name: 'Gujarat', pending: '98,765', filed: '54,321', disposed: '56,789', up: true },
                  { name: 'Rajasthan', pending: '87,654', filed: '45,678', disposed: '48,901', up: false },
                ].map((hc) => (
                  <tr key={hc.name} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="px-6 py-3 font-medium text-[#0a1f44]">{hc.name} HC</td>
                    <td className="px-4 py-3 text-right text-gray-700">{hc.pending}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{hc.filed}</td>
                    <td className="px-4 py-3 text-right text-green-600">{hc.disposed}</td>
                    <td className="px-6 py-3 text-right">
                      {hc.up
                        ? <TrendingUp className="w-4 h-4 text-red-400 inline" />
                        : <TrendingDown className="w-4 h-4 text-green-500 inline" />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-orange-50 border-t border-orange-100 text-xs text-orange-600">
            ⚠️ All figures above are illustrative demo data. For official court-wise data, visit{' '}
            <a href="https://njdg.ecourts.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
              njdg.ecourts.gov.in
            </a>
          </div>
        </div>

        {/* Official links */}
        <div className="bg-[#0a1f44] rounded-xl p-6 text-white">
          <h2 className="font-bold text-lg mb-4">Official NJDG Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'NJDG Live Dashboard', url: 'https://njdg.ecourts.gov.in', desc: 'Real-time national judicial data' },
              { label: 'eCourts Portal', url: 'https://ecourts.gov.in', desc: 'Case status, cause lists & more' },
              { label: 'Ask JusticeAI', url: '#', desc: 'Chat for data interpretation', action: () => onStartChat('Explain NJDG statistics and case pendency data') },
            ].map((link) => (
              link.action
                ? (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="flex items-start gap-3 bg-[#102e68] hover:bg-[#1a3f7c] rounded-xl p-4 transition-colors text-left"
                  >
                    <ExternalLink className="w-5 h-5 text-[#ff9933] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{link.label}</div>
                      <div className="text-xs text-blue-200 mt-0.5">{link.desc}</div>
                    </div>
                  </button>
                )
                : (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 bg-[#102e68] hover:bg-[#1a3f7c] rounded-xl p-4 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-[#ff9933] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{link.label}</div>
                      <div className="text-xs text-blue-200 mt-0.5">{link.desc}</div>
                    </div>
                  </a>
                )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
