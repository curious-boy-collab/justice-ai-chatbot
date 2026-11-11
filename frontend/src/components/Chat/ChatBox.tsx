import { useState, useRef, useEffect, useCallback } from 'react'
import {
  RotateCcw,
  Globe,
  PanelLeft,
  AlertTriangle,
  RefreshCw,
  Scale,
  Sparkles,
  Phone,
  FileSearch,
} from 'lucide-react'
import type { Message, ChatSession, Language } from '../../types/chat'
import { sendChatMessage } from '../../services/chatApi'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SuggestedPrompts from './SuggestedPrompts'
import EmptyState from './EmptyState'
import ChatHistoryDrawer from './ChatHistoryDrawer'
import NoResultsCard from './NoResultsCard'

const STORAGE_KEY = 'justice_ai_chat_sessions_v3'
const ACTIVE_SESSION_KEY = 'justice_ai_active_session_v3'
const LANG_STORAGE_KEY = 'justice_ai_language_v3'

interface ChatBoxProps {
  initialQuery?: string
  defaultLanguage?: Language
}

const RAG_LOADING_STAGES_EN = [
  'Searching official Department of Justice knowledge base...',
  'Retrieving verified legal documents & court procedural guides...',
  'Synthesizing grounded response with source citations...',
]

const RAG_LOADING_STAGES_HI = [
  'न्याय विभाग के आधिकारिक ज्ञानकोष में खोज की जा रही है...',
  'सत्यापित विधिक अभिलेख एवं न्यायालय मार्गदर्शिकाएँ प्राप्त की जा रही हैं...',
  'सत्यापित संदर्भों के साथ उत्तर तैयार किया जा रहा है...',
]

