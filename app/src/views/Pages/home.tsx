import Hero from '../components/hero/Hero'
import Features from '../components/features/Features'
import CourseCategories from '../components/categories/CourseCategories'
import LatestCourses from '../components/courses/LatestCourses'
import { ComingSoon } from '../components/coming-soon/ComingSoon'

export default function Home() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Hero />
      <Features />
      <CourseCategories />
      <LatestCourses />
      <ComingSoon />
    </main>
  )
}