import { CalendarDays } from "lucide-react";
import { CourseData } from "../../interfaces/CourseDetail";

interface DiscountEventsProps {
  discountEvents: CourseData['discountEvents'];
  formatDate: (dateString: string) => string;
}

export default function DiscountEvents({ discountEvents, formatDate }: DiscountEventsProps) {
  if (!discountEvents || discountEvents.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
          <CalendarDays className="h-5 w-5 inline-block mr-2" />
          Descuentos Activos/Configurados ({discountEvents.length})
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          {discountEvents.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4"
              style={{ backgroundColor: "#eff6ff", borderColor: "#42d7c7" }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold" style={{ color: "#0c154c" }}>
                  {event.event}
                </h4>
                <div
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-white"
                  style={{ backgroundColor: event.isActive ? "#42d7c7" : "#6b7280" }}
                >
                  {event.isActive ? "Activo" : "Inactivo"}
                </div>
              </div>
              <p className="text-gray-600 mb-3">{event.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium" style={{ color: "#0c154c" }}>
                    Descuento:
                  </span>{" "}
                  {event.value}%
                </div>
                <div>
                  <span className="font-medium" style={{ color: "#0c154c" }}>
                    Estado:
                  </span>{" "}
                  {event.isActive ? "Activo" : "Inactivo"}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium" style={{ color: "#0c154c" }}>
                    Inicio del evento:
                  </span>{" "}
                  {formatDate(event.startDate)}
                </div>
                <div>
                  <span className="font-medium" style={{ color: "#0c154c" }}>
                    Fin del evento:
                  </span>{" "}
                  {formatDate(event.endDate)}
                </div>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500 pt-2 border-t"
                style={{ borderColor: "#1d4ed8" }}
              >
                <div>
                  <span className="font-medium">Evento ID:</span> {event.id}
                </div>
                <div>
                  <span className="font-medium">Deleted At:</span> {event.deletedAt || "No eliminado"}
                </div>
                <div>
                  <span className="font-medium">Creado:</span> {formatDate(event.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Actualizado:</span> {formatDate(event.updatedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
