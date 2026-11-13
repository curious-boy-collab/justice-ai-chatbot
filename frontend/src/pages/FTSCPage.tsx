import {
  Gavel, ArrowLeft, ExternalLink, AlertTriangle,
  MapPin, Shield, Users, BarChart3, CheckCircle, Info
} from 'lucide-react'
import Footer from '../components/Layout/Footer'

interface FTSCPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const ftscStats = [
  { label: 'Total FTSCs Operational', value: '761', color: '#138808' },
  { label: 'Exclusive POCSO Courts', value: '414', color: '#ff9933' },
  { label: 'States & UTs Covered', value: '28', color: '#0a1f44' },
  { label: 'Cases Disposed', value: '2,34,567+', color: '#1a3f7c' },
]

const stateData = [
  { state: 'Uttar Pradesh', ftsc: 124, pocso: 62 },
  { state: 'Madhya Pradesh', ftsc: 84, pocso: 42 },
  { state: 'Maharashtra', ftsc: 72, pocso: 36 },
  { state: 'Rajasthan', ftsc: 58, pocso: 29 },
  { state: 'Bihar', ftsc: 52, pocso: 26 },
  { state: 'West Bengal', ftsc: 48, pocso: 24 },
  { state: 'Tamil Nadu', ftsc: 44, pocso: 22 },
  { state: 'Karnataka', ftsc: 40, pocso: 20 },
]

export default function FTSCPage({ onBack, onStartChat }: FTSCPageProps) {
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
          <div className="flex items-start gap-4">
            <div className="bg-[#138808] rounded-xl p-3 flex-shrink-0">
              <Gavel className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Fast Track Special Courts</h1>
              <p className="text-blue-200 text-sm mt-1">
                Expeditious trial and disposal of cases related to POCSO Act and sexual offences
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
            <strong>⚠️ Demo Data Only</strong> — All statistics are illustrative. Verify official figures at{' '}
            <a href="https://doj.gov.in/fast-track-special-court-ftsc/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
              doj.gov.in
            </a>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ftscStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              <span className="inline-block mt-2 text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                Demo
              </span>
            </div>
          ))}
        </div>

        {/* About FTSC */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">About Fast Track Special Courts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#0a1f44] text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#ff9933]" /> Purpose
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                FTSCs were established by the Government of India through the Department of Justice to ensure
                time-bound trial and disposal of cases related to:
              </p>
              <ul className="space-y-2">
                {[
                  'Rape and sexual offences against women',
                  'POCSO Act cases (Protection of Children from Sexual Offences)',
                  'Heinous crimes with sentences of 7+ years imprisonment',
                  'Cases pending for more than 5 years',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#138808] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#0a1f44] text-sm mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#ff9933]" /> Key Features
              </h3>
              <ul className="space-y-2">
                {[
                  'Centrally Sponsored Scheme with 60:40 cost sharing (Centre:State)',
                  'Presided by Judicial Officers with 7+ years experience',
                  'Target disposal within 2 months from chargesheet filing',
                  'Video conferencing enabled for witness testimony',
                  'Victim and witness protection measures',
                  'Monthly monitoring by High Court committees',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* State-wise table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0a1f44]">State-wise FTSC Distribution</h2>
              <p className="text-xs text-gray-400 mt-0.5">Top 8 states by number of operational FTSCs</p>
            </div>
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              ⚠️ Demo Data
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f0f4fb]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">State</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total FTSCs</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Exclusive POCSO</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stateData.map((row) => (
                  <tr key={row.state} className="hover:bg-[#f8fafd] transition-colors">
                    <td className="px-6 py-3 font-medium text-[#0a1f44] flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-400" /> {row.state}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 font-semibold">{row.ftsc}</td>
                    <td className="px-4 py-3 text-right text-[#ff9933] font-semibold">{row.pocso}</td>
                    <td className="px-6 py-3 text-right text-xs text-gray-500">
                      {Math.round((row.ftsc / 761) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-800 text-sm mb-1">POCSO Act — Key Information</div>
            <p className="text-sm text-blue-700">
              The Protection of Children from Sexual Offences (POCSO) Act, 2012 provides a comprehensive framework
              for protection of children from offences of sexual assault, sexual harassment, and pornography. FTSCs with
              exclusive POCSO jurisdiction ensure these sensitive cases are tried expeditiously by trained judicial officers
              in a child-friendly court environment.
            </p>
          </div>
        </div>

        {/* Official link + CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://doj.gov.in/fast-track-special-court-ftsc/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <Gavel className="w-6 h-6 text-[#138808]" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[#0a1f44] text-sm">Official FTSC Page — DoJ</div>
              <div className="text-xs text-gray-500">doj.gov.in/fast-track-special-court-ftsc/</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors" />
          </a>
          <div className="bg-[#0a1f44] rounded-xl p-5 text-white flex items-center gap-4">
            <Users className="w-8 h-8 text-[#ff9933] flex-shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-sm mb-1">Have questions about FTSCs?</div>
              <button
                onClick={() => onStartChat('Tell me about Fast Track Special Courts and POCSO')}
                className="text-xs text-blue-200 hover:text-[#ff9933] transition-colors underline"
              >
                Ask JusticeAI →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