export default function ChatBox({
  initialQuery,
  defaultLanguage = 'en',
}: ChatBoxProps) {
  // 1. Language State
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    return saved === 'hi' || saved === 'en' ? saved : defaultLanguage
  })

  // 2. Chat Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // ignore
    }
    return []
  })

  // 3. Active Session ID
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_SESSION_KEY) || ''
  })

  // 4. Loading & Error States
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStageIdx, setLoadingStageIdx] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastQueryFailed, setLastQueryFailed] = useState<string | null>(null)

  // 5. Drawer UI State
  const [historyOpen, setHistoryOpen] = useState(false)

  // Scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Rotate loading stages during active RAG processing
  useEffect(() => {
    if (!isLoading) {
      setLoadingStageIdx(0)
      return
    }
    const interval = setInterval(() => {
      setLoadingStageIdx((prev) => (prev + 1) % 3)
    }, 1800)
    return () => clearInterval(interval)
  }, [isLoading])

  // Persist language
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, language)
  }, [language])

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    } catch {
      // ignore quota exceeded
    }
  }, [sessions])

  // Persist active session id
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId)
    }
  }, [activeSessionId])

  // Get active session
  const getActiveSession = useCallback((): ChatSession | null => {
    return sessions.find((s) => s.id === activeSessionId) || null
  }, [sessions, activeSessionId])

  const activeSession = getActiveSession()
  const messages: Message[] = activeSession ? activeSession.messages : []

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Handle New Session Creation
  const handleNewSession = useCallback(() => {
    const newId = `session-${Date.now()}`
    const newSession: ChatSession = {
      id: newId,
      title: language === 'hi' ? 'नया संवाद' : 'New Inquiries',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language,
      messages: [],
    }

    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newId)
    setErrorMessage(null)
    setLastQueryFailed(null)
    return newSession
  }, [language])

  // Initialize session if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewSession()
    } else if (!activeSessionId) {
      setActiveSessionId(sessions[0].id)
    }
  }, [sessions, activeSessionId, handleNewSession])

  // Send Message Handler
  const handleSendMessage = async (queryText: string) => {
    const cleanQuery = queryText.trim()
    if (!cleanQuery || isLoading) return

    setErrorMessage(null)
    setLastQueryFailed(null)

    // Ensure we have an active session
    let targetSession = activeSession
    if (!targetSession) {
      targetSession = handleNewSession()
    }

    // 1. Add User Message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: cleanQuery,
      timestamp: new Date().toISOString(),
    }

    // Generate smart session title
    const updatedTitle =
      targetSession.messages.length === 0
        ? cleanQuery.length > 36
          ? `${cleanQuery.slice(0, 36)}...`
          : cleanQuery
        : targetSession.title

    const updatedMessages = [...targetSession.messages, userMessage]

    setSessions((prev) =>
      prev.map((s) =>
        s.id === targetSession!.id
          ? {
              ...s,
              title: updatedTitle,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            }
          : s
      )
    )

    // 2. Trigger AI / Backend Call
    setIsLoading(true)

    try {
      const response = await sendChatMessage({
        query: cleanQuery,
        language,
        sessionId: targetSession.id,
      })

      const answerText = response.answer || response.reply || ''
      const hasSources = Boolean(response.sources && response.sources.length > 0)
      const isNoResults = !hasSources && answerText.includes('No Verified') || answerText.includes('कोई प्रासंगिक')

      // 3. Add Assistant Message with rich RAG metadata
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answerText,
        timestamp: new Date().toISOString(),
        sources: response.sources,
        dataStatus: response.dataStatus,
        lastChecked: response.lastChecked,
        retrieval: response.retrieval,
        dataFreshness: response.dataFreshness,
        suggestedQuestions: response.suggestedQuestions,
        isNoResults,
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSession!.id
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, assistantMessage],
              }
            : s
        )
      )
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : language === 'hi'
          ? 'उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Unable to reach the justice database. Please retry.'

      setErrorMessage(errMsg)
      setLastQueryFailed(cleanQuery)

      // Add inline error message
      const errorBubble: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? `⚠️ **सिस्टम सूचना:** अनुरोध संसाधित करने में समस्या आई (${errMsg})। कृपया 'पुनः प्रयास करें' पर क्लिक करें अथवा आधिकारिक पोर्टल doj.gov.in देखें।`
            : `⚠️ **System Notice:** Could not complete query (${errMsg}). Please click Retry below or check official portals at doj.gov.in.`,
        timestamp: new Date().toISOString(),
        isError: true,
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSession!.id
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, errorBubble],
              }
            : s
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Initial Query from landing page
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  // Language Toggle
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))
  }

  // Delete Session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id)
      if (filtered.length === 0) {
        setActiveSessionId('')
      } else if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id)
      }
      return filtered
    })
  }

  // Clear All Sessions
  const handleClearAllSessions = () => {
    setSessions([])
    setActiveSessionId('')
    handleNewSession()
  }

  const isHi = language === 'hi'
  const currentLoadingMessage = isHi
    ? RAG_LOADING_STAGES_HI[loadingStageIdx]
    : RAG_LOADING_STAGES_EN[loadingStageIdx]

  // Check if last message is a no-results state
  const lastMessage = messages[messages.length - 1]
  const showNoResultsCard = Boolean(
    lastMessage &&
      lastMessage.role === 'assistant' &&
      lastMessage.isNoResults &&
      !isLoading
  )

  return (
    <div className="flex h-full w-full bg-slate-50 relative overflow-hidden rounded-2xl border border-slate-200/90 shadow-xs">
      {/* 1. Chat History Drawer / Sidebar */}
      <ChatHistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id)
          setErrorMessage(null)
        }}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        language={language}
      />

      {/* 2. Main Conversational Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
        {/* Top Chat Toolbar */}
        <div className="h-14 px-3 sm:px-6 bg-[#0a1f44] text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          {/* Left: History drawer toggle & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a3f7c] transition-colors"
              title={isHi ? 'इतिहास दिखाएं' : 'Toggle history'}
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-xs sm:text-sm truncate">
                  {activeSession?.title || (isHi ? 'न्यायिक चैट' : 'Justice Assistant')}
                </span>
                <span className="hidden md:inline text-xs text-blue-200 ml-2 font-normal">
                  (RAG • DoJ Knowledge Base)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Language switch & New Chat */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Selector */}
            <button
              onClick={handleToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#102e68] hover:bg-[#1a3f7c] border border-blue-400/30 text-xs font-semibold text-white transition-all shadow-2xs"
              title={isHi ? 'Switch to English' : 'हिंदी में बदलें'}
            >
              <Globe className="w-3.5 h-3.5 text-[#ff9933]" />
              <span className="text-xs">{isHi ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Clear / New Conversation */}
            <button
              onClick={handleNewSession}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
              title={isHi ? 'नया संवाद' : 'New chat'}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">{isHi ? 'नया' : 'New'}</span>
            </button>
          </div>
        </div>

        {/* Messages / Empty State Canvas */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col space-y-4">
          {messages.length === 0 ? (
            <EmptyState
              language={language}
              onSelectPrompt={handleSendMessage}
              onToggleLanguage={handleToggleLanguage}
            />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onSuggestedClick={handleSendMessage}
                />
              ))}

              {/* No-Results Dedicated Action Card */}
              {showNoResultsCard && (
                <NoResultsCard
                  query={
                    messages.filter((m) => m.role === 'user').slice(-1)[0]?.content ||
                    'your query'
                  }
                  language={language}
                  onSelectPrompt={handleSendMessage}
                  onRetry={() => {
                    const lastUser = messages.filter((m) => m.role === 'user').slice(-1)[0]
                    if (lastUser) handleSendMessage(lastUser.content)
                  }}
                />
              )}

              {/* AI Thinking / Multi-Stage RAG Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 w-full anim-slide-up">
                  <div className="w-8 h-8 rounded-full bg-[#0a1f44] text-white flex items-center justify-center ring-2 ring-slate-200">
                    <Scale className="w-4 h-4 animate-bounce text-[#ff9933]" strokeWidth={2.3} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs max-w-[85%] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0a1f44]">
                      <FileSearch className="w-4 h-4 text-[#ff9933] animate-pulse" />
                      <span>{currentLoadingMessage}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pl-6">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>

                    <div className="text-[10px] text-slate-400 pl-6 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Cross-referencing DoJ, eCourts &amp; NJDG documents...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Notice with Retry */}
              {errorMessage && lastQueryFailed && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>
                      {isHi
                        ? 'सर्वर से संपर्क नहीं हो सका। स्थानीय सत्यापित बैकअप से उत्तर प्रदर्शित किया गया है।'
                        : 'Could not reach live backend server. Grounded fallback records are active.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleSendMessage(lastQueryFailed)}
                      className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{isHi ? 'पुनः प्रयास' : 'Retry'}</span>
                    </button>
                    <a
                      href="tel:1800-11-7000"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-[#0a1f44] border border-slate-300 rounded-lg transition-colors font-medium"
                    >
                      <Phone className="w-3 h-3 text-[#ff9933]" />
                      <span>1800-11-7000</span>
                    </a>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggested Prompt Chips (Visible when chat is underway) */}
        {messages.length > 0 && !isLoading && (
          <div className="border-t border-slate-100 bg-slate-50/80 py-1.5">
            <SuggestedPrompts
              language={language}
              onSelectPrompt={handleSendMessage}
              variant="chips"
            />
          </div>
        )}

        {/* Message Input Bar */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          language={language}
        />
      </div>
    </div>
  )
}
