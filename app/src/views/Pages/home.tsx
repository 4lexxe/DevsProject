import Hero from '../components/hero/Hero';
import Features from '../components/features/Features';
import CourseCategories from '../components/categories/CourseCategories';
import LatestCourses from '../components/courses/LatestCourses';
import { ComingSoon } from '../components/coming-soon/ComingSoon';

export default function Home() {
  return (
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero ocupa toda la anchura de la pantalla */}
      <section className="w-full">
        <Hero />
      </section>
      
      {/* El resto del contenido tiene un ancho limitado */}
      <section className="max-w-7xl mx-auto">
        <Features />
        <CourseCategories />
        <LatestCourses />
        <ComingSoon />
      </section>
    </main>
  );
}
