import { useState } from 'react'
import {
  Search, ArrowLeft, ExternalLink, AlertTriangle,
  Info, ChevronDown, ChevronUp, Users,
  FileText, Gavel, ShieldCheck, Loader2
} from 'lucide-react'
import { lookupCaseByCNR, ApiError } from '../services/apiClient'
import type { CaseLookupResponse } from '../types/api'
import Footer from '../components/Layout/Footer'

interface CaseStatusPageProps {
  onBack: () => void
  onStartChat: (query?: string) => void
}

const SAMPLE_CNRS = [
  { label: 'Delhi High Court (2023)', cnr: 'DLHC010012342023' },
  { label: 'Bombay District Court (2024)', cnr: 'MHBB010056782024' },
  { label: 'Karnataka Subordinate Court (2022)', cnr: 'KABC010098762022' },
]

export default function CaseStatusPage({ onBack, onStartChat }: CaseStatusPageProps) {
  const [cnr, setCnr] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [lookupResult, setLookupResult] = useState<CaseLookupResponse | null>(null)
  const [showCnrGuide, setShowCnrGuide] = useState(false)

  const handleSearch = async (targetCnr?: string) => {
    const rawCnr = (targetCnr || cnr).trim().toUpperCase().replace(/[^A-Z0-9]/g, '')

    if (!rawCnr) {
      setSearchError('Please enter a 16-character alphanumeric CNR number.')
      setLookupResult(null)
      return
    }

    if (rawCnr.length !== 16) {
      setSearchError(`Invalid length (${rawCnr.length} chars). CNR must be exactly 16 alphanumeric characters.`)
      setLookupResult(null)
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const result = await lookupCaseByCNR(rawCnr)
      setLookupResult(result)
      setCnr(rawCnr)
    } catch (err: unknown) {
      setLookupResult(null)
      if (err instanceof ApiError) {
        setSearchError(err.message)
      } else {
        setSearchError('Failed to verify CNR with backend judicial service. Please check your connection.')
      }
    } finally {
      setIsSearching(false)
    }
  }

  const altSearchLinks = [
    {
      icon: Users,
      title: 'Search by Party Name',
      titleHi: 'पार्टी के नाम से खोजें',
      url: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/party_name',
      description: 'Search using petitioner or respondent name across all courts',
    },
    {
      icon: FileText,
      title: 'Search by Advocate Name',
      titleHi: 'अधिवक्ता के नाम से खोजें',
      url: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/adv_name',
      description: 'Search using advocate name or Bar Council enrollment number',
    },
    {
      icon: Gavel,
      title: 'Search by FIR Number',
      titleHi: 'FIR नंबर से खोजें',
      url: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/fir_number',
      description: 'Search using police station name, FIR number and year',
    },
    {
      icon: Search,
      title: 'Search by Case Number',
      titleHi: 'केस नंबर से खोजें',
      url: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/case_no',
      description: 'Search using case type (e.g. Civil Suit, Criminal Appeal) & year',
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
              <h1 className="text-2xl md:text-3xl font-bold">Case Status Lookup &amp; Verification</h1>
              <p className="text-blue-200 text-sm mt-1">
                Verify 16-digit CNR numbers, parse case metadata, and access official court orders
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* CNR Search Form */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-[#0a1f44] mb-1">CNR Number Verification</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your 16-character alphanumeric Case Number Record (CNR) to parse court registry metadata and access official live orders.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSearch()
              }}
              className="space-y-3"
            >
              <label htmlFor="cnr-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                16-Digit CNR Number
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="cnr-input"
                  type="text"
                  value={cnr}
                  onChange={(e) => {
                    setCnr(e.target.value.toUpperCase())
                    setSearchError(null)
                  }}
                  placeholder="e.g. DLHC010012342023"
                  maxLength={16}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-mono uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f44] focus:border-transparent placeholder:text-gray-300 shadow-inner"
                  autoComplete="off"
                  spellCheck="false"
                />

                <button
                  type="submit"
                  disabled={isSearching}
                  className="inline-flex items-center justify-center gap-2 bg-[#0a1f44] hover:bg-[#102e68] text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 text-sm shadow-md"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verify CNR
                    </>
                  )}
                </button>
              </div>

              {searchError && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}
            </form>

            {/* Sample CNR Chips */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 mr-2">Try sample CNR:</span>
              <div className="inline-flex flex-wrap gap-2 mt-1 sm:mt-0">
                {SAMPLE_CNRS.map((sample) => (
                  <button
                    key={sample.cnr}
                    type="button"
                    onClick={() => {
                      setCnr(sample.cnr)
                      handleSearch(sample.cnr)
                    }}
                    className="text-xs font-mono bg-blue-50 hover:bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md transition-colors border border-blue-200/60"
                  >
                    {sample.cnr}
                  </button>
                ))}
              </div>
            </div>

            {/* How to find CNR collapsible */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowCnrGuide(!showCnrGuide)}
                className="flex items-center gap-2 text-xs font-semibold text-[#0a1f44] hover:text-[#ff9933] transition-colors"
              >
                {showCnrGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Where can I find my 16-character CNR number?
              </button>

              {showCnrGuide && (
                <div className="mt-3 bg-[#f8fafd] rounded-xl p-4 text-xs text-gray-600 space-y-2 border border-gray-200/60">
                  <p>• <strong>Court Filing Receipt:</strong> The CNR is printed at the top header of your official acknowledgment slip.</p>
                  <p>• <strong>Summons &amp; Court Notices:</strong> Look at the top-left corner of the physical summons; many include a scannable QR code with your CNR.</p>
                  <p>• <strong>SMS Hearing Alerts:</strong> Sent to litigants&apos; registered mobile numbers after filing scrutiny.</p>
                  <p>• <strong>Advocate Record:</strong> Your counsel receives the permanent CNR upon registration with the court registry.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Results Card */}
        {lookupResult && (
          <div className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-lg p-6 sm:p-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1f44] text-base">CNR Structure Verified</h3>
                  <p className="text-xs text-gray-500">Official registry format check passed</p>
                </div>
              </div>

              <span className="self-start sm:self-auto font-mono text-sm font-bold bg-blue-50 text-blue-900 px-3 py-1 rounded-lg border border-blue-200">
                {lookupResult.cnr}
              </span>
            </div>

            {/* Parsed Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#f8fafd] rounded-xl p-3.5 border border-gray-100">
                <div className="text-[11px] font-medium text-gray-500 uppercase">State Code</div>
                <div className="text-base font-bold text-[#0a1f44] font-mono mt-0.5">{lookupResult.parsed.stateCode}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Jurisdiction prefix</div>
              </div>

              <div className="bg-[#f8fafd] rounded-xl p-3.5 border border-gray-100">
                <div className="text-[11px] font-medium text-gray-500 uppercase">Court Code</div>
                <div className="text-base font-bold text-[#0a1f44] font-mono mt-0.5">{lookupResult.parsed.courtCode}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Registry establishment</div>
              </div>

              <div className="bg-[#f8fafd] rounded-xl p-3.5 border border-gray-100">
                <div className="text-[11px] font-medium text-gray-500 uppercase">Case Number</div>
                <div className="text-base font-bold text-[#0a1f44] font-mono mt-0.5">{lookupResult.parsed.caseNumber}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Filing serial index</div>
              </div>

              <div className="bg-[#f8fafd] rounded-xl p-3.5 border border-gray-100">
                <div className="text-[11px] font-medium text-gray-500 uppercase">Filing Year</div>
                <div className="text-base font-bold text-[#0a1f44] font-mono mt-0.5">{lookupResult.parsed.filingYear}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">Institution year</div>
              </div>
            </div>

            {/* Official CAPTCHA requirement disclaimer */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex gap-3 text-xs text-amber-900 mb-6">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Live Case Orders &amp; CAPTCHA Notice:</strong>
                <p className="mt-0.5 leading-relaxed">
                  {lookupResult.disclaimer}
                </p>
              </div>
            </div>

            {/* Direct portal action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={lookupResult.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#ff9933] hover:bg-[#e8871a] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-md"
              >
                Open Official eCourts Portal for Real-Time Orders
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => onStartChat(`How do I track hearing dates for case CNR ${lookupResult.cnr}?`)}
                className="inline-flex items-center justify-center gap-2 bg-[#f0f4fb] hover:bg-[#e2eaf5] text-[#0a1f44] font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
              >
                Ask JusticeAI About This Case
              </button>
            </div>
          </div>
        )}

        {/* Alternative Search Methods */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-2">Alternative Case Search Gateways</h2>
          <p className="text-xs text-gray-500 mb-4">
            If you do not have your CNR number at hand, access the eCourts services directory via alternate identifiers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {altSearchLinks.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-5 h-5 text-[#0a1f44]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#0a1f44] text-sm group-hover:text-[#ff9933] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#ff9933] font-medium">{item.titleHi}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ff9933] transition-colors flex-shrink-0 mt-1" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs text-gray-500 leading-relaxed">
          <strong>Official Transparency Note:</strong> JusticeAI does not harvest or retain confidential court records. Case search queries are resolved in accordance with Supreme Court e-Committee guidelines for citizen access to public justice data.
        </div>
      </div>
      <Footer />
    </div>
  )
}
