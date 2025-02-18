import React, { useEffect, useState } from 'react'
import { getCourses } from '../../services/courseServices'
import CourseListItem from './CourseListItem'
import { Category, CareerType } from "@/course/interfaces/viewnerCourseInterface";

interface Course {
  id: number
  title: string
  summary: string
  image: string
  categories: Category[]
  careerType: CareerType
}

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => { 
      try {
        const data = await getCourses()
        console.log(data)
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
              categories={course.categories} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoursesList