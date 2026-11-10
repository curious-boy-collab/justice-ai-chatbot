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
} from 'lucide-react'
import type { Message, DataStatus } from '../../types/chat'

interface ChatMessageProps {
  message: Message
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
    label: 'Demonstration / Offline Mode',
    labelHi: 'प्रदर्शन / ऑफ़लाइन मोड',
    icon: AlertCircle,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts)
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    } catch {
      return ''
    }
  }

  const statusInfo = message.dataStatus ? STATUS_CONFIG[message.dataStatus] : null

  // Clean Markdown Parser
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []

    lines.forEach((line, index) => {
      // Empty line -> spacing
      if (!line.trim()) {
        elements.push(<div key={`empty-${index}`} className="h-2" />)
        return
      }

      // Format inline bold, italic, code
      const formatInline = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)
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
          return part
        })
      }

      // Bullet points
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

  return (
    <div
      className={`flex items-start gap-3 w-full transition-all duration-200 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isUser
            ? 'bg-[#ff9933] text-white ring-2 ring-orange-200'
            : 'bg-[#0a1f44] text-white ring-2 ring-slate-200'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Scale className="w-4 h-4" strokeWidth={2.5} />}
      </div>

      {/* Message Box */}
      <div
        className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[78%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Name and time header */}
        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400 font-medium">
          <span>{isUser ? 'Citizen' : 'JusticeAI Digital Assistant'}</span>
          <span>•</span>
          <span>{formatTimestamp(message.timestamp)}</span>
        </div>

        {/* Content Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3.5 shadow-sm text-left transition-all ${
            isUser
              ? 'bg-[#0a1f44] text-white rounded-tr-none'
              : message.isError
              ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
              : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-[0_2px_8px_rgba(10,31,68,0.04)]'
          }`}
        >
          {isUser ? (
            <p className="text-sm font-normal text-white leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="space-y-0.5">{renderFormattedContent(message.content)}</div>
          )}

          {/* Assistant Action Bar: Copy button */}
          {!isUser && !message.isError && (
            <div className="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#0a1f44] transition-colors py-0.5 px-1.5 rounded hover:bg-slate-100"
                title="Copy response"
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

        {/* Status Badge */}
        {!isUser && statusInfo && (
          <div className="flex items-center gap-2 px-1">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
            >
              <statusInfo.icon className="w-3 h-3" />
              {statusInfo.label}
              {message.lastChecked && (
                <span className="opacity-75 font-normal">| {message.lastChecked}</span>
              )}
            </span>
          </div>
        )}

        {/* Source Citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-1 px-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <span>Verified Official Sources &amp; Citations:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {message.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0a1f44] bg-slate-50 hover:bg-[#e8edf7] border border-slate-200 hover:border-[#2855a0] px-3 py-1.5 rounded-lg font-medium transition-all group"
                >
                  <ExternalLink className="w-3 h-3 text-[#ff9933] group-hover:scale-110 transition-transform" />
                  <span className="truncate max-w-[220px]">{src.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
