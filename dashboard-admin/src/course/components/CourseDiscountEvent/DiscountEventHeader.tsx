import { Calendar } from "lucide-react";

interface DiscountEventHeaderProps {
  isEditing: boolean;
}

export default function DiscountEventHeader({ isEditing }: DiscountEventHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Editar Evento de Descuento' : 'Crear Evento de Descuento'}
        </h1>
      </div>
      <p className="text-gray-600">
        {isEditing 
          ? 'Modifica los detalles del evento de descuento'
          : 'Configura descuentos especiales para tus cursos con fechas de inicio y fin'
        }
      </p>
    </div>
  );
}
