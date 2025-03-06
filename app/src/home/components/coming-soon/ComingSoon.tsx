import { useEffect, useState } from "react"
import { ComingSoonCard } from "./ComingSoonCard"
import { getCourses } from "../../../course/services/courseServices"
import { Sparkles } from 'lucide-react'

// Definir estructura del curso
interface Course {
  id: number
  title: string
  image: string
  category: string
  careerType: object[]
  isInDevelopment: boolean
  createdAt: string
}

export function ComingSoon() {
  // Inicializar estados
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Obtener y procesar cursos
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        const sortedCourses = data.sort(
          (a: Course, b: Course) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const inDevelopmentCourses = sortedCourses
          .filter((course: Course) => course.isInDevelopment)
          .slice(0, 5);
        setCourses(inDevelopmentCourses);
      } catch (err) {
        setError("Failed to load courses");
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, []);

  // Renderizar encabezado
  const Header = () => (
    <div className="flex items-center gap-3 mb-8">
      <div className="bg-gray-100 p-2 rounded-lg">
        <Sparkles className="w-6 h-6 text-gray-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Próximamente</h2>
    </div>
  )

  // Mostrar estado de carga
  if (loading) {
    return (
      <section className="container mx-auto px-6 py-12">
        <Header />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-600"></div>
        </div>
      </section>
    )
  }

  // Mostrar estado de error
  if (error) {
    return (
      <section className="container mx-auto px-6 py-12">
        <Header />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  // Mostrar estado sin cursos
  if (courses.length === 0) {
    return (
      <section className="container mx-auto px-6 py-12">
        <Header />
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No courses in development at the moment.</p>
        </div>
      </section>
    )
  }

  // Renderizar lista de cursos
  return (
    <section className="container mx-auto px-6 py-12">
      <Header />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => {
          // Renderizar tarjeta principal
          if (index === 0) {
            return (
              <div key={course.id} className="md:col-span-2 lg:col-span-2 h-full">
                <ComingSoonCard 
                  aspectRatio="landscape"
                  title={course.title}
                  category={course.category}
                  careerType={course.careerType.name}
                  imageUrl={course.image}
                  className="hover:shadow-2xl"
                />
              </div>
            )
          }
          
          // Renderizar tarjetas verticales
          if ((index - 1) % 3 === 0) {
            return (
              <ComingSoonCard
                key={course.id}
                aspectRatio="portrait"
                title={course.title}
                category={course.category}
                careerType={course.careerType.name}
                imageUrl={course.image}
              />
            )
          }
          
          // Renderizar tarjetas cuadradas
          return (
            <ComingSoonCard
              key={course.id}
              title={course.title}
              category={course.category}
              careerType={course.careerType.name}
              imageUrl={course.image}
            />
          )
        })}
      </div>
    </section>
  )
}