import {
  Home, MessageSquare, BarChart3, Users, Scale,
  FileText, Smartphone, Phone, Gavel, X, ChevronRight
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (section: string) => void
  activeSection: string
}

const navItems = [
  { id: 'home',       icon: Home,          label: 'Home',                labelHi: 'होम' },
  { id: 'chat',       icon: MessageSquare, label: 'Chat Assistant',      labelHi: 'चैट सहायक' },
  { id: 'statistics', icon: BarChart3,     label: 'Court Statistics',    labelHi: 'न्यायालय आँकड़े' },
  { id: 'judges',     icon: Users,         label: 'Judge Vacancies',     labelHi: 'न्यायाधीश रिक्तियाँ' },
  { id: 'efiling',    icon: FileText,      label: 'eFiling & ePay',      labelHi: 'ई-फाइलिंग और ई-पेय' },
  { id: 'ecourts',    icon: Smartphone,    label: 'eCourts App',         labelHi: 'ई-कोर्ट ऐप' },
  { id: 'telelaw',    icon: Phone,         label: 'Tele-Law',            labelHi: 'टेली-लॉ' },
  { id: 'ftsc',       icon: Gavel,         label: 'Fast Track Courts',   labelHi: 'फास्ट ट्रैक कोर्ट' },
  { id: 'cases',      icon: Scale,         label: 'Case Status',         labelHi: 'केस स्थिति' },
]

export default function Sidebar({ isOpen, onClose, onNavigate, activeSection }: SidebarProps) {
  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-100
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header */}
        <div className="bg-[#0a1f44] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-base">Navigation</div>
            <div className="text-blue-200 text-xs">JusticeAI Portal</div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-[#1a3f7c] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="py-3 overflow-y-auto h-[calc(100%-120px)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose() }}
                className={`
                  w-full flex items-center gap-3 px-5 py-3 text-sm font-medium
                  transition-all duration-150 group text-left
                  ${isActive
                    ? 'bg-[#e8edf7] text-[#0a1f44] border-r-4 border-[#ff9933]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0a1f44]'
                  }
                `}
              >
                <Icon
                  className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-[#ff9933]' : 'text-gray-400 group-hover:text-[#0a1f44]'}`}
                  size={18}
                />
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  size={14}
                  className={`text-gray-300 ${isActive ? 'text-[#ff9933]' : 'group-hover:text-gray-400'}`}
                />
              </button>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-[#f0f4fb] border-t border-gray-100">
          <div className="text-xs text-gray-500 leading-relaxed">
            🇮🇳 Official AI Assistant<br />
            <span className="text-[#0a1f44] font-medium">Dept. of Justice · GoI</span>
          </div>
        </div>
      </aside>
    </>
  )
}
