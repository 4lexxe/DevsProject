import React from 'react';
import { DollarSign, Percent, Clock, Tag } from 'lucide-react';

interface DiscountEvent {
  id: string;
  event: string;
  description: string;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  CourseDiscountEventAssociation: {
    courseId: string;
    discountEventId: string;
  };
}

interface PricingCardProps {
  pricing?: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    discountEvents: DiscountEvent[];
    totalDiscountPercentage: number;
    savings: number;
  };
}

export default function PricingCard({ pricing }: PricingCardProps) {
  if (!pricing) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Precio del Curso
        </h3>
        
        {/* Precio principal */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <DollarSign className="w-6 h-6 text-green-500" />
          {pricing.hasDiscount ? (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-600">
                ${pricing.finalPrice.toFixed(2)}
              </span>
              <span className="text-xl line-through text-gray-400">
                ${pricing.originalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-green-600">
              ${pricing.finalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Badge de descuento total */}
        {pricing.hasDiscount && pricing.totalDiscountPercentage > 0 && (
          <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-bold shadow-lg mb-4">
            <Percent className="w-4 h-4" />
            <span>{pricing.totalDiscountPercentage}% OFF</span>
          </div>
        )}

        {/* Ahorro total */}
        {pricing.savings > 0 && (
          <p className="text-green-600 font-semibold text-lg">
            ¡Ahorras ${pricing.savings.toFixed(2)}!
          </p>
        )}
      </div>

      {/* Lista de promociones activas */}
      {pricing.hasDiscount && pricing.discountEvents && pricing.discountEvents.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-orange-500" />
            <h4 className="text-sm font-semibold text-gray-700">
              {pricing.discountEvents.length === 1 ? 'Promoción Activa' : 'Promociones Activas'}
            </h4>
          </div>
          
          <div className="space-y-3">
            {pricing.discountEvents
              .filter(discount => discount.isActive)
              .map((discount) => (
                <div 
                  key={discount.id}
                  className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-800 text-sm">
                      {discount.event}
                    </h5>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {discount.value}% OFF
                    </span>
                  </div>
                  
                  {discount.description && (
                    <p className="text-gray-600 text-xs mb-2">
                      {discount.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      Válido hasta {formatDate(discount.endDate)}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Mensaje informativo */}
          {pricing.discountEvents.filter(d => d.isActive).length > 1 && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-xs text-green-700 flex items-center justify-center gap-1">
                <span>✨</span>
                <span>Descuentos combinados automáticamente</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mensaje cuando no hay descuentos */}
      {!pricing.hasDiscount && (
        <div className="border-t border-gray-200 pt-4">
          <div className="text-center text-gray-500 text-sm">
            <p>Precio regular del curso</p>
          </div>
        </div>
      )}
    </div>
  );
}
