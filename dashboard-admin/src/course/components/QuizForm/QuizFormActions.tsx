import { Save, X, PlusIcon } from "lucide-react";

interface QuizFormActionsProps {
  isSubmitting: boolean;
  questionFields: any[];
  onCancel: () => void;
  onAddQuestion: () => void;
}

export default function QuizFormActions({ 
  isSubmitting, 
  questionFields, 
  onCancel, 
  onAddQuestion 
}: QuizFormActionsProps) {
  return (
    <div className="space-y-6">
      {/* Add Question Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onAddQuestion}
          className="inline-flex items-center px-4 py-3 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200 shadow-sm"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Pregunta
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {questionFields.length + 1}
          </span>
        </button>
      </div>

      {/* Form Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">
                Total de preguntas: {questionFields.length}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                Lista para enviar
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Última modificación: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting || questionFields.length === 0}
          className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando Quiz...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Quiz
            </>
          )}
        </button>
      </div>

      {/* Help text for actions */}
      {questionFields.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">No hay preguntas configuradas</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Agrega al menos una pregunta antes de guardar el quiz. Cada pregunta debe tener al menos una respuesta.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced options section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Opciones avanzadas</h3>
          <span className="text-sm text-gray-500">Configuración adicional del quiz</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Auto-guardar</h4>
                <p className="text-xs text-gray-500">Cambios guardados automáticamente</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Validación</h4>
                <p className="text-xs text-gray-500">Verificación en tiempo real</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Vista previa</h4>
                <p className="text-xs text-gray-500">Disponible después de guardar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
