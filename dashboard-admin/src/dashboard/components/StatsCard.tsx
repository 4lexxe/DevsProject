import { LucideIcon } from 'lucide-react'
import { cn } from '@utils/cn'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={cn(
              'text-sm font-medium',
              trendUp ? 'text-green-600' : 'text-red-600'
            )}>
              {trend}
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
