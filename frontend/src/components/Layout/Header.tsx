import { Scale, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  onLogoClick?: () => void
  onNavigate?: (page: string) => void
}

export default function Header({ onLogoClick, onNavigate }: HeaderProps) {
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
    <header className="bg-[#0a1f44] text-white shadow-lg sticky top-0 z-50">
      {/* Tricolour top bar */}
      <div className="gov-header-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + wordmark */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
          >
            <div className="bg-[#ff9933] rounded-full p-2 flex-shrink-0">
              <Scale className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-base tracking-wide">JusticeAI</div>
              <div className="text-[10px] text-blue-200 font-medium hidden sm:block">
                Dept. of Justice · Ministry of Law &amp; Justice · GoI
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNavClick(l.action)}
                className="text-blue-100 hover:text-[#ff9933] transition-colors bg-transparent border-none cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="flex items-center gap-1.5 text-xs font-semibold bg-[#102e68] hover:bg-[#1a3f7c] px-3 py-1.5 rounded-full transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'EN' ? 'हिंदी' : 'English'}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-[#102e68] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-[#1a3f7c]">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNavClick(l.action)}
                className="block w-full text-left py-2 text-sm text-blue-100 hover:text-[#ff9933] transition-colors bg-transparent border-none cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
