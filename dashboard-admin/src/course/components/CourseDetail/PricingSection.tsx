import { DollarSign, Tag, Eye } from "lucide-react";
import { CourseData } from "../../interfaces/CourseDetail";

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
    <div className="rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
          <DollarSign className="h-5 w-5 inline-block mr-2" />
          Configuración de Precios
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
            <p className="text-sm" style={{ color: "#0c154c" }}>
              Precio Base
            </p>
            <p className="text-2xl font-bold text-gray-400 line-through">${courseData.pricing.originalPrice}</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#42d7c7", color: "white" }}>
            <p className="text-sm text-white">Precio Actual</p>
            <p className="text-3xl font-bold text-white">${courseData.pricing.finalPrice}</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#1d4ed8", color: "white" }}>
            <p className="text-sm text-white">% Descuento Aplicado</p>
            <p className="text-2xl font-bold text-white">{courseData.pricing.activeDiscount?.percentage || 0}%</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#02ffff", color: "#0c154c" }}>
            <p className="text-sm" style={{ color: "#0c154c" }}>
              Diferencia
            </p>
            <p className="text-2xl font-bold" style={{ color: "#0c154c" }}>
              ${courseData.pricing.savings}
            </p>
          </div>
        </div>
        
        {courseData.pricing.hasDiscount && courseData.pricing.activeDiscount && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#eff6ff", border: "1px solid #42d7c7" }}>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 inline-block" style={{ color: "#1d4ed8" }} />
              <span className="font-semibold" style={{ color: "#0c154c" }}>
                Descuento Activo
              </span>
            </div>
            <p className="text-sm" style={{ color: "#0c154c" }}>
              Válido desde {formatDate(courseData.pricing.activeDiscount.startDate)} hasta{" "}
              {formatDate(courseData.pricing.activeDiscount.endDate)}
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={onViewDiscounts}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            Ver Descuentos
          </button>
        </div>
      </div>
    </div>
  );
}
