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
      <div className="sticky top-24 border-2 rounded-lg overflow-hidden" style={{ borderColor: "#42d7c7" }}>
        <div className="p-4 text-white" style={{ backgroundColor: "#1d4ed8" }}>
          <h3 className="text-lg font-semibold">Vista Previa</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold mb-1" style={{ color: "#0c154c" }}>
                Información del Evento
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Los descuentos se aplicarán automáticamente</p>
                <p>• Solo activo durante el rango de fechas</p>
                <p>• Se puede activar/desactivar manualmente</p>
                <p>• Un evento puede aplicarse a múltiples cursos</p>
              </div>
            </div>

            {selectedCourses.length > 0 && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: "#f0fdfa" }}>
                <h5 className="font-medium mb-2" style={{ color: "#0c154c" }}>
                  Cursos Seleccionados ({selectedCourses.length})
                </h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedCourses.map(courseId => {
                    const course = courses.find(c => c.id === courseId)
                    return course ? (
                      <div key={courseId} className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        {course.title}
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg" style={{ backgroundColor: "#eff6ff" }}>
              <h5 className="font-medium mb-2" style={{ color: "#1d4ed8" }}>
                Ejemplo de Badge
              </h5>
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: "#02ffff", color: "#0c154c" }}
              >
                <span className="mr-1">✨</span>
                30% OFF
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2" style={{ color: "#0c154c" }}>
                Campos Requeridos
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Al menos un curso</li>
                <li>• Nombre del evento</li>
                <li>• Descripción</li>
                <li>• Porcentaje de descuento</li>
                <li>• Fechas de inicio y fin</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg border" style={{ borderColor: "#42d7c7", backgroundColor: "#f0fdfa" }}>
              <p className="text-sm" style={{ color: "#0c154c" }}>
                <strong>Nota:</strong> La fecha de fin debe ser posterior a la fecha de inicio. Un evento puede aplicarse a múltiples cursos simultáneamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
