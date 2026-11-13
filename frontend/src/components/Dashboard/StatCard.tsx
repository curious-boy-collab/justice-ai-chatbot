import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  badge?: string
  badgeColor?: 'green' | 'red' | 'orange' | 'blue'
  isLive?: boolean
}

const badgeColors: Record<string, string> = {
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100   text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  blue:   'bg-blue-100   text-blue-700',
}

const trendIcons = {
  up:      TrendingUp,
  down:    TrendingDown,
  neutral: Minus,
}

const trendColors = {
  up:      'text-green-600',
  down:    'text-red-500',
  neutral: 'text-gray-400',
}

export default function StatCard({
  title, value, subtitle, icon: Icon, trend, trendValue, badge, badgeColor = 'blue', isLive = false,
}: StatCardProps) {
  const TrendIcon = trend ? trendIcons[trend] : null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 flex flex-col gap-3 gov-card">
      <div className="flex items-start justify-between">
        <div className="bg-[#e8edf7] rounded-xl p-2.5">
          <Icon className="w-5 h-5 text-[#0a1f44]" />
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          )}
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-[#0a1f44] leading-none">{value}</div>
        <div className="text-sm text-gray-500 mt-1 font-medium">{title}</div>
        {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
      </div>

      {trend && TrendIcon && trendValue && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColors[trend]}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {trendValue}
        </div>
      )}
    </div>
  )
}
