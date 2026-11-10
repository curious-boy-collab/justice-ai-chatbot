import { Plus, MessageSquare, Trash2, X, Clock, Scale } from 'lucide-react'
import type { ChatSession, Language } from '../../types/chat'

interface ChatHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onDeleteSession: (id: string) => void
  onClearAllSessions: () => void
  language: Language
}

export default function ChatHistoryDrawer({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAllSessions,
  language,
}: ChatHistoryDrawerProps) {
  const isHi = language === 'hi'

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr)
      return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-slate-200 z-50 flex flex-col shadow-xl lg:shadow-none lg:static transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#0a1f44] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff9933] flex items-center justify-center text-white font-bold">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">JusticeAI</div>
              <div className="text-[10px] text-blue-200">
                {isHi ? 'संवाद इतिहास' : 'Chat History'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-[#1a3f7c] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3 border-b border-slate-100">
          <button
            onClick={() => {
              onNewSession()
              onClose()
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0a1f44] hover:bg-[#1a3f7c] text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#ff9933]" />
            <span>{isHi ? 'नया संवाद शुरू करें' : 'Start New Conversation'}</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <Clock className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">
                {isHi
                  ? 'कोई पिछला संवाद नहीं है। प्रश्न पूछने पर यहाँ स्वतः सुरक्षित होगा।'
                  : 'No saved conversations. Your chats will automatically appear here.'}
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#e8edf7] text-[#0a1f44] font-semibold border-l-4 border-[#ff9933]'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id)
                    onClose()
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <MessageSquare
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-[#0a1f44]' : 'text-slate-400'
                      }`}
                    />
                    <div className="truncate">
                      <div className="text-xs truncate">{session.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {formatDate(session.updatedAt)} • {session.messages.length}{' '}
                        {isHi ? 'संदेश' : 'msgs'}
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-white transition-opacity"
                    title={isHi ? 'संवाद हटाएं' : 'Delete chat'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer actions */}
        {sessions.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <button
              onClick={onClearAllSessions}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'सभी इतिहास साफ़ करें' : 'Clear All History'}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
