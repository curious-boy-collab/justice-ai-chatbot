import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import ServicesPage from './pages/ServicesPage'
import NJDGDashboard from './pages/NJDGDashboard'
import JudgeVacancyPage from './pages/JudgeVacancyPage'
import EFilingPage from './pages/EFilingPage'
import TeleLawPage from './pages/TeleLawPage'
import FTSCPage from './pages/FTSCPage'
import ECourtsAppPage from './pages/ECourtsAppPage'
import CaseStatusPage from './pages/CaseStatusPage'
import type { ServicePageTarget } from './pages/ServicesPage'

export type Page =
  | 'landing'
  | 'chat'
  | 'services'
  | 'njdg'
  | 'judge-vacancy'
  | 'efiling'
  | 'telelaw'
  | 'ftsc'
  | 'ecourts-app'
  | 'case-status'

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

  const handleNavigateService = (target: ServicePageTarget) => {
    setPage(target)
  }

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return (
          <LandingPage
            onStartChat={handleStartChat}
            onNavigateServices={() => setPage('services')}
            onNavigatePage={(p) => setPage(p)}
          />
        )
      case 'chat':
        return <ChatPage onBack={handleBackToLanding} initialQuery={initialQuery} />
      case 'services':
        return (
          <ServicesPage
            onBack={handleBackToLanding}
            onNavigate={handleNavigateService}
            onStartChat={handleStartChat}
          />
        )
      case 'njdg':
        return <NJDGDashboard onBack={() => setPage('services')} onStartChat={handleStartChat} />
      case 'judge-vacancy':
        return <JudgeVacancyPage onBack={() => setPage('services')} onStartChat={handleStartChat} />
      case 'efiling':
        return <EFilingPage onBack={() => setPage('services')} onStartChat={handleStartChat} />
      case 'telelaw':
        return <TeleLawPage onBack={() => setPage('services')} onStartChat={handleStartChat} />
      case 'ftsc':
        return <FTSCPage onBack={() => setPage('services')} onStartChat={handleStartChat} />
      case 'ecourts-app':
        return <ECourtsAppPage onBack={() => setPage('services')} onStartChat={handleStartChat} />
      case 'case-status':
        return <CaseStatusPage onBack={() => setPage('services')} onStartChat={handleStartChat} />
      default:
        return <LandingPage onStartChat={handleStartChat} onNavigateServices={() => setPage('services')} />
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col font-sans">
      {renderPage()}
    </div>
  )
}

export default App
