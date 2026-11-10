import { ArrowLeft, Scale, Shield, ExternalLink } from 'lucide-react'
import Header from '../components/Layout/Header'
import ChatBox from '../components/Chat/ChatBox'

interface ChatPageProps {
  onBack: () => void
  initialQuery?: string
}

export default function ChatPage({ onBack, initialQuery }: ChatPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd]">
      {/* 1. Global Header with navigation */}
      <Header onLogoClick={onBack} />

      {/* 2. Government Breadcrumb Subheader */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 font-medium text-slate-500 hover:text-[#0a1f44] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Home</span>
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5 text-[#0a1f44] font-semibold">
              <Scale className="w-3.5 h-3.5 text-[#ff9933]" />
              <span>JusticeAI Official Assistant</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Official Department of Justice Assistant</span>
            </div>
            <a
              href="https://doj.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-500 hover:text-[#0a1f44] transition-colors"
            >
              <span>doj.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Chatbox Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col min-h-0">
        <div className="flex-1 w-full h-[calc(100vh-130px)] min-h-[580px]">
          <ChatBox initialQuery={initialQuery} />
        </div>
      </div>
    </div>
  )
}
