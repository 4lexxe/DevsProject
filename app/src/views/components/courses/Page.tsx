import CoursesList from '../../components/courses/CoursesList'

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-neutral-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-black mb-12">Todos los Cursos</h1>
        <CoursesList />
      </div>
    </main>
  )
}