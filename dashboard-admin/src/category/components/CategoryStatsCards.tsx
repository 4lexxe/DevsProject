import { Tag, ToggleRight, ToggleLeft, BookOpen, TrendingUp } from 'lucide-react'
import type { CategoryStats } from '../types/category.types'

interface CategoryStatsCardsProps {
  stats: CategoryStats
  isLoading?: boolean
}

const CategoryStatsCards = ({ stats, isLoading }: CategoryStatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Categorías',
      value: stats.totalCategories,
      icon: Tag,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Categorías en el sistema'
    },
    {
      title: 'Categorías Activas',
      value: stats.activeCategories,
      icon: ToggleRight,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Visibles para usuarios'
    },
    {
      title: 'Categorías Inactivas',
      value: stats.inactiveCategories,
      icon: ToggleLeft,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      description: 'Ocultas temporalmente'
    },
    {
      title: 'Total Cursos',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Cursos categorizados'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
            <div className="flex items-center">
              <div className={`h-12 w-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
            </div>
            
            {/* Indicador de progreso para categorías activas */}
            {card.title === 'Categorías Activas' && stats.totalCategories > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Porcentaje activo</span>
                  <span>{Math.round((stats.activeCategories / stats.totalCategories) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.activeCategories / stats.totalCategories) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Promedio de cursos por categoría */}
            {card.title === 'Total Cursos' && stats.totalCategories > 0 && (
              <div className="mt-4">
                <div className="flex items-center text-xs text-gray-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>
                    Promedio: {Math.round(stats.totalCourses / stats.totalCategories)} cursos/categoría
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CategoryStatsCards