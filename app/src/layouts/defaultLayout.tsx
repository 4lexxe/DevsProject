import React from 'react';
import Navbar from '../views/components/navigation/Navbar';
import Hero from '../views/components/hero/Hero';
import Features from '../views/components/features/Features';
import CourseCategories from '../views/components/categories/CourseCategories';
import LatestCourses from '../views/components/courses/LatestCourses';
import { ComingSoon } from '../views/components/coming-soon/ComingSoon';
import Footer from '../views/components/navigation/Footer';

interface DefaultLayoutProps {
  children?: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
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