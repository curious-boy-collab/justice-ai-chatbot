import { useState, useRef, useEffect } from 'react'
import {
  Send, Bot, User, RefreshCw, Scale, Info, ExternalLink, Mic
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
  sources?: { label: string; url: string }[]
  isLiveData?: boolean
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  text: 'Namaste! 🙏 I am JusticeAI, your digital assistant for the Department of Justice, Government of India.\n\nI can help you with:\n• Case status lookup\n• Judge appointments & vacancies\n• Court statistics (NJDG)\n• eFiling & ePay guidance\n• Tele-Law services\n• Fast Track Special Courts\n• Traffic fine payment\n• eCourts mobile app\n\nHow can I assist you today? (आप हिंदी में भी पूछ सकते हैं)',
  timestamp: new Date(),
  sources: [
    { label: 'Department of Justice', url: 'https://doj.gov.in' },
    { label: 'eCourts Services', url: 'https://ecourts.gov.in' },
  ],
}

// Demo responses for suggested questions
const DEMO_RESPONSES: Record<string, Omit<Message, 'id' | 'role' | 'timestamp'>> = {
  'case status': {
    text: 'To check your **case status**, you can:\n\n1. **Online (eCourts Portal):** Visit https://ecourts.gov.in and use the Case Status search with CNR number.\n2. **Mobile App:** Download the eCourts Services App (Android/iOS) and search by CNR, party name, or filing number.\n3. **SMS:** Send SMS to 9766899899 with format: `ECOURTS <CNR_NUMBER>`\n4. **IVR:** Call 1800-200-0498 (toll-free).\n\n⚠️ Note: This is guidance only. Live case status is retrieved from the official eCourts system.',
    sources: [
      { label: 'eCourts Case Status', url: 'https://ecourts.gov.in/ecourts_home/static/case-status.php' },
    ],
  },
  'njdg statistics': {
    text: 'The **National Judicial Data Grid (NJDG)** provides real-time case pendency data:\n\n📊 **Current Statistics (Demo — verify at NJDG):**\n• Supreme Court: ~80,000+ pending cases\n• High Courts: ~60 lakh+ pending cases\n• District & Subordinate Courts: ~4.4 crore+ pending cases\n\n🔗 Access live data at: https://njdg.ecourts.gov.in\n\n⚠️ These are approximate figures. For verified, real-time data please visit the official NJDG portal.',
    isLiveData: false,
    sources: [
      { label: 'NJDG Portal', url: 'https://njdg.ecourts.gov.in' },
    ],
  },
  'judge vacancies': {
    text: 'Here is the current judge appointment overview:\n\n**Supreme Court of India:**\n• Sanctioned Strength: 34\n• Working Strength: ~32 (as of last update)\n\n**High Courts (combined):**\n• Sanctioned Strength: 1,122\n• Current Vacancies: ~350+ (varies)\n\n**District & Subordinate Courts:**\n• Sanctioned Strength: ~25,000+\n\n📋 Vacancy notifications are published on the Department of Justice website.\n\n⚠️ These are indicative figures. Verify at the official DoJ portal for current data.',
    isLiveData: false,
    sources: [
      { label: 'DoJ – Judge Vacancies', url: 'https://doj.gov.in/judges-appointment' },
    ],
  },
  'efiling & epay': {
    text: 'Here is a step-by-step guide for **eFiling & ePay**:\n\n**Step 1 — Register:** Go to https://filing.ecourts.gov.in and create an account.\n**Step 2 — Login:** Use your registered credentials.\n**Step 3 — New Case:** Click "File New Case", select court, case type.\n**Step 4 — Upload Documents:** Attach petition (PDF), vakalatnama, and supporting docs.\n**Step 5 — Pay Court Fee (ePay):** Select payment mode (UPI/Net Banking/Card). Fee is calculated automatically.\n**Step 6 — Submit & Track:** Note your filing number. Track status under "My Cases".\n\n📱 You can also use the eCourts Services mobile app for convenience.',
    sources: [
      { label: 'eFiling Portal', url: 'https://filing.ecourts.gov.in' },
      { label: 'eCourts ePay', url: 'https://pay.ecourts.gov.in' },
    ],
  },
  'tele-law': {
    text: '**Tele-Law** connects citizens in rural areas with lawyers via video conferencing at Common Service Centres (CSCs).\n\n**How to Access Tele-Law:**\n1. Visit your nearest **Common Service Centre (CSC)** — over 5 lakh CSCs across India.\n2. The VLE (Village Level Entrepreneur) connects you to a lawyer.\n3. Free for BPL/SC/ST categories; nominal fee for others.\n\n**Key Features:**\n• Pre-litigation advice\n• Legal awareness sessions\n• Available in 11+ languages\n• Covers 5+ lakh villages\n\n📞 Helpline: 1800-200-7514\n🌐 Portal: https://tele-law.in',
    sources: [
      { label: 'Tele-Law Official Portal', url: 'https://tele-law.in' },
      { label: 'CSC Locator', url: 'https://locator.csccloud.in' },
    ],
  },
}

