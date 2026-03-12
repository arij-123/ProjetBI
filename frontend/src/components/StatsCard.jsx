import React from 'react'
import { cn } from '../utils/cn'

const StatsCard = ({ icon, title, value, description, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 border-primary-200 text-primary-700',
    secondary: 'bg-secondary-50 border-secondary-200 text-secondary-700',
    success: 'bg-success-50 border-success-200 text-success-700',
    warning: 'bg-warning-50 border-warning-200 text-warning-700',
    error: 'bg-error-50 border-error-200 text-error-700',
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          colorClasses[color]
        )}>
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          <p className="text-sm text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
