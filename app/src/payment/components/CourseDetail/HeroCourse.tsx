import React from 'react';
import { Tag, DollarSign, Percent, CheckCircle, Clock } from 'lucide-react';
import { Category } from '@/course/interfaces/ViewnerCourse';

interface HeroCourseProps {
  title: string;
  description: string;
  image: string;
  categories: Category[];
  courseId?: string;
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
  // Propiedades específicas para cursos ya adquiridos
  accessGrantedAt?: string;
  progress?: number;
  status?: 'active' | 'revoked';
}

export default function HeroCourse({
  title,
  description,
  image,
  categories,
  courseId,
  pricing,
  accessGrantedAt,
  progress,
  status,
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

          {/* Información del curso adquirido */}
          {(status || accessGrantedAt || progress !== undefined) && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-3">
                {/* Estado del curso */}
                {status && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-5 h-5 ${status === 'active' ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={`text-sm font-medium ${status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                      {status === 'active' ? 'Acceso Activo' : 'Acceso Revocado'}
                    </span>
                  </div>
                )}

                {/* Fecha de acceso */}
                {accessGrantedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                      Acceso desde: {new Date(accessGrantedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Progreso del curso */}
              {progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Progreso del curso</span>
                    <span className="text-sm text-green-400 font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Información de precios (si está disponible) */}
          {pricing && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  {pricing.finalPrice === 0 ? (
                    <span className="text-2xl font-bold text-green-400">
                      Gratis
                    </span>
                  ) : pricing.hasDiscount ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-green-400">
                        ${pricing.finalPrice.toFixed(2)}
                      </span>
                      <span className="text-lg line-through text-gray-400">
                        ${pricing.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-green-400">
                      ${pricing.finalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Badge de descuento */}
              {pricing.hasDiscount && pricing.activeDiscount && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                    <Percent className="w-4 h-4" />
                    <span>{pricing.activeDiscount.percentage}% OFF</span>
                  </div>
                  <span className="text-sm text-gray-300">
                    {pricing.activeDiscount.event}
                  </span>
                  {pricing.savings > 0 && (
                    <span className="text-sm text-green-400 font-medium">
                      Ahorrado: ${pricing.savings.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}