import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'

export type Page = 'landing' | 'chat'

function App() {
  const [page, setPage] = useState<Page>('landing')

  return (
    <div className="min-h-screen bg-[#f8fafd]">
      {page === 'landing' ? (
        <LandingPage onStartChat={() => setPage('chat')} />
      ) : (
        <ChatPage onBack={() => setPage('landing')} />
      )}
    </div>
  )
}

export default App
