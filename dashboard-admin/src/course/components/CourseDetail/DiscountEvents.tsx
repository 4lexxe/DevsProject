import { CourseData } from "../../interfaces/CourseDetail";
import { Calendar, Tag, Percent, CheckCircle2, XCircle, Hash, RefreshCw, Trash2, Eye } from "lucide-react";

interface DiscountEventsProps {
  discountEvents: CourseData['discountEvents'];
  formatDate: (dateString: string) => string;
}

export default function DiscountEvents({ discountEvents, formatDate }: DiscountEventsProps) {
  if (!discountEvents || discountEvents.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Descuentos Activos/Configurados ({discountEvents.length})
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {discountEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <h4 className="font-semibold text-base text-gray-900">
                    {event.event}
                  </h4>
                </div>
                <div
                  className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: event.isActive ? "#10b981" : "#6b7280" }}
                >
                  {event.isActive ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {event.isActive ? "Activo" : "Inactivo"}
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{event.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded border border-gray-200">
                  <Percent className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-xs text-gray-500 block">Descuento</span>
                    <span className="font-semibold text-gray-900 text-sm">{event.value}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded border border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-xs text-gray-500 block">Inicio</span>
                    <span className="font-medium text-gray-900 text-sm">{formatDate(event.startDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded border border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-xs text-gray-500 block">Fin</span>
                    <span className="font-medium text-gray-900 text-sm">{formatDate(event.endDate)}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-500 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  <span>ID: {event.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>Creado: {formatDate(event.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  <span>Actualizado: {formatDate(event.updatedAt)}</span>
                </div>
                {event.deletedAt && (
                  <div className="flex items-center gap-1.5">
                    <Trash2 className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Eliminado: {formatDate(event.deletedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
