interface AlertNotificationsProps {
  submitSuccess: boolean;
  error: string | null;
  isEditing: boolean;
}

export default function AlertNotifications({ submitSuccess, error, isEditing }: AlertNotificationsProps) {
  if (!submitSuccess && !error) return null;

  // Verificar si el error es sobre cursos con descuentos activos
  const isConflictError = error?.includes('ya tienen descuentos activos');

  return (
    <>
      {/* Success Alert */}
      {submitSuccess && (
        <div
          className="mb-6 p-4 rounded-lg border-2 flex items-center gap-2"
          style={{ borderColor: "#42d7c7", backgroundColor: "#f0fdfa" }}
        >
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#42d7c7" }}></div>
          <span style={{ color: "#0c154c" }}>
            {isEditing 
              ? '¡Evento de descuento actualizado exitosamente!' 
              : '¡Evento de descuento creado exitosamente!'
            }
          </span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          className="mb-6 p-4 rounded-lg border-2"
          style={{ borderColor: "#ef4444", backgroundColor: "#fef2f2" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full mt-0.5" style={{ backgroundColor: "#ef4444" }}></div>
            <div className="flex-1">
              <div className="font-medium text-red-800 mb-1">
                {isConflictError ? '⚠️ Conflicto con descuentos existentes' : '❌ Error'}
              </div>
              <div className="text-red-700 text-sm leading-relaxed">
                {error}
              </div>
              {isConflictError && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  <strong>Sugerencia:</strong> Desactiva los descuentos existentes de esos cursos antes de asignar el nuevo descuento, o selecciona otros cursos que no tengan descuentos activos.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
