import Hero from './components/hero/Hero';
import Features from './components/features/Features';
import CourseCategories from './components/categories/CourseCategories';
import { ComingSoon } from './components/coming-soon/ComingSoon'; 

import LatestCourses from './components/courses/LatestCourses'; 
import CollaboratorsSection from './components/developers/CollaboratorsSection';

export default function Home() {
  return (
    <main className="w-full mx-auto ">
      {/* Hero ocupa toda la anchura de la pantalla */}
      <section className="w-full">
        <Hero />
      </section>
      
      {/* El resto del contenido tiene un ancho limitado */}
      <section className=" mx-auto">
        <Features />
        <CourseCategories />
        <LatestCourses />
        <ComingSoon />
        <CollaboratorsSection />
      </section>
    </main>
  );
}
