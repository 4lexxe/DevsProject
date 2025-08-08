import { useEffect, useState, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { getCourses } from '@/course/services/courseServices';

interface Course {
  id: number;
  title: string;
  summary: string; 
  admin: {
    name: string;
  };
  image: string;
  createdAt: string;
  category: string;
  careerType?: {
    name: string;
  } | null;
  pricing?: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    activeDiscount?: {
      id: number;
      event: string;
      description: string;
      percentage: number;
      amount: number;
      startDate: string;
      endDate: string;
    };
    savings: number;
  };
}

export default function LatestCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        const sortedCourses = data
          .filter((course: Course) => course.id && course.id !== undefined)
          .sort((a: Course, b: Course) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
        setCourses(sortedCourses);
      } catch (error) {
        console.error('No se pudieron cargar los cursos', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < courses.length - slidesToShow) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const maxSlides = Math.max(0, courses.length - slidesToShow);

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-black">Últimos Cursos</h2>
          <a
            href="/cursos"
            className="flex items-center text-[#00D7FF] hover:text-[#66E7FF] transition-colors text-sm sm:text-base"
          >
            Ver todos
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Botones de navegación - Siempre a los costados */}
          {slidesToShow < courses.length && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 lg:p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed -translate-x-1/2"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxSlides}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 lg:p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed translate-x-1/2"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Contenedor del carrusel */}
          <div className="overflow-hidden relative">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
              }}
            >
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className={`flex-none px-2 sm:px-3 ${
                    slidesToShow === 1 ? 'w-full' : 
                    slidesToShow === 2 ? 'w-1/2' : 'w-1/3'
                  }`}
                >
                  <div className="w-full">
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      summary={course.summary}
                      courseName={course.category}
                      image={course.image}
                      careerType={course.careerType?.name || 'Sin categoría'}
                      pricing={course.pricing}
                    />          
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* Indicadores de puntos */}
          {slidesToShow < courses.length && (
            <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
              {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-[#00D7FF] scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}