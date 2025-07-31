interface SubmitButtonsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function SubmitButtons({ isEditing, isSubmitting, onCancel }: SubmitButtonsProps) {
  return (
    <div className="flex gap-4">
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 transition-all duration-300 hover:bg-gray-50"
          style={{ borderColor: "#d1d5db" }}
        >
          Cancelar
        </button>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${isEditing ? 'flex-1' : 'w-full'} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{ backgroundColor: "#42d7c7" }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {isEditing ? 'Actualizando Evento...' : 'Creando Evento...'}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>💾</span>
            {isEditing ? 'Actualizar Evento de Descuento' : 'Crear Evento de Descuento'}
          </span>
        )}
      </button>
    </div>
  );
}
