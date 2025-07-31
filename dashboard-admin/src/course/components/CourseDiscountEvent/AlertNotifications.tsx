interface AlertNotificationsProps {
  submitSuccess: boolean;
  error: string | null;
  isEditing: boolean;
}

export default function AlertNotifications({ submitSuccess, error, isEditing }: AlertNotificationsProps) {
  if (!submitSuccess && !error) return null;

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
          className="mb-6 p-4 rounded-lg border-2 flex items-center gap-2"
          style={{ borderColor: "#ef4444", backgroundColor: "#fef2f2" }}
        >
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#ef4444" }}></div>
          <span style={{ color: "#dc2626" }}>{error}</span>
        </div>
      )}
    </>
  );
}
