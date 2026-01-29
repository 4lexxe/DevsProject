import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

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
        <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-800 font-medium">
            {isEditing 
              ? 'Evento de descuento actualizado exitosamente' 
              : 'Evento de descuento creado exitosamente'
            }
          </span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            {isConflictError ? (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-red-900 mb-1">
                {isConflictError ? 'Conflicto con descuentos existentes' : 'Error'}
              </div>
              <div className="text-red-700 text-sm leading-relaxed">
                {error}
              </div>
              {isConflictError && (
                <div className="mt-3 text-xs text-red-800 bg-red-100 p-3 rounded border border-red-200">
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
