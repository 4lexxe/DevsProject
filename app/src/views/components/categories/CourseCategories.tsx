import CategoryCard from './CategoryCard'

const categories = [
  {
    id: 1,
    name: 'Desarrollo Web',
    icon: '🌐',
    count: 24,
    color: '#00D7FF'
  },
  {
    id: 2,
    name: 'Móvil',
    icon: '📱',
    count: 18,
    color: '#66E7FF'
  },
  {
    id: 3,
    name: 'Backend',
    icon: '⚙️',
    count: 16,
    color: '#CCF7FF'
  },
  {
    id: 4,
    name: 'DevOps',
    icon: '🔄',
    count: 12,
    color: '#D8DAFD'
  },
  {
    id: 5,
    name: 'Bases de Datos',
    icon: '💾',
    count: 10,
    color: '#00D7FF'
  },
  {
    id: 6,
    name: 'IA & ML',
    icon: '🤖',
    count: 8,
    color: '#66E7FF'
  }
]

export default function CourseCategories() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-black mb-8">
          Categorías de Cursos
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}