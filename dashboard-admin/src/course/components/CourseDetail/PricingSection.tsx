import { CourseData } from "../../interfaces/CourseDetail";
import { DollarSign, Tag, Percent, TrendingDown, Calendar, Eye } from "lucide-react";

interface PricingSectionProps {
  courseData: CourseData;
  onViewDiscounts: () => void;
  formatDate: (dateString: string) => string;
}

export default function PricingSection({ courseData, onViewDiscounts, formatDate }: PricingSectionProps) {
  if (!courseData.pricing) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Configuración de Precios
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">
                Precio Base
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-400 line-through">${courseData.pricing.originalPrice}</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">Precio Actual</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">${courseData.pricing.finalPrice}</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">Descuento</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{courseData.pricing.discountValue || 0}%</p>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">Ahorro</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">${courseData.pricing.savings}</p>
          </div>
        </div>
        
        {courseData.pricing.hasDiscount && courseData.pricing.discount && (
          <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">
                Descuento Activo
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 pl-6">
              <Calendar className="w-4 h-4" />
              <span>
                Válido desde <strong>{formatDate(courseData.pricing.discount.startDate)}</strong> hasta{" "}
                <strong>{formatDate(courseData.pricing.discount.endDate)}</strong>
              </span>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onViewDiscounts}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <Eye className="w-4 h-4" />
            Ver Descuentos
          </button>
        </div>
      </div>
    </div>
  );
}
