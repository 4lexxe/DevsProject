import { Save, Loader2 } from "lucide-react";

interface SubmitButtonsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function SubmitButtons({ isEditing, isSubmitting, onCancel }: SubmitButtonsProps) {
  return (
    <div className="flex gap-3 pt-4 border-t border-gray-200">
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
        >
          Cancelar
        </button>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${isEditing ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-900 hover:bg-gray-800`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isEditing ? 'Actualizando Evento...' : 'Creando Evento...'}
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isEditing ? 'Actualizar Evento' : 'Crear Evento'}
          </>
        )}
      </button>
    </div>
  );
}
