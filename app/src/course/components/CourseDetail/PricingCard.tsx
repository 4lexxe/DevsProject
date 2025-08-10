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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Precio del Curso
        </h3>
        
        {/* Precio principal */}
        <div className="mb-4">
          {pricing.isFree ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-green-600">
                {pricing.priceDisplay}
              </span>
            </div>
          ) : pricing.hasDiscount ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl line-through text-gray-400">
                  ${pricing.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="w-6 h-6 text-green-500" />
                <span className="text-4xl font-bold text-green-600">
                  ${pricing.finalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-6 h-6 text-green-500" />
              <span className="text-4xl font-bold text-green-600">
                ${pricing.finalPrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Badge de descuento */}
        {pricing.hasDiscount && pricing.discountValue > 0 && (
          <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-bold shadow-lg mb-4">
            <Percent className="w-4 h-4" />
            <span>{pricing.discountValue}% OFF</span>
          </div>
        )}

        {/* Ahorro total */}
        {!pricing.isFree && pricing.savings > 0 && (
          <p className="text-green-600 font-semibold text-lg">
            ¡Ahorras ${pricing.savings.toFixed(2)}!
          </p>
        )}
      </div>

      {/* Información del descuento activo */}
      {pricing.hasDiscount && pricing.discount && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-orange-500" />
            <h4 className="text-sm font-semibold text-gray-700">
              Promoción Activa
            </h4>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold text-gray-800 text-sm">
                {pricing.discount.event}
              </h5>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {pricing.discount.value}% OFF
              </span>
            </div>
            
            {pricing.discount.description && (
              <p className="text-gray-600 text-xs mb-2">
                {pricing.discount.description}
              </p>
            )}
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                Válido hasta {formatDate(pricing.discount.endDate)}
              </span>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
