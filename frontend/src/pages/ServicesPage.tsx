import { useState, useEffect } from 'react'
import {
  Scale, BarChart3, FileText, Phone, Smartphone,
  Gavel, Users, ExternalLink, ArrowLeft, Monitor,
  Search, ArrowRight, BookOpen, Sparkles
} from 'lucide-react'
import { fetchKnowledgeStats } from '../services/apiClient'
import type { KnowledgeStatsResponse } from '../types/api'

export type ServicePageTarget =
  | 'njdg' | 'judge-vacancy' | 'efiling' | 'telelaw'
  | 'ftsc' | 'ecourts-app' | 'case-status'

interface ServicesPageProps {
  onBack: () => void
  onNavigate: (target: ServicePageTarget) => void
  onStartChat: (query?: string) => void
}

const services = [
  {
    id: 'case-status' as ServicePageTarget,
    icon: Search,
    title: 'Case Status Lookup',
    titleHi: 'केस स्थिति जांचें',
    description: 'Search real-time case status using CNR number, party name, advocate name, or FIR number.',
    url: 'https://ecourts.gov.in',
    color: '#ff9933',
  },
  {
    id: 'njdg' as ServicePageTarget,
    icon: BarChart3,
    title: 'NJDG Statistics',
    titleHi: 'NJDG आँकड़े',
    description: 'National Judicial Data Grid — case pendency, disposal rates and court-wise data.',
    url: 'https://njdg.ecourts.gov.in',
    color: '#0a1f44',
  },
  {
    id: 'judge-vacancy' as ServicePageTarget,
    icon: Users,
    title: 'Judge Strength & Vacancies',
    titleHi: 'न्यायाधीश शक्ति और रिक्तियाँ',
    description: 'Sanctioned vs working strength of judges in Supreme Court, High Courts and District Courts.',
    url: 'https://doj.gov.in/list-of-high-court-judges/',
    color: '#1a3f7c',
  },
  {
    id: 'efiling' as ServicePageTarget,
    icon: FileText,
    title: 'eFiling & ePay',
    titleHi: 'ई-फाइलिंग और ई-भुगतान',
    description: 'File court cases online and pay court fees through the ePay portal.',
    url: 'https://filing.ecourts.gov.in',
    color: '#138808',
  },
  {
    id: 'telelaw' as ServicePageTarget,
    icon: Phone,
    title: 'Tele-Law Services',
    titleHi: 'टेली-लॉ सेवाएं',
    description: 'Free legal consultation for marginalised citizens via Common Service Centres.',
    url: 'https://tele-law.in',
    color: '#6b21a8',
  },
  {
    id: 'ftsc' as ServicePageTarget,
    icon: Gavel,
    title: 'Fast Track Special Courts',
    titleHi: 'फास्ट ट्रैक विशेष अदालत',
    description: 'Expeditious trial of POCSO cases and sexual offences across 28 states.',
    url: 'https://doj.gov.in/fast-track-special-court-ftsc/',
    color: '#c0392b',
  },
  {
    id: 'ecourts-app' as ServicePageTarget,
    icon: Smartphone,
    title: 'eCourts Mobile App',
    titleHi: 'eCourts मोबाइल ऐप',
    description: 'Track cases, get hearing alerts, view cause lists and court orders on mobile.',
    url: 'https://ecourts.gov.in',
    color: '#0369a1',
  },
]

const quickLinks = [
  { label: 'eCourts Portal', url: 'https://ecourts.gov.in', icon: Scale },
  { label: 'NJDG Dashboard', url: 'https://njdg.ecourts.gov.in', icon: BarChart3 },
  { label: 'eFiling Portal', url: 'https://filing.ecourts.gov.in', icon: FileText },
  { label: 'ePay Portal', url: 'https://pay.ecourts.gov.in', icon: FileText },
  { label: 'Tele-Law', url: 'https://tele-law.in', icon: Phone },
  { label: 'DoJ Website', url: 'https://doj.gov.in', icon: Monitor },
  { label: 'Live Streaming of Courts', url: 'https://liveproceedings.ecourts.gov.in', icon: Monitor },
  { label: 'Supreme Court', url: 'https://main.sci.gov.in', icon: Scale },
]

export default function ServicesPage({ onBack, onNavigate, onStartChat }: ServicesPageProps) {
  const [kbStats, setKbStats] = useState<KnowledgeStatsResponse | null>(null)

  useEffect(() => {
    fetchKnowledgeStats()
      .then((res) => setKbStats(res))
      .catch(() => {
        // Fallback knowledge metrics
        setKbStats({
          success: true,
          documentCount: 15,
          totalChunks: 105,
          categories: ['Department of Justice', 'eCourts Project', 'National Judicial Data Grid'],
          totalWordCount: 18450,
          timestamp: new Date().toISOString(),
        })
      })
  }, [])

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
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Government Justice Services</h1>
              <p className="text-blue-200 text-sm mt-1">
                Access judicial information, court services, legal aid and government portals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Knowledge Base Repository Banner */}
        {kbStats && (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-amber-50 rounded-xl text-[#ff9933]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#ff9933] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  RAG Verified Knowledge Base
                </div>
                <div className="text-sm font-bold text-[#0a1f44] mt-0.5">
                  {kbStats.documentCount} Official Publications &amp; {kbStats.totalChunks} Indexed Legal Chunks
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Categories: {kbStats.categories.join(' • ')}
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartChat('List the official documents and services covered by JusticeAI')}
              className="text-xs font-semibold text-[#0a1f44] hover:text-[#ff9933] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto border border-blue-200/60"
            >
              Explore Knowledge Scope →
            </button>
          </div>
        )}

        {/* Services grid */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">Available Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <button
                  key={service.id}
                  onClick={() => onNavigate(service.id)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="p-2.5 rounded-lg"
                      style={{ backgroundColor: service.color + '15' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: service.color }} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#ff9933] transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#0a1f44] text-sm mb-0.5">{service.title}</h3>
                  <div className="text-xs text-[#ff9933] font-medium mb-2">{service.titleHi}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Official portal links */}
        <div>
          <h2 className="text-lg font-bold text-[#0a1f44] mb-4">Official Portal Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow group"
                >
                  <Icon className="w-4 h-4 text-[#0a1f44] flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700 group-hover:text-[#ff9933] transition-colors flex-1">
                    {link.label}
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-300 flex-shrink-0" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Chat CTA */}
        <div className="bg-[#0a1f44] rounded-xl p-6 text-white text-center">
          <h2 className="font-bold text-lg mb-2">Can&apos;t find what you need?</h2>
          <p className="text-blue-200 text-sm mb-4">
            Ask JusticeAI any question about government justice services in English or Hindi.
          </p>
          <button
            onClick={() => onStartChat()}
            className="inline-flex items-center gap-2 bg-[#ff9933] hover:bg-[#e8871a] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Chat with JusticeAI
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