function getDemoResponse(input: string): Omit<Message, 'id' | 'role' | 'timestamp'> {
  const lower = input.toLowerCase()
  if (lower.includes('case') && lower.includes('status'))
    return DEMO_RESPONSES['case status']
  if (lower.includes('njdg') || lower.includes('pendency') || lower.includes('statistics'))
    return DEMO_RESPONSES['njdg statistics']
  if (lower.includes('vacanc') || lower.includes('judge'))
    return DEMO_RESPONSES['judge vacancies']
  if (lower.includes('efil') || lower.includes('epay') || lower.includes('filing'))
    return DEMO_RESPONSES['efiling & epay']
  if (lower.includes('tele') || lower.includes('telelaw'))
    return DEMO_RESPONSES['tele-law']
  return {
    text: `Thank you for your query: **"${input}"**\n\nIn the full implementation, this will be answered by the Gemini-powered RAG backend using official Department of Justice data sources.\n\n🔧 Backend integration is in progress (Day 2–3 of the sprint).\n\nMeanwhile, try one of the suggested topics:\n• Case Status Lookup\n• NJDG Statistics\n• Judge Vacancies\n• eFiling & ePay\n• Tele-Law Services`,
  }
}

interface ChatBoxProps {
  initialQuery?: string
}

export default function ChatBox({ initialQuery }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Handle initial query from landing page suggestion cards
  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text?: string) => {
    const query = (text ?? input).trim()
    if (!query) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate network delay
    setTimeout(() => {
      const response = getDemoResponse(query)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        timestamp: new Date(),
        ...response,
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE])
    setInput('')
  }

  const renderText = (text: string) => {
    // Basic markdown-like rendering
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return (
        <span key={i} className="block" dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />
      )
    })
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Chat header */}
      <div className="bg-[#0a1f44] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#ff9933] rounded-full p-1.5">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm">JusticeAI Assistant</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-blue-200">Online · AI-powered</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] bg-[#102e68] px-2 py-0.5 rounded-full text-blue-200 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Demo Mode
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-md hover:bg-[#1a3f7c] transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#f8fafd]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`msg-animate flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'assistant' ? 'bg-[#0a1f44]' : 'bg-[#ff9933]'
            }`}>
              {msg.role === 'assistant'
                ? <Scale className="w-4 h-4 text-white" />
                : <User className="w-4 h-4 text-white" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#0a1f44] text-white rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm'
                }`}
              >
                {renderText(msg.text)}
              </div>

              {/* Live data badge */}
              {msg.isLiveData === false && (
                <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                  ⚠️ Demo data — verify at official source
                </span>
              )}

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {msg.sources.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-[#0a1f44] bg-[#e8edf7]
                                 hover:bg-[#d0dcf0] px-2 py-0.5 rounded-full transition-colors font-medium"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {s.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <span className="text-[10px] text-gray-400">
                {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="msg-animate flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0a1f44] flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-100 px-4 py-3 bg-white flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about DoJ services... (English या हिंदी)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50
                       px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400
                       focus:outline-none focus:border-[#0a1f44] focus:bg-white
                       focus:ring-2 focus:ring-[#0a1f44]/10 transition-all
                       max-h-32 min-h-[44px]"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => void 0}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
            title="Voice input (coming soon)"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-[#0a1f44] text-white
                       hover:bg-[#102e68] disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors flex-shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          AI responses may not always be accurate. Verify critical info at official sources.
        </p>
      </div>
    </div>
  )
}
