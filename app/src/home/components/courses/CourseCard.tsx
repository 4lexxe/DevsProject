import type React from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, DollarSign, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: number;
  title: string;
  summary: string;
  courseName: string;
  image: string;
  careerType: string;
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
    isFree?: boolean;
    priceDisplay?: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  summary,
  image,
  careerType,
  pricing,
}) => {
  console.log('🎯 CourseCard recibió props - id:', id, 'tipo:', typeof id, 'title:', title);
  
  const navigate = useNavigate();

  const handleViewCourse = () => {
    console.log('🔍 handleViewCourse - id:', id, 'tipo:', typeof id);
    
    if (id && id !== undefined) {
      console.log('✅ Navegando a /course/' + id);
      navigate(`/course/${id}`);
    } else {
      console.error('❌ ID del curso no válido:', id);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
    >
      {/* Banner con imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        
        {/* Tipo de carrera flotante */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-md flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          {careerType}
        </div>

        {/* Badge de descuento en la esquina superior derecha */}
        {pricing?.hasDiscount && pricing.activeDiscount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
            <Percent className="w-3 h-3" />
            {pricing.activeDiscount.percentage}% OFF
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{summary}</p>
        
        {/* Información de precios */}
        {pricing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              {pricing.isFree ? (
                <span className="text-lg font-bold text-green-600">
                  GRATIS
                </span>
              ) : pricing.hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ${pricing.finalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    ${pricing.originalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-green-600">
                  ${pricing.finalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {pricing.hasDiscount && pricing.savings > 0 && !pricing.isFree && (
              <div className="text-xs text-green-600 font-medium">
                Ahorras ${pricing.savings.toFixed(2)}
              </div>
            )}
            {pricing.isFree && pricing.hasDiscount && (
              <div className="text-xs text-green-600 font-medium">
                ¡Curso completamente gratuito!
              </div>
            )}
          </div>
        )}
        
        {/* Botón */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewCourse}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          Ver curso
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
