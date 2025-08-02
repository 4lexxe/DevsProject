import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DiscountEventFormData } from "../../validations/discountEvent";

interface DiscountEventFormFieldsProps {
  register: UseFormRegister<DiscountEventFormData>;
  errors: FieldErrors<DiscountEventFormData>;
}

export default function DiscountEventFormFields({ register, errors }: DiscountEventFormFieldsProps) {
  return (
    <>
      {/* Event Name */}
      <div className="space-y-2">
        <label htmlFor="event" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
          Nombre del Evento *
        </label>
        <input
          id="event"
          type="text"
          placeholder="ej. Black Friday 2024"
          className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: "#42d7c7" }}
          {...register("event")}
        />
        {errors.event && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {errors.event.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
          Descripción *
        </label>
        <textarea
          id="description"
          placeholder="Describe el evento de descuento..."
          rows={4}
          className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          style={{ borderColor: "#42d7c7" }}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Discount Value */}
      <div className="space-y-2">
        <label htmlFor="value" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
          Porcentaje de Descuento (%) *
        </label>
        <input
          id="value"
          type="number"
          min="1"
          max="100"
          placeholder="30"
          className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: "#42d7c7" }}
          {...register("value", { valueAsNumber: true })}
        />
        {errors.value && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {errors.value.message}
          </p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
            Fecha de Inicio *
          </label>
          <input
            id="startDate"
            type="date"
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: "#42d7c7" }}
            {...register("startDate", { valueAsDate: true })}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
            Fecha de Fin *
          </label>
          <input
            id="endDate"
            type="date"
            className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: "#42d7c7" }}
            {...register("endDate", { valueAsDate: true })}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="text-red-500">⚠</span>
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-3 p-4 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
        <input
          id="isActive"
          type="checkbox"
          defaultChecked={true}
          className="w-5 h-5 rounded border-2 focus:ring-2 focus:ring-blue-500"
          style={{ accentColor: "#42d7c7" }}
          {...register("isActive")}
        />
        <div className="space-y-1">
          <label htmlFor="isActive" className="block text-sm font-medium" style={{ color: "#0c154c" }}>
            Evento Activo
          </label>
          <p className="text-sm text-gray-600">El evento estará disponible para aplicar descuentos</p>
        </div>
      </div>
    </>
  );
}
