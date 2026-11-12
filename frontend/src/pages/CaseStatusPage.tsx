import {
  Search, ArrowLeft, ExternalLink, AlertTriangle,
  CheckCircle, Info, ChevronDown, ChevronUp, Users,
  FileText, Gavel
} from 'lucide-react'
import { useState } from 'react'

interface CaseStatusPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

export default function CaseStatusPage({ onBack, onStartChat }: CaseStatusPageProps) {
  const [cnr, setCnr] = useState('')
  const [cnrError, setCnrError] = useState('')
  const [showCnrGuide, setShowCnrGuide] = useState(false)

  const cnrPattern = /^[A-Z]{4}\d{2}\d{6}\d{4}$/

  const validateAndSearch = () => {
    const cleaned = cnr.toUpperCase().replace(/\s|-/g, '')
    if (!cleaned) {
      setCnrError('Please enter a CNR number')
      return
    }
    if (!cnrPattern.test(cleaned)) {
      setCnrError('Invalid CNR format. Expected: 4 letters + 2 digits + 6 digits + 4 digits (e.g., DLNE010012342024)')
      return
    }
    setCnrError('')
    // Open official eCourts portal for case lookup
    window.open(`https://ecourts.gov.in/ecourts_home/index1.php?action=main`, '_blank')
  }

  const altSearchLinks = [
    {
      icon: Users,
      title: 'Search by Party Name',
      titleHi: 'पार्टी के नाम से खोजें',
      url: 'https://ecourts.gov.in/ecourts_home/index1.php?action=main',
      description: 'Search using petitioner or respondent name',
    },
    {
      icon: FileText,
      title: 'Search by Advocate Name',
      titleHi: 'अधिवक्ता के नाम से खोजें',
      url: 'https://ecourts.gov.in/ecourts_home/index1.php?action=main',
      description: 'Search using advocate enrollment number',
    },
    {
      icon: Gavel,
      title: 'Search by FIR Number',
      titleHi: 'FIR नंबर से खोजें',
      url: 'https://ecourts.gov.in/ecourts_home/index1.php?action=main',
      description: 'Search using FIR number and police station',
    },
    {
      icon: Search,
      title: 'Search by Case Number',
      titleHi: 'केस नंबर से खोजें',
      url: 'https://ecourts.gov.in/ecourts_home/index1.php?action=main',
      description: 'Search using case type, number and year',
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
          <div className="flex items-start gap-4">
            <div className="bg-[#ff9933] rounded-xl p-3 flex-shrink-0">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Case Status Search</h1>
              <p className="text-blue-200 text-sm mt-1">
                Look up case status, hearing dates, and court orders using your CNR number
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Demo notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-orange-700 text-sm">
            <strong>Demo Mode:</strong> This interface demonstrates the search UI. Actual case lookup is performed on{' '}
            <a href="https://ecourts.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
              ecourts.gov.in
            </a>{' '}
            (the official portal).
          </p>
        </div>

        {/* CNR Search box */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#0a1f44] mb-1">Search by CNR Number</h2>
          <p className="text-sm text-gray-500 mb-6">
            The CNR (Case Number Record) is a unique 16-character identifier for every case filed in India.
          </p>

          <div className="max-w-xl">
            <label className="block text-sm font-medium text-[#0a1f44] mb-2">
              Enter CNR Number
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={cnr}
                  onChange={(e) => {
                    setCnr(e.target.value.toUpperCase())
                    setCnrError('')
                  }}
                  placeholder="e.g., DLNE010012342024"
                  maxLength={16}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono uppercase
                             focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent
                             placeholder:text-gray-300"
                />
                {cnrError && (
                  <p className="text-red-500 text-xs mt-1.5">{cnrError}</p>
                )}
              </div>
              <button
                onClick={validateAndSearch}
                className="flex items-center gap-2 bg-[#0a1f44] hover:bg-[#102e68] text-white font-semibold px-6 py-3 rounded-xl transition-colors flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Format: 4 letters (state/district code) + 2 digits (court code) + 6 digits (case serial) + 4 digits (year)
            </p>
          </div>

          {/* How to find CNR */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <button
              onClick={() => setShowCnrGuide(!showCnrGuide)}
              className="flex items-center gap-2 text-sm font-semibold text-[#0a1f44] hover:text-[#ff9933] transition-colors"
            >
              {showCnrGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              How to find your CNR number?
            </button>
            {showCnrGuide && (
              <div className="mt-3 bg-[#f8fafd] rounded-xl p-5 space-y-3">
                {[
                  'Check your case filing receipt — the CNR is printed at the top',
                  'Ask your advocate — they receive the CNR after case registration',
                  'Check SMS alerts — courts send CNR via SMS after filing',
                  'Visit the court counter — ask at the filing counter with your case details',
                  'Use the eCourts app — search by party name to find your CNR',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#138808] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alternative search methods */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">Other Search Methods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {altSearchLinks.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="p-3 bg-[#f0f4fb] rounded-lg">
                    <Icon className="w-5 h-5 text-[#0a1f44]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#0a1f44] text-sm">{item.title}</div>
                    <div className="text-xs text-[#ff9933] font-medium">{item.titleHi}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors flex-shrink-0" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-800 text-sm mb-1">About Case Number Record (CNR)</div>
            <p className="text-sm text-blue-700">
              CNR is a unique 16-character alphanumeric number assigned to each case filed in courts across India
              under the eCourts project. It remains the same throughout the lifetime of a case, even if the case
              is transferred between courts. Example: <span className="font-mono font-bold">DLNE010012342024</span>
            </p>
          </div>
        </div>

        {/* Chat CTA */}
        <div className="bg-[#0a1f44] rounded-xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-2">Need help finding your case?</h2>
          <p className="text-blue-200 text-sm mb-4">Ask JusticeAI how to search for your case status step by step.</p>
          <button
            onClick={() => onStartChat('How do I check my case status?')}
            className="inline-flex items-center gap-2 bg-[#ff9933] hover:bg-[#e8871a] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Ask JusticeAI
          </button>
        </div>
      </div>
    </div>
  )
}
