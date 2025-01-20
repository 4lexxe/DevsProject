import { GraduationCap } from 'lucide-react'
import CategoryCard from './CategoryCard'

const categories = [
  {
    id: 1,
    name: 'Desarrollo Web',
    icon: '🌐',
    count: 24,
    color: '#E5F6FF'
  },
  {
    id: 2,
    name: 'Móvil',
    icon: '📱',
    count: 18,
    color: '#F0F7FF'
  },
  {
    id: 3,
    name: 'Backend',
    icon: '⚙️',
    count: 16,
    color: '#F5F8FF'
  },
  {
    id: 4,
    name: 'DevOps',
    icon: '🔄',
    count: 12,
    color: '#F8F9FF'
  },
  {
    id: 5,
    name: 'Bases de Datos',
    icon: '💾',
    count: 10,
    color: '#E5F6FF'
  },
  {
    id: 6,
    name: 'IA & ML',
    icon: '🤖',
    count: 8,
    color: '#F0F7FF'
  }
]

export default function CourseCategories() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Categorías de Cursos
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}