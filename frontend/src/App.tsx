import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'

export type Page = 'landing' | 'chat'

function App() {
  const [page, setPage] = useState<Page>('landing')
  const [initialQuery, setInitialQuery] = useState<string | undefined>()

  const handleStartChat = (query?: string) => {
    setInitialQuery(query)
    setPage('chat')
  }

  const handleBackToLanding = () => {
    setInitialQuery(undefined)
    setPage('landing')
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col font-sans">
      {page === 'landing' ? (
        <LandingPage onStartChat={handleStartChat} />
      ) : (
        <ChatPage onBack={handleBackToLanding} initialQuery={initialQuery} />
      )}
    </div>
  )
}

export default App
