import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CategoryCard from "./CategoryCard";
import { getCategoriesActivesLimited } from "@/home/services/categoriesService";
import { useState, useEffect } from "react";
import FontelloIcon from "@/shared/components/icons/FontelloIcon";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation'
import "@/shared/assets/styles/categorySwiper.css";

interface Category {
  id: string;
  name: string;
  icon: string;
  coursesCount: number;
}

export default function CourseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesActivesLimited("8");
        setCategories(data);
      } catch (err) {
        console.error("Error al obtener las categorías:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Categorías de Cursos
          </h2>
          
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra amplia variedad de cursos organizados por categorías especializadas
          </p>
        </div>

        {/* Categories Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            spaceBetween={24}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              480: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
              1536: {
                slidesPerView: 6,
              }
            }}
            className="categories-swiper pb-12"
          >
            {categories.map((category: Category) => (
              <SwiperSlide key={category.id} className="h-auto">
                <CategoryCard {...category} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2.5 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer group">
            <FontelloIcon
              name="icon-left-open"
              className="text-base text-gray-600 group-hover:text-gray-900 transition-colors"
              fallback={
                <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
            />
          </div>
          
          <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2.5 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer group">
            <FontelloIcon
              name="icon-right-open"
              className="text-base text-gray-600 group-hover:text-gray-900 transition-colors"
              fallback={
                <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
