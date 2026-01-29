import { CheckCircle2, Info, Tag } from "lucide-react";

interface Course {
  id: number;
  title: string;
}

interface DiscountEventPreviewProps {
  selectedCourses: number[];
  courses: Course[];
}

export default function DiscountEventPreview({ selectedCourses, courses }: DiscountEventPreviewProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">
                Información del Evento
              </h4>
              <div className="text-sm text-gray-600 space-y-1.5">
                <p className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Los descuentos se aplicarán automáticamente</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Solo activo durante el rango de fechas</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Se puede activar/desactivar manualmente</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Un evento puede aplicarse a múltiples cursos</span>
                </p>
              </div>
            </div>

            {selectedCourses.length > 0 && (
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <h5 className="font-semibold mb-3 text-gray-900">
                  Cursos Seleccionados ({selectedCourses.length})
                </h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedCourses.map(courseId => {
                    const course = courses.find(c => c.id === courseId)
                    return course ? (
                      <div key={courseId} className="text-sm text-gray-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="font-medium">{course.title}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg border border-gray-200 bg-white">
              <h5 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Ejemplo de Badge
              </h5>
              <div className="inline-flex items-center px-3 py-1.5 rounded border border-gray-300 bg-gray-50 text-sm font-medium text-gray-900">
                30% OFF
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-gray-900">
                Campos Requeridos
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Al menos un curso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Nombre del evento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Descripción</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Porcentaje de descuento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>Fechas de inicio y fin</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong>Nota:</strong> La fecha de fin debe ser posterior a la fecha de inicio. Un evento puede aplicarse a múltiples cursos simultáneamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
