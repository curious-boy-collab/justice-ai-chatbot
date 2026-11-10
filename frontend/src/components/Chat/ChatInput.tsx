import { useState, useRef, useEffect } from 'react'
import { Send, X, Sparkles } from 'lucide-react'
import type { Language } from '../../types/chat'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  language: Language
  placeholder?: string
}

export default function ChatInput({
  onSend,
  isLoading,
  language,
  placeholder,
}: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`
    }
  }, [text])

  const defaultPlaceholder =
    language === 'hi'
      ? 'न्याय विभाग की सेवाओं, केस स्टेटस, या न्यायिक आँकड़ों के बारे में पूछें...'
      : 'Ask about Department of Justice services, case status, judge vacancies, eFiling...'

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return
    onSend(text.trim())
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleClear = () => {
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Input Card Container */}
        <div
          className={`flex items-end gap-2 bg-slate-50 border rounded-2xl p-2 transition-all shadow-inner ${
            isLoading
              ? 'opacity-70 border-slate-200'
              : 'border-slate-300 focus-within:border-[#0a1f44] focus-within:ring-2 focus-within:ring-[#0a1f44]/10 focus-within:bg-white'
          }`}
        >
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={placeholder || defaultPlaceholder}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none max-h-36 min-h-[42px] leading-relaxed"
          />

          {/* Clear Button */}
          {text.trim() && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className={`flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all shadow-sm ${
              text.trim() && !isLoading
                ? 'bg-[#0a1f44] hover:bg-[#1a3f7c] text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={language === 'hi' ? 'भेजें (Enter)' : 'Send message (Enter)'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Footer Guidance Info */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 mt-2 px-1 gap-2">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#ff9933]" />
            <span>
              {language === 'hi'
                ? 'आधिकारिक DoJ, eCourts एवं NJDG संदर्भों पर आधारित'
                : 'Verified via official DoJ, eCourts & NJDG records'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-600 shadow-2xs">
              Enter
            </kbd>
            <span>to send,</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-600 shadow-2xs">
              Shift + Enter
            </kbd>
            <span>for new line</span>
          </div>
        </div>
      </div>
    </div>
  )
}
