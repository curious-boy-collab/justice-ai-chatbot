import { useState } from 'react'
import { ArrowLeft, PanelLeftOpen, Scale, FileText, Users, BarChart3, Phone, Smartphone } from 'lucide-react'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'
import ChatBox from '../components/Chat/ChatBox'
import SuggestedCard from '../components/Dashboard/SuggestedCard'

interface ChatPageProps {
  onBack: () => void
  initialQuery?: string
}

const quickSuggestions = [
  {
    icon: Scale,
    title: 'Case Status',
    description: 'Look up your case by CNR number or party name.',
    query: 'How do I check my case status?',
    accentColor: '#0a1f44',
  },
  {
    icon: BarChart3,
    title: 'NJDG Statistics',
    description: 'View court-wise pendency and clearance data.',
    query: 'Show me NJDG statistics and case pendency data',
    accentColor: '#1a3f7c',
  },
  {
    icon: Users,
    title: 'Judge Vacancies',
    description: 'Check current judge appointments and vacancies.',
    query: 'What are the current judge vacancies in India?',
    accentColor: '#ff9933',
  },
  {
    icon: FileText,
    title: 'eFiling & ePay',
    description: 'Step-by-step guide to file and pay court fees.',
    query: 'How do I file a case using eFiling and ePay?',
    accentColor: '#138808',
  },
  {
    icon: Phone,
    title: 'Tele-Law',
    description: 'Free legal advice via Common Service Centres.',
    query: 'How can I access Tele-Law services?',
    accentColor: '#6b21a8',
  },
  {
    icon: Smartphone,
    title: 'eCourts App',
    description: 'Download the official eCourts mobile application.',
    query: 'How do I download and use the eCourts mobile app?',
    accentColor: '#0369a1',
  },
]

export default function ChatPage({ onBack, initialQuery }: ChatPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('chat')
  const [currentQuery, setCurrentQuery] = useState<string | undefined>(initialQuery)

  const handleSuggestedQuery = (query: string) => {
    setCurrentQuery(query)
    // Reset after consumption so re-clicking same works
    setTimeout(() => setCurrentQuery(undefined), 100)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={onBack} />

      {/* Sub-header breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-2.5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0a1f44] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-[#0a1f44] font-medium">AI Chat Assistant</span>

        <button
          className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0a1f44]
                     transition-colors lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <PanelLeftOpen className="w-4 h-4" />
          Menu
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={(section) => {
            setActiveSection(section)
            if (section !== 'chat') onBack()
          }}
          activeSection={activeSection}
        />

        {/* Main content */}
        <div className="flex-1 flex gap-5 p-4 sm:p-6 overflow-y-auto min-w-0">
          {/* Chat */}
          <div className="flex-1 flex flex-col min-h-[600px] min-w-0">
            <ChatBox initialQuery={currentQuery} />
          </div>

          {/* Right panel — suggested queries */}
          <div className="w-72 flex-shrink-0 hidden xl:flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#e8edf7] rounded-lg p-1.5">
                  <Scale className="w-4 h-4 text-[#0a1f44]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0a1f44]">Quick Topics</div>
                  <div className="text-xs text-gray-400">Click to ask instantly</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {quickSuggestions.map((s) => (
                  <SuggestedCard
                    key={s.title}
                    {...s}
                    onClick={handleSuggestedQuery}
                  />
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-[#fff3e0] rounded-2xl border border-orange-100 p-4 text-xs text-orange-800 leading-relaxed">
              <strong className="block mb-1">⚠️ Important Disclaimer</strong>
              JusticeAI provides general guidance only. All critical information should be verified
              at official government portals (doj.gov.in, ecourts.gov.in).
              This is not legal advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
