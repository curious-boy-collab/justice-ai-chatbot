import { Scale, ShieldCheck, FileCheck, ExternalLink, Globe } from 'lucide-react'
import type { Language } from '../../types/chat'
import SuggestedPrompts from './SuggestedPrompts'

interface EmptyStateProps {
  language: Language
  onSelectPrompt: (query: string) => void
  onToggleLanguage: () => void
}

export default function EmptyState({
  language,
  onSelectPrompt,
  onToggleLanguage,
}: EmptyStateProps) {
  const isHi = language === 'hi'

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 sm:px-6 overflow-y-auto">
      <div className="max-w-4xl w-full text-center space-y-6">
        {/* Emblem & Department Badge */}
        <div className="inline-flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0a1f44] to-[#1a3f7c] text-white flex items-center justify-center shadow-md">
              <Scale className="w-9 h-9 text-[#ff9933]" strokeWidth={2.3} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-[#0a1f44]/5 text-[#0a1f44] px-3 py-1 rounded-full border border-[#0a1f44]/10">
              Department of Justice · Ministry of Law &amp; Justice · GoI
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1f44] tracking-tight">
            {isHi ? (
              <>
                <span className="text-[#ff9933]">JusticeAI</span> में आपका स्वागत है
              </>
            ) : (
              <>
                Welcome to <span className="text-[#ff9933]">JusticeAI</span>
              </>
            )}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            {isHi
              ? 'भारतीय न्यायपालिका, केस स्थिति, न्यायाधीश रिक्तियों और नागरिक ई-सेवाओं हेतु आपका विश्वसनीय आधिकारिक AI सहायक।'
              : 'Your verified digital assistant for judicial services, case status lookup, court statistics, and citizen e-services.'}
          </p>
        </div>

        {/* Quick Language & Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0a1f44] font-medium border border-slate-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#ff9933]" />
            <span>{isHi ? 'Switch to English' : 'हिंदी में बदलें'}</span>
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? 'सत्यापित सरकारी स्रोत' : 'Official Portal Sources'}</span>
          </span>
          <a
            href="https://doj.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>doj.gov.in</span>
          </a>
        </div>

        {/* Prompt Grid Section */}
        <div className="pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            {isHi ? 'नागरिक सेवाएँ एवं सुझाए गए प्रश्न' : 'Suggested Inquiries & Citizen Services'}
          </div>
          <SuggestedPrompts
            language={language}
            onSelectPrompt={onSelectPrompt}
            variant="grid"
          />
        </div>
      </div>
    </div>
  )
}
