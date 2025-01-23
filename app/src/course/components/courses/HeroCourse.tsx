import React from 'react';
import { Tag } from 'lucide-react';

interface HeroCourseProps {
  title: string;
  description: string;
  image: string;
  category: string;
}

export default function HeroCourse({
  title,
  description,
  image,
  category,
}: HeroCourseProps) {
  return (
    <div className="relative h-[400px]">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`, // Utilizamos la imagen pasada como prop
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-medium">{category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title} {/* Mostramos el título dinámico */}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            {description} {/* Mostramos la descripción dinámica */}
          </p>
        </div>
      </div>
    </div>
  );
}
