import React from 'react';
import { Tag } from 'lucide-react';
import { Category } from '@/course/interfaces/ViewnerCourse';

interface HeroCourseProps {
  title: string;
  description: string;
  image: string;
  categories: Category[];
  courseId?: string;
}

export default function HeroCourse({
  title,
  description,
  image,
  categories,
  courseId,
}: HeroCourseProps) {
  return (
    <div className="relative min-h-[400px]">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`, // Utilizamos la imagen pasada como prop
        }}
      >
        {/* Capa oscura sobre la imagen */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative min-h-[400px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        {/* Contenedor limitado para el contenido */}
        <div className="text-white max-w-2xl">
          {/* Categorías */}
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5" />
            {categories.map((category, index) => (
              <span
                key={index}
                className="
                  px-3 
                  py-1 
                  text-sm 
                  font-medium 
                  rounded-full 
                  bg-gray-100/70 
                  text-gray-700 
                  group-hover:text-gray-900 
                  transition-colors 
                  duration-300
                "
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Título responsive */}
          <h1
            className="
              text-2xl 
              sm:text-3xl 
              md:text-4xl 
              lg:text-5xl 
              font-bold 
              mb-4 
              overflow-hidden 
              whitespace-normal 
              break-words 
              max-w-full
            "
          >
            {title}
          </h1>

          {/* Descripción responsive */}
          <p
            className="
              text-base 
              sm:text-lg 
              text-gray-200 
              overflow-hidden 
              whitespace-normal 
              break-words 
              max-w-full
              mb-6
            "
          >
            {description}
          </p>
          
        </div>
      </div>


    </div>
  );
}