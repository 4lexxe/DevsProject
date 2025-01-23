import React, { useEffect, useState } from 'react'
import { getCourses } from './services/courseServices'
import CourseListItem from './components/courses/CourseListItem'
/* import { ArrowRight } from 'lucide-react' */

interface Course {
  id: number
  title: string
  summary: string
  category: string
  image: string
  relatedCareerType: string
}

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => { 
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (error) {
        console.error('No se pudieron cargar los cursos', error)
      }
    }

    fetchCourses()
  }, [])

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {courses.map((course) => (
            <CourseListItem
              key={course.id}
              {...course}
              courseName={course.category}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoursesList