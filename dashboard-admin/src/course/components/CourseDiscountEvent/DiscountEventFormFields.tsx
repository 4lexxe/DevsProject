import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { DiscountEventFormData } from "../../validations/discountEvent";
import { AlertCircle } from "lucide-react";

interface DiscountEventFormFieldsProps {
  register: UseFormRegister<DiscountEventFormData>;
  errors: FieldErrors<DiscountEventFormData>;
  watch: UseFormWatch<DiscountEventFormData>;
}

// Helper function to format date for input[type="date"]
const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  
  // Ensure we get the local date without timezone conversion
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export default function DiscountEventFormFields({ register, errors, watch }: DiscountEventFormFieldsProps) {
  // Watch the date values to display them correctly
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");

  return (
    <>
      {/* Event Name */}
      <div className="space-y-2">
        <label htmlFor="event" className="block text-sm font-semibold text-gray-900">
          Nombre del Evento <span className="text-red-500">*</span>
        </label>
        <input
          id="event"
          type="text"
          placeholder="ej. Black Friday 2024"
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900 ${
            errors.event ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          {...register("event")}
        />
        {errors.event && (
          <p className="text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.event.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          placeholder="Describe el evento de descuento..."
          rows={4}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-vertical bg-white text-gray-900 ${
            errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Discount Value */}
      <div className="space-y-2">
        <label htmlFor="value" className="block text-sm font-semibold text-gray-900">
          Porcentaje de Descuento (%) <span className="text-red-500">*</span>
        </label>
        <input
          id="value"
          type="number"
          min="1"
          max="100"
          placeholder="30"
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900 ${
            errors.value ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          {...register("value", { valueAsNumber: true })}
        />
        {errors.value && (
          <p className="text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {errors.value.message}
          </p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-900">
            Fecha de Inicio <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            type="date"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900 ${
              errors.startDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
            }`}
            value={formatDateForInput(startDateValue)}
            {...register("startDate", { 
              setValueAs: (value) => {
                if (!value) return null;
                
                // Si es un string de fecha del input (YYYY-MM-DD)
                if (typeof value === 'string' && value.includes('-') && !value.includes('T')) {
                  const [year, month, day] = value.split('-').map(Number);
                  return new Date(year, month - 1, day);
                }
                
                // Si es un string ISO o Date object del backend
                if (value instanceof Date) {
                  return value;
                }
                
                // Si es string ISO del backend
                const date = new Date(value);
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
              }
            })}
          />
          {errors.startDate && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-semibold text-gray-900">
            Fecha de Fin <span className="text-red-500">*</span>
          </label>
          <input
            id="endDate"
            type="date"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900 ${
              errors.endDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
            }`}
            value={formatDateForInput(endDateValue)}
            {...register("endDate", { 
              setValueAs: (value) => {
                if (!value) return null;
                
                // Si es un string de fecha del input (YYYY-MM-DD)
                if (typeof value === 'string' && value.includes('-') && !value.includes('T')) {
                  const [year, month, day] = value.split('-').map(Number);
                  return new Date(year, month - 1, day);
                }
                
                // Si es un string ISO o Date object del backend
                if (value instanceof Date) {
                  return value;
                }
                
                // Si es string ISO del backend
                const date = new Date(value);
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
              }
            })}
          />
          {errors.endDate && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 bg-white">
        <input
          id="isActive"
          type="checkbox"
          defaultChecked={true}
          className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-gray-900 text-gray-900"
          {...register("isActive")}
        />
        <div className="space-y-1">
          <label htmlFor="isActive" className="block text-sm font-semibold text-gray-900">
            Evento Activo
          </label>
          <p className="text-sm text-gray-600">El evento estará disponible para aplicar descuentos</p>
        </div>
      </div>
    </>
  );
}
