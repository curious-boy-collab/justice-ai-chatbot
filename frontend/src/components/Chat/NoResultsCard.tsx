import { Phone, ArrowRight, RefreshCw, FileQuestion } from 'lucide-react'
import type { Language } from '../../types/chat'

interface NoResultsCardProps {
  query: string
  language: Language
  onSelectPrompt: (prompt: string) => void
  onRetry: () => void
}

export default function NoResultsCard({
  query,
  language,
  onSelectPrompt,
  onRetry,
}: NoResultsCardProps) {
  const isHi = language === 'hi'

  const fallbackPrompts = isHi
    ? [
        'सीएनआर (CNR) नंबर से केस की स्थिति कैसे जांचें?',
        'सर्वोच्च न्यायालय और 25 उच्च न्यायालयों में जजों की रिक्तियां कितनी हैं?',
        'NJDG पर लंबित मामलों के राष्ट्रीय आँकड़े क्या हैं?',
        'टेली-लॉ (Tele-Law) निःशुल्क कानूनी सलाह कैसे लें?',
      ]
    : [
        'How do I check court case status using CNR number?',
        'What are the current judge vacancies in High Courts?',
        'Show me NJDG case pendency statistics across courts',
        'How do I access free legal advice via Tele-Law?',
      ]

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs text-left anim-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
          <FileQuestion className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#0a1f44] mb-1">
            {isHi
              ? 'कोई प्रासंगिक न्यायिक अभिलेख प्राप्त नहीं हुआ'
              : 'No Verified Records Found'}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHi ? (
              <>
                हम <strong>"{query}"</strong> के लिए सत्यापित उत्तर नहीं पा सके।
                कृपया अपने प्रश्न को सरल बनाएं अथवा नीचे दिए गए आधिकारिक विकल्पों में से चुनें।
              </>
            ) : (
              <>
                We could not locate matching official records for <strong>"{query}"</strong> in the
                Department of Justice knowledge base.
              </>
            )}
          </p>

          {/* Tips Checklist */}
          <div className="mt-3 p-2.5 rounded-lg bg-white/80 border border-amber-100 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
              {isHi ? 'सहायक सुझाव:' : 'Search Guidance:'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="text-[#ff9933] font-bold">•</span>
              <span>{isHi ? '16-अंकीय सीएनआर नंबर दर्ज करें' : 'Enter a 16-character CNR number'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="text-[#ff9933] font-bold">•</span>
              <span>
                {isHi
                  ? 'विशिष्ट कीवर्ड: जज रिक्ति, eFiling, NJDG, टेली-लॉ, चालान'
                  : 'Use keywords: Judge Vacancy, eFiling, NJDG, Tele-Law, Traffic Fine'}
              </span>
            </div>
          </div>

          {/* Quick Fallback Prompts */}
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
              {isHi ? 'सुझाए गए प्रमाणित प्रश्न:' : 'Explore Verified Inquiries:'}
            </div>
            <div className="flex flex-col gap-1.5">
              {fallbackPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPrompt(p)}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-white hover:bg-[#e8edf7] text-[#0a1f44] border border-slate-200 hover:border-[#2855a0] transition-colors text-left font-medium group"
                >
                  <span className="truncate pr-2">{p}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff9933] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Tele-Law Contact Card */}
          <div className="mt-3 pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-[#ff9933]" />
              <span>
                {isHi ? 'मुफ्त कानूनी परामर्श:' : 'Free Legal Aid Helpline:'}{' '}
                <strong className="text-[#0a1f44]">1800-200-7514</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a1f44] hover:text-[#ff9933] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isHi ? 'पुनः प्रयास करें' : 'Retry Query'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
