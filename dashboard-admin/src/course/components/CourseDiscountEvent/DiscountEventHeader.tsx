interface DiscountEventHeaderProps {
  isEditing: boolean;
}

export default function DiscountEventHeader({ isEditing }: DiscountEventHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2" style={{ color: "#0c154c" }}>
        {isEditing ? 'Editar Evento de Descuento' : 'Crear Evento de Descuento'}
      </h1>
      <p className="text-gray-600">
        {isEditing 
          ? 'Modifica los detalles del evento de descuento'
          : 'Configura descuentos especiales para tus cursos con fechas de inicio y fin'
        }
      </p>
    </div>
  );
}
