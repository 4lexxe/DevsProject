import { ArrowRight } from 'lucide-react'
import CourseCard from './CourseCard'

const latestCourses = [
  {
    id: 1,
    title: 'React Avanzado 2024',
    description: 'Domina los últimos features de React y sus patrones avanzados',
    instructor: 'Ana Martínez',
    level: 'Avanzado',
    duration: '32 horas',
    price: 59.99,
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 2,
    title: 'Node.js y Express',
    description: 'Construye APIs robustas y escalables con Node.js',
    instructor: 'Carlos Ruiz',
    level: 'Intermedio',
    duration: '28 horas',
    price: 49.99,
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 3,
    title: 'Python para Data Science',
    description: 'Análisis de datos y machine learning con Python',
    instructor: 'Laura Sánchez',
    level: 'Intermedio',
    duration: '40 horas',
    price: 69.99,
    image: '/placeholder.svg?height=200&width=300'
  }
]

export default function LatestCourses() {
  return (
    <section className="py-16 px-6 bg-[#CCF7FF]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Últimos Cursos</h2>
          <a 
            href="/cursos" 
            className="flex items-center text-[#00D7FF] hover:text-[#66E7FF] transition-colors"
          >
            Ver todos
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  )
}