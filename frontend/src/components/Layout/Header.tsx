import { Scale, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  onLogoClick?: () => void
  onNavigate?: (page: string) => void
  currentPage?: string
}

export default function Header({ onLogoClick, onNavigate, currentPage = 'home' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<'EN' | 'HI'>('EN')

  const navLinks = [
    { label: lang === 'EN' ? 'Home' : 'होम', action: 'home' },
    { label: lang === 'EN' ? 'Services' : 'सेवाएं', action: 'services' },
    { label: lang === 'EN' ? 'Statistics' : 'आँकड़े', action: 'njdg' },
    { label: lang === 'EN' ? 'About' : 'परिचय', action: 'about' },
    { label: lang === 'EN' ? 'Contact' : 'संपर्क', action: 'contact' },
  ]

  const handleNavClick = (action: string) => {
    if (action === 'home' && onLogoClick) {
      onLogoClick()
    } else if (onNavigate) {
      onNavigate(action)
    }
    setMenuOpen(false)
  }

  return (
    <header className="bg-[#0a1f44] text-white shadow-md sticky top-0 z-50">
      {/* Tricolour top bar */}
      <div className="gov-header-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + wordmark */}
          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-95 transition-opacity text-left rounded-lg p-1 -ml-1 focus-visible:ring-2 focus-visible:ring-[#ff9933]"
            aria-label="JusticeAI - Return to Department of Justice Portal Home"
          >
            <div className="bg-[#ff9933] rounded-full p-2 flex-shrink-0 shadow-sm">
              <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-base tracking-wide flex items-center gap-2">
                <span>JusticeAI</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#102e68] text-blue-200 px-1.5 py-0.2 rounded border border-blue-400/30">
                  Gov of India
                </span>
              </div>
              <div className="text-[10px] text-blue-200 font-medium hidden sm:block">
                Dept. of Justice · Ministry of Law &amp; Justice · GoI
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main Navigation">
            {navLinks.map((l) => {
              const isActive = currentPage === l.action || (currentPage === 'landing' && l.action === 'home')
              return (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => handleNavClick(l.action)}
                  className={`transition-colors bg-transparent border-none cursor-pointer py-1 relative ${
                    isActive
                      ? 'text-[#ff9933] font-semibold'
                      : 'text-blue-100 hover:text-[#ff9933]'
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff9933] rounded-full" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#102e68] hover:bg-[#1a3f7c] border border-blue-400/30 px-3 py-1.5 rounded-full transition-colors active:scale-95 text-blue-100"
              aria-label={lang === 'EN' ? 'Switch interface to Hindi' : 'Switch interface to English'}
            >
              <Globe className="w-3.5 h-3.5 text-[#ff9933]" />
              <span>{lang === 'EN' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-[#102e68] text-blue-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#ff9933]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden py-3 border-t border-[#1a3f7c] animate-fadeIn" aria-label="Mobile Navigation">
            {navLinks.map((l) => {
              const isActive = currentPage === l.action || (currentPage === 'landing' && l.action === 'home')
              return (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => handleNavClick(l.action)}
                  className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#102e68] text-[#ff9933] font-semibold'
                      : 'text-blue-100 hover:bg-[#102e68]/60 hover:text-[#ff9933]'
                  }`}
                >
                  {l.label}
                </button>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
