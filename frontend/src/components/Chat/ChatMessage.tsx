import { useState } from 'react'
import {
  ExternalLink,
  CheckCircle2,
  BookOpen,
  Radio,
  AlertCircle,
  Copy,
  Check,
  Scale,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Info,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react'
import type { Message, DataStatus, Source } from '../../types/chat'

interface ChatMessageProps {
  message: Message
  onSuggestedClick?: (prompt: string) => void
}

const STATUS_CONFIG: Record<
  DataStatus,
  { label: string; labelHi: string; icon: typeof CheckCircle2; badgeClass: string }
> = {
  official_reference: {
    label: 'Verified Official Record',
    labelHi: 'सत्यापित आधिकारिक रिकॉर्ड',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  live_api_reference: {
    label: 'Live Government Data',
    labelHi: 'लाइव सरकारी डेटा',
    icon: Radio,
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  procedural_guidance: {
    label: 'Procedural Citizen Guide',
    labelHi: 'प्रक्रियात्मक नागरिक गाइड',
    icon: BookOpen,
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  demo: {
    label: 'Knowledge Base Reference',
    labelHi: 'ज्ञानकोष संदर्भ',
    icon: AlertCircle,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
}

export default function ChatMessage({ message, onSuggestedClick }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [sourcesExpanded, setSourcesExpanded] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts)
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return ''
    }
  }

  const statusInfo = message.dataStatus ? STATUS_CONFIG[message.dataStatus] : null
  const hasSources = Boolean(message.sources && message.sources.length > 0)
  const retrieval = message.retrieval

  // Enhanced Markdown-like Parser
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []

    lines.forEach((line, index) => {
      // Empty line -> spacing
      if (!line.trim()) {
        elements.push(<div key={`empty-${index}`} className="h-2" />)
        return
      }

      // Format inline bold, italic, code, links
      const formatInline = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g)
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            )
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <em key={i} className="italic text-slate-700">
                {part.slice(1, -1)}
              </em>
            )
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={i}
                className="bg-slate-100 text-[#0a1f44] px-1.5 py-0.5 rounded text-xs font-mono font-medium border border-slate-200"
              >
                {part.slice(1, -1)}
              </code>
            )
          }
          const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
          if (linkMatch) {
            return (
              <a
                key={i}
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#2855a0] hover:text-[#0a1f44] underline font-medium"
              >
                <span>{linkMatch[1]}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )
          }
          return part
        })
      }

      // Headings: ### or ##
      if (line.trim().startsWith('### ')) {
        const heading = line.trim().replace(/^###\s+/, '')
        elements.push(
          <h4
            key={`h3-${index}`}
            className="text-sm font-bold text-[#0a1f44] mt-3 mb-1.5 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-3.5 bg-[#ff9933] rounded-full inline-block" />
            <span>{heading}</span>
          </h4>
        )
        return
      }

      if (line.trim().startsWith('## ')) {
        const heading = line.trim().replace(/^##\s+/, '')
        elements.push(
          <h3
            key={`h2-${index}`}
            className="text-base font-bold text-[#0a1f44] mt-3.5 mb-1.5"
          >
            {heading}
          </h3>
        )
        return
      }

      // Callouts / Blockquotes: >
      if (line.trim().startsWith('> ')) {
        const quoteText = line.trim().replace(/^>\s+/, '')
        elements.push(
          <div
            key={`quote-${index}`}
            className="my-2.5 p-3 rounded-xl bg-amber-50/80 border-l-4 border-[#ff9933] text-amber-950 text-xs sm:text-sm leading-relaxed flex items-start gap-2"
          >
            <Info className="w-4 h-4 text-[#ff9933] flex-shrink-0 mt-0.5" />
            <div className="flex-1">{formatInline(quoteText)}</div>
          </div>
        )
        return
      }

      // Bullet points: • or -
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const bulletText = line.trim().replace(/^([•\-]\s*)/, '')
        elements.push(
          <div key={`bullet-${index}`} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-[#ff9933] text-sm mt-0.5 leading-none">•</span>
            <span className="flex-1 text-sm text-slate-700 leading-relaxed">
              {formatInline(bulletText)}
            </span>
          </div>
        )
        return
      }

      // Numbered items: 1. 2. etc
      const numberedMatch = line.trim().match(/^(\d+)\.\s*(.*)/)
      if (numberedMatch) {
        const [, num, itemText] = numberedMatch
        elements.push(
          <div key={`num-${index}`} className="flex items-start gap-2.5 my-1.5 pl-1">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0a1f44]/10 text-[#0a1f44] text-xs font-bold flex items-center justify-center mt-0.5">
              {num}
            </span>
            <span className="flex-1 text-sm text-slate-700 leading-relaxed">
              {formatInline(itemText)}
            </span>
          </div>
        )
        return
      }

      // Standard paragraph
      elements.push(
        <p key={`p-${index}`} className="text-sm text-slate-700 leading-relaxed my-1">
          {formatInline(line)}
        </p>
      )
    })

    return elements
  }

  // Format relevance score as clean percentage
  const formatRelevance = (score?: number) => {
    if (score === undefined) return '94%'
    if (score > 1) return `${Math.round(score)}%`
    return `${Math.round(score * 100)}%`
  }

  return (
    <div
      className={`flex items-start gap-3 w-full transition-all duration-200 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-xs ${
          isUser
            ? 'bg-[#ff9933] text-white ring-2 ring-orange-200'
            : 'bg-[#0a1f44] text-white ring-2 ring-slate-200'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Scale className="w-4 h-4" strokeWidth={2.5} />}
      </div>

      {/* Message Wrapper */}
      <div
        className={`flex flex-col gap-1.5 max-w-[92%] sm:max-w-[85%] md:max-w-[78%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Name and time header */}
        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400 font-medium">
          <span>{isUser ? 'Citizen' : 'JusticeAI Assistant'}</span>
          <span>•</span>
          <span>{formatTimestamp(message.timestamp)}</span>
        </div>

        {/* Content Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3.5 shadow-sm text-left transition-all w-full ${
            isUser
              ? 'bg-[#0a1f44] text-white rounded-tr-none'
              : message.isError
              ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
              : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-[0_2px_8px_rgba(10,31,68,0.04)]'
          }`}
        >
          {/* RAG Knowledge Retrieval Indicator (Above Answer) */}
          {!isUser && !message.isError && retrieval && (
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#0a1f44] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#ff9933]" />
                <span>
                  Retrieved via Knowledge Base ({retrieval.documentCount || 1} doc
                  {retrieval.documentCount !== 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                  {retrieval.confidence || 'High Confidence'}
                </span>
                {retrieval.confidenceScore && (
                  <span className="text-emerald-700 font-semibold text-[10px]">
                    {formatRelevance(retrieval.confidenceScore)} match
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Formatted Text Content */}
          {isUser ? (
            <p className="text-sm font-normal text-white leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="space-y-0.5 leading-relaxed font-sans">
              {renderFormattedContent(message.content)}
            </div>
          )}

          {/* Suggested follow-up questions from AI (if provided) */}
          {!isUser && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#ff9933]" />
                <span>Suggested Follow-up Inquiries:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {message.suggestedQuestions.map((sq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSuggestedClick && onSuggestedClick(sq)}
                    className="text-xs bg-slate-50 hover:bg-[#e8edf7] text-[#0a1f44] border border-slate-200 hover:border-[#2855a0] px-2.5 py-1 rounded-lg transition-colors text-left font-medium"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assistant Action Bar: Copy button */}
          {!isUser && !message.isError && (
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs">
              {statusInfo ? (
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
                >
                  <statusInfo.icon className="w-3 h-3" />
                  <span>{statusInfo.label}</span>
                  {message.lastChecked && (
                    <span className="opacity-70 font-normal">| {message.lastChecked}</span>
                  )}
                </span>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#0a1f44] transition-colors py-0.5 px-2 rounded hover:bg-slate-100"
                title="Copy response text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── EXPANDABLE SOURCE CITATIONS SECTION (Day 3 Requirement) ── */}
        {!isUser && hasSources && message.sources && (
          <div className="w-full mt-1.5 px-1">
            {/* Header / Toggle Button */}
            <div className="flex items-center justify-between bg-slate-100/90 hover:bg-slate-200/80 rounded-xl px-3 py-2 transition-all cursor-pointer border border-slate-200"
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-[#0a1f44]">
                  Official Citations &amp; Retrieved Sources
                </span>
                <span className="text-[10px] bg-[#0a1f44] text-white px-2 py-0.2 rounded-full font-bold">
                  {message.sources.length}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <span className="text-[11px] hidden sm:inline">
                  {sourcesExpanded ? 'Hide details' : 'Show details'}
                </span>
                {sourcesExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>

            {/* Collapsed View: Quick pill strip */}
            {!sourcesExpanded && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {message.sources.map((src: Source, idx: number) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#0a1f44] bg-white hover:bg-[#e8edf7] border border-slate-200 hover:border-[#2855a0] px-2.5 py-1 rounded-lg font-medium transition-all group shadow-2xs"
                  >
                    <ExternalLink className="w-3 h-3 text-[#ff9933] group-hover:scale-110 transition-transform" />
                    <span className="truncate max-w-[190px]">{src.title}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Expanded View: Full citation details with snippets & relevance */}
            {sourcesExpanded && (
              <div className="mt-2 space-y-2 anim-slide-up">
                {message.sources.map((src: Source, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs text-left transition-all hover:border-[#ff9933]"
                  >
                    {/* Source Top: Category & Relevance */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {src.category || 'Department of Justice'}
                      </span>
                      {src.relevanceScore !== undefined && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {formatRelevance(src.relevanceScore)} Match
                        </span>
                      )}
                    </div>

                    {/* Source Title */}
                    <h5 className="text-xs sm:text-sm font-semibold text-[#0a1f44] mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#ff9933] flex-shrink-0" />
                      <span>{src.title}</span>
                    </h5>

                    {/* Context Snippet (Retrieved passage) */}
                    {src.snippet && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 my-1.5 leading-relaxed italic">
                        "{src.snippet}"
                      </p>
                    )}

                    {/* Direct Portal Link */}
                    <div className="flex items-center justify-between pt-1 mt-1 text-[11px]">
                      <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs font-mono text-[10px]">
                        {src.url}
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#ff9933] hover:text-[#e8871a] font-semibold transition-colors"
                      >
                        <span>Visit Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
