import React from 'react';
import Navbar from '../views/components/navigation/Navbar';
import Hero from '../views/components/hero/Hero';
import Features from '../views/components/features/Features';
import CourseCategories from '../views/components/categories/CourseCategories';
import LatestCourses from '../views/components/courses/LatestCourses';
import { ComingSoon } from '../views/components/coming-soon/ComingSoon';
import Footer from '../views/components/navigation/Footer';

// Define la interfaz de las props para DefaultLayout
interface DefaultLayoutProps {
  children?: React.ReactNode; // El prop `children` es opcional
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Renderiza el contenido adicional que se pasa como children */}
        {children}
        {/* Renderiza los componentes principales */}
        <Hero />
        <Features />
        <CourseCategories />
        <LatestCourses />
        <ComingSoon />
      </main>
      <Footer />
    </div>
  );
}
