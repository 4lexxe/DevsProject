import type React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaThumbsUp } from "react-icons/fa";
import { getCourseUrlFromSlugOrId } from "@/shared/utils/courseUrl";

interface CourseCardProps {
  id: number;
  slug?: string; // Slug para URLs SEO-friendly
  title: string;
  summary: string;
  courseName: string;
  image: string;
  careerType: string;
  instructor?: string; // "Un curso de [nombre]"
  studentsCount?: number; // Número de estudiantes
  rating?: number; // Porcentaje de rating (0-100)
  reviewsCount?: number; // Número de reviews
  duration?: string; // Duración del curso (ej: "18H", "14H")
  isTopSales?: boolean; // Badge "TOP VENTAS"
  isFreeWithPlus?: boolean; // Badge "GRATIS CON +PLUS"
  pricing?: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    discount?: {
      id: number;
      event: string;
      description: string;
      value: number;
      startDate: string;
      endDate: string;
    } | null;
    discountValue: number;
    savings: number;
    isFree: boolean;
    priceDisplay: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  slug,
  title,
  summary,
  image,
  careerType,
  instructor,
  studentsCount,
  rating,
  reviewsCount,
  duration,
  isTopSales = false,
  isFreeWithPlus = false,
  pricing,
}) => {
  const navigate = useNavigate();

  const handleBuyCourse = () => {
    if (id && id !== undefined) {
      navigate(getCourseUrlFromSlugOrId(slug, id));
    }
  };

  // Formatear número de estudiantes
  const formatStudents = (count?: number) => {
    if (!count) return null;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`.replace('.0', '');
    }
    return count.toLocaleString('es-ES');
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative w-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Imagen del curso */}
      <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-contain p-2"
          style={{ 
            maxHeight: '100%', 
            maxWidth: '100%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        
        {/* Badge "TOP VENTAS" */}
        {isTopSales && (
          <div className="absolute top-3 left-3 bg-yellow-400 px-3 py-1.5 rounded shadow-lg z-10">
            <span className="text-black text-xs font-bold uppercase tracking-wide">TOP VENTAS</span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5 space-y-2.5 flex-1 flex flex-col">
        {/* Tipo/Categoría y Duración (opcional) */}
        {duration && (
          <div className="text-xs uppercase text-gray-500 font-normal tracking-wide mb-1">
            {careerType.toUpperCase()} - {duration}
          </div>
        )}

        {/* Título del curso */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] mb-1">
          {title}
        </h3>

        {/* Instructor */}
        {instructor && (
          <p className="text-sm text-gray-700 mb-1">
            Un curso de <span className="font-medium">{instructor}</span>
          </p>
        )}

        {/* Descripción breve */}
        {summary && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed min-h-[2.5rem] mb-1">
            {summary}
          </p>
        )}

        {/* Estudiantes, Rating y Reviews */}
        {(studentsCount || rating || reviewsCount) && (
          <div className="flex items-center gap-4 text-sm text-gray-700 flex-wrap py-1">
            {studentsCount && (
              <div className="flex items-center gap-1.5">
                <FaUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-medium">{formatStudents(studentsCount)}</span>
              </div>
            )}
            {rating !== undefined && reviewsCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <FaThumbsUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-medium">{rating}%</span>
                <span className="text-gray-400">({formatStudents(reviewsCount)})</span>
              </div>
            )}
          </div>
        )}

        {/* Badge "GRATIS CON +PLUS" */}
        {isFreeWithPlus && (
          <div className="border border-pink-400 bg-pink-50 px-3 py-1.5 rounded-md inline-block mb-2">
            <span className="text-xs font-bold uppercase text-black">
              GRATIS CON <span className="text-pink-600 font-extrabold">+PLUS</span>
            </span>
          </div>
        )}

        {/* Información de precios */}
        {pricing && !pricing.isFree && (
          <div className="space-y-1 pt-2">
            {pricing.hasDiscount && pricing.discountValue > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-700 font-medium">
                  {Math.round(pricing.discountValue)}% Dto.
                </span>
                <span className="text-sm line-through text-gray-400">
                  {formatPrice(pricing.originalPrice)} ARS
                </span>
              </div>
            )}
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(pricing.finalPrice)} ARS
            </div>
          </div>
        )}

        {/* Botón "Comprar" - siempre al final */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyCourse}
          className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-auto"
        >
          <FaShoppingCart className="w-4 h-4 flex-shrink-0" />
          {pricing && !pricing.isFree ? (
            <span>Comprar {formatPrice(pricing.finalPrice)} ARS</span>
          ) : (
            <span>Ver curso</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
