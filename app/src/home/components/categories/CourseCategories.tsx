import { GraduationCap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import CategoryCard from "./CategoryCard";
import { getCategoriesActivesLimited } from "@/home/services/categoriesService";
import { useState, useEffect } from "react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation'
import "@/shared/assets/styles/categorySwiper.css";

export default function CourseCategories() {
  const [categories, setCategories] = useState<any>(null); // Usa un tipo adecuado en lugar de 'any'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesActivesLimited("8");

        setCategories(data);
      } catch (err) {
        console.error("Error al obtener el contenido:", err);
      }
    };

    fetchCategories();
  }, []); // Se ejecuta cuando `categoriesId` cambia

  return (
    <section className=" from-white to-gray-50">
      <div className="max-w-[90%] mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 bg-blue-100 rounded-xl">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Categorías de Cursos
            </h2>
            <p className="text-gray-600 mt-2">
              
              Explora nuestra amplia variedad de cursos por categoría
              
            </p>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination/* , Autoplay */]}
          navigation
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            430: {
              slidesPerView: 2,
            },
            650: {
              slidesPerView: 3,
            },
            850: {
              slidesPerView: 4,
            },
            1050: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
            1480:{
              slidesPerView: 7,
            },
            1700: {
              slidesPerView: 8,
            }
            
          }}
          
          className=""
        >
          {categories &&
            categories.map((category: any) => (
              <SwiperSlide key={category.id}>
                <CategoryCard {...category} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
}
