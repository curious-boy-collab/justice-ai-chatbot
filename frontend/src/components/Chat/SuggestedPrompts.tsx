import {
  Scale,
  BarChart3,
  Users,
  FileText,
  Phone,
  Tv,
  Car,
  Gavel,
  ArrowRight,
} from 'lucide-react'
import type { Language } from '../../types/chat'

export interface PromptItem {
  id: string
  icon: typeof Scale
  titleEn: string
  titleHi: string
  queryEn: string
  queryHi: string
  badgeEn: string
  badgeHi: string
}

export const PROMPT_ITEMS: PromptItem[] = [
  {
    id: 'case-status',
    icon: Scale,
    titleEn: 'Case Status Lookup',
    titleHi: 'केस स्थिति जांचें',
    queryEn: 'How do I check my court case status using a 16-digit CNR number?',
    queryHi: 'मैं 16-अंकीय CNR नंबर से अपने कोर्ट केस की स्थिति कैसे जान सकता हूँ?',
    badgeEn: 'eCourts',
    badgeHi: 'ई-कोर्ट',
  },
  {
    id: 'njdg-stats',
    icon: BarChart3,
    titleEn: 'NJDG Statistics',
    titleHi: 'NJDG सांख्यिकी',
    queryEn: 'What are the latest case pendency statistics across High Courts and District Courts on NJDG?',
    queryHi: 'NJDG पर उच्च न्यायालयों और जिला न्यायालयों में केस पेंडेंसी के नवीनतम आँकड़े क्या हैं?',
    badgeEn: 'National Data',
    badgeHi: 'राष्ट्रीय डेटा',
  },
  {
    id: 'judge-vacancies',
    icon: Users,
    titleEn: 'Judge Vacancies',
    titleHi: 'न्यायाधीश रिक्तियाँ',
    queryEn: 'What is the sanctioned strength and current vacancies of judges in the Supreme Court and High Courts?',
    queryHi: 'सर्वोच्च न्यायालय और 25 उच्च न्यायालयों में स्वीकृत पद एवं वर्तमान रिक्तियों की स्थिति क्या है?',
    badgeEn: 'Appointments',
    badgeHi: 'नियुक्तियाँ',
  },
  {
    id: 'efiling-epay',
    icon: FileText,
    titleEn: 'eFiling & ePay',
    titleHi: 'ई-फाइलिंग व ई-पेय',
    queryEn: 'Give me a step-by-step citizen guide to register on eFiling 3.0 and pay court fees via ePay.',
    queryHi: 'eFiling 3.0 पर पंजीकरण करने और ePay से कोर्ट फीस भुगतान करने का चरणबद्ध तरीका बताएं।',
    badgeEn: 'Citizen Guide',
    badgeHi: 'नागरिक गाइड',
  },
  {
    id: 'tele-law',
    icon: Phone,
    titleEn: 'Tele-Law Legal Aid',
    titleHi: 'टेली-लॉ कानूनी सहायता',
    queryEn: 'Who is eligible for free legal consultation under Tele-Law through Common Service Centres (CSCs)?',
    queryHi: 'कॉमन सर्विस सेंटर (CSC) पर टेली-लॉ के तहत निःशुल्क विधिक परामर्श के लिए कौन पात्र है?',
    badgeEn: 'Free Legal Aid',
    badgeHi: 'मुफ़्त सहायता',
  },
  {
    id: 'livestream',
    icon: Tv,
    titleEn: 'Court Livestreaming',
    titleHi: 'कोर्ट लाइव स्ट्रीमिंग',
    queryEn: 'How can citizens watch official live streaming of Supreme Court and High Court proceedings?',
    queryHi: 'नागरिक सर्वोच्च न्यायालय और उच्च न्यायालयों की कार्यवाही का आधिकारिक लाइव प्रसारण कैसे देख सकते हैं?',
    badgeEn: 'Transparency',
    badgeHi: 'पारदर्शिता',
  },
  {
    id: 'traffic-challan',
    icon: Car,
    titleEn: 'Traffic Challan & vCourts',
    titleHi: 'ट्रैफिक चालान व वर्चुअल कोर्ट',
    queryEn: 'How do I settle and pay a traffic violation challan online through Virtual Courts?',
    queryHi: 'वर्चुअल कोर्ट (vCourts) के माध्यम से ट्रैफिक चालान का ऑनलाइन निपटान और भुगतान कैसे करें?',
    badgeEn: 'eChallan',
    badgeHi: 'ई-चालान',
  },
  {
    id: 'ftsc',
    icon: Gavel,
    titleEn: 'Fast Track Courts (FTSC)',
    titleHi: 'फास्ट ट्रैक विशेष कोर्ट',
    queryEn: 'What is the role and coverage of Fast Track Special Courts (FTSCs) for POCSO and rape cases?',
    queryHi: 'POCSO और दुष्कर्म मामलों के लिए फास्ट ट्रैक स्पेशल कोर्ट्स (FTSC) की क्या भूमिका और स्थिति है?',
    badgeEn: 'FTSC Scheme',
    badgeHi: 'FTSC योजना',
  },
]

interface SuggestedPromptsProps {
  language: Language
  onSelectPrompt: (query: string) => void
  variant?: 'grid' | 'chips'
}

export default function SuggestedPrompts({
  language,
  onSelectPrompt,
  variant = 'grid',
}: SuggestedPromptsProps) {
  const isHi = language === 'hi'

  if (variant === 'chips') {
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-1 px-4 no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-1">
          {isHi ? 'त्वरित प्रश्न:' : 'Suggested:'}
        </span>
        {PROMPT_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon
          const title = isHi ? item.titleHi : item.titleEn
          const query = isHi ? item.queryHi : item.queryEn
          return (
            <button
              key={item.id}
              onClick={() => onSelectPrompt(query)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#e8edf7] text-[#0a1f44] border border-slate-200 hover:border-[#2855a0] shadow-2xs whitespace-nowrap transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-[#ff9933]" />
              <span>{title}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
      {PROMPT_ITEMS.map((item) => {
        const Icon = item.icon
        const title = isHi ? item.titleHi : item.titleEn
        const query = isHi ? item.queryHi : item.queryEn
        const badge = isHi ? item.badgeHi : item.badgeEn

        return (
          <button
            key={item.id}
            onClick={() => onSelectPrompt(query)}
            className="flex flex-col justify-between p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#ff9933] shadow-2xs hover:shadow-md transition-all text-left group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#0a1f44]/5 flex items-center justify-center group-hover:bg-[#ff9933]/10 transition-colors">
                  <Icon className="w-4 h-4 text-[#0a1f44] group-hover:text-[#ff9933] transition-colors" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {badge}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#0a1f44] mb-1">
                {title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {query}
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium text-[#ff9933] mt-3 group-hover:translate-x-0.5 transition-transform">
              <span>{isHi ? 'पूछें' : 'Ask query'}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        )
      })}
    </div>
  )
}
