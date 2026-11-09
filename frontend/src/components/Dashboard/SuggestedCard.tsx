import { LucideIcon, ArrowRight } from 'lucide-react'

interface SuggestedCardProps {
  icon: LucideIcon
  title: string
  description: string
  query: string
  accentColor?: string
  onClick: (query: string) => void
}

export default function SuggestedCard({
  icon: Icon, title, description, query, accentColor = '#0a1f44', onClick
}: SuggestedCardProps) {
  return (
    <button
      onClick={() => onClick(query)}
      className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm
                 hover:shadow-md hover:border-[#c5cfe8] hover:-translate-y-0.5
                 transition-all duration-200 group w-full"
    >
      <div className="flex items-start gap-3">
        <div
          className="rounded-xl p-2.5 flex-shrink-0"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#0a1f44] text-sm mb-0.5 group-hover:text-[#102e68]">
            {title}
          </div>
          <div className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {description}
          </div>
        </div>
        <ArrowRight
          className="w-4 h-4 text-gray-300 group-hover:text-[#ff9933] group-hover:translate-x-0.5
                     transition-all flex-shrink-0 mt-0.5"
        />
      </div>
    </button>
  )
}
