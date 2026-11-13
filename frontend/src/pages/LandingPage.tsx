import {
  Scale, MessageSquare, Users, BarChart3, FileText,
  Phone, Smartphone, Gavel, ArrowRight, Shield,
  CheckCircle, ExternalLink
} from 'lucide-react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import StatCard from '../components/Dashboard/StatCard'
import SuggestedCard from '../components/Dashboard/SuggestedCard'

import type { Page } from '../App'

interface LandingPageProps {
  onStartChat: (query?: string) => void
  onNavigateServices?: () => void
  onNavigatePage?: (page: Page) => void
}

const statCards = [
  {
    title: 'Supreme Court Judges',
    value: '33',
    subtitle: 'Sanctioned: 34 (Art. 124)',
    icon: Scale,
    badge: 'Live DoJ',
    badgeColor: 'green' as const,
    isLive: true,
    trend: 'neutral' as const,
    trendValue: '1 vacancy remaining',
  },
  {
    title: 'High Court Vacancies',
    value: '336',
    subtitle: 'Across 25 High Courts',
    icon: Users,
    badge: 'DoJ Roster',
    badgeColor: 'orange' as const,
    isLive: false,
    trend: 'down' as const,
    trendValue: 'Sanctioned: 1,114 posts',
  },
  {
    title: 'Pending Cases (National)',
    value: '5.12 Cr',
    subtitle: 'Supreme, High & District Courts',
    icon: BarChart3,
    badge: 'NJDG Official',
    badgeColor: 'blue' as const,
    isLive: false,
    trend: 'up' as const,
    trendValue: '78.1% Criminal / 21.9% Civil',
  },
  {
    title: 'Fast Track Courts',
    value: '761',
    subtitle: 'Operational across 28 states',
    icon: Gavel,
    badge: 'FTSC Active',
    badgeColor: 'green' as const,
    isLive: false,
    trend: 'up' as const,
    trendValue: '414 Exclusive POCSO Courts',
  },
]

const suggestedCards = [
  {
    icon: Scale,
    title: 'Case Status Lookup',
    description: 'Check real-time status of your pending court case using CNR number or party name.',
    query: 'How do I check my case status?',
    accentColor: '#0a1f44',
  },
  {
    icon: BarChart3,
    title: 'NJDG Statistics',
    description: 'View live pendency data, case clearance rates and court-wise statistics from NJDG.',
    query: 'Show me NJDG statistics and case pendency data',
    accentColor: '#1a3f7c',
  },
  {
    icon: Users,
    title: 'Judge Vacancies',
    description: 'Current strength vs sanctioned strength of judges in Supreme Court, High Courts.',
    query: 'What are the current judge vacancies in India?',
    accentColor: '#ff9933',
  },
  {
    icon: FileText,
    title: 'eFiling & ePay Guide',
    description: 'Step-by-step guide to file cases online and pay court fees through ePay.',
    query: 'How do I file a case using eFiling and ePay?',
    accentColor: '#138808',
  },
  {
    icon: Phone,
    title: 'Tele-Law Services',
    description: 'Connect to free legal advice via video at your nearest Common Service Centre.',
    query: 'How can I access Tele-Law services?',
    accentColor: '#6b21a8',
  },
  {
    icon: Smartphone,
    title: 'eCourts Mobile App',
    description: 'Download and use the eCourts Services app to track cases, get alerts, and more.',
    query: 'How do I download and use the eCourts mobile app?',
    accentColor: '#0369a1',
  },
]

export default function LandingPage({ onStartChat, onNavigateServices, onNavigatePage }: LandingPageProps) {
  const handleSuggestedQuery = (query: string) => {
    onStartChat(query)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onLogoClick={() => onNavigatePage?.('landing')}
        onNavigate={(p) => {
          if (p === 'services') onNavigatePage ? onNavigatePage('services') : onNavigateServices?.()
          else if (p === 'njdg') onNavigatePage ? onNavigatePage('njdg') : onNavigateServices?.()
          else if (p === 'home') onNavigatePage ? onNavigatePage('landing') : undefined
          else if (p === 'contact') {
            document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })
          } else if (p === 'about') {
            onStartChat('What are the main functions and administrative divisions of the Department of Justice?')
          }
        }}
      />

      {/* Hero section */}
      <section className="bg-[#0a1f44] text-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-[#ff9933] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-64 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            {/* Gov badge */}
            <div className="inline-flex items-center gap-2 bg-[#102e68] rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-4 h-4 text-[#ff9933]" />
              <span className="text-sm text-blue-200 font-medium">
                Government of India · Ministry of Law &amp; Justice
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your AI Guide to{' '}
              <span className="text-[#ff9933]">Justice Services</span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              JusticeAI is an intelligent assistant that helps citizens navigate
              court services, check case status, understand legal procedures,
              and access Department of Justice resources — in English and Hindi.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onStartChat()}
                className="inline-flex items-center justify-center gap-2 bg-[#ff9933] hover:bg-[#e8871a]
                           text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                Start Chatting
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://doj.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#2855a0]
                           hover:border-[#ff9933] text-blue-100 hover:text-[#ff9933]
                           px-6 py-3 rounded-xl transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Official DoJ Website
              </a>
            </div>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                'Case Status Lookup', 'Hindi & English', 'Official Sources',
                'eFiling Guide', 'NJDG Statistics', 'Tele-Law Info',
              ].map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 text-xs text-blue-200 bg-[#102e68] px-3 py-1 rounded-full"
                >
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats dashboard */}
      <section className="bg-[#f0f4fb] py-10 border-b border-[#d8e4f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#0a1f44]">Judicial Overview</h2>
              <p className="text-sm text-gray-500">Live and periodically updated statistics</p>
            </div>
            <span className="text-xs text-orange-500 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full font-medium">
              ⚠️ Demo data — NJDG integration pending
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Suggested questions */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a1f44] mb-2">
              What would you like to know?
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Click a topic to start an intelligent conversation with JusticeAI
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedCards.map((card) => (
              <SuggestedCard
                key={card.title}
                {...card}
                onClick={handleSuggestedQuery}
              />
            ))}
          </div>

          {/* Chat CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={() => onStartChat()}
              className="inline-flex items-center gap-2 bg-[#0a1f44] hover:bg-[#102e68]
                         text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md"
            >
              <MessageSquare className="w-5 h-5" />
              Open Full Chat Assistant
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-400 mt-2">Ask anything · Available in English and हिंदी</p>
            {onNavigateServices && (
              <button
                onClick={onNavigateServices}
                className="mt-3 inline-flex items-center gap-2 text-sm text-[#0a1f44] hover:text-[#ff9933]
                           font-semibold transition-colors"
              >
                Browse All Government Services
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="bg-[#0a1f44] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-center mb-6 text-blue-100">
            Official DoJ Services — Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'eCourts Portal', url: 'https://ecourts.gov.in', icon: Scale },
              { label: 'NJDG Dashboard', url: 'https://njdg.ecourts.gov.in', icon: BarChart3 },
              { label: 'eFiling Portal', url: 'https://filing.ecourts.gov.in', icon: FileText },
              { label: 'Tele-Law', url: 'https://tele-law.in', icon: Phone },
            ].map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 bg-[#102e68] hover:bg-[#1a3f7c]
                             rounded-xl p-4 transition-colors text-center group"
                >
                  <Icon className="w-6 h-6 text-[#ff9933] group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-blue-100 font-medium">{item.label}</span>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
