interface QuizFormHeaderProps {
  isEditMode: boolean;
  isLoading: boolean;
  submitError: string | null;
  serverErrors: Array<{path: string, message: string}>;
}

export default function QuizFormHeader({ 
  isEditMode, 
  isLoading, 
  submitError, 
  serverErrors
}: QuizFormHeaderProps) {
  // Loading state for edit mode
  if (isEditMode && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Editar Quiz' : 'Configurar Quiz'}
        </h1>
        <p className="text-gray-600 mt-1">
          Configura las preguntas y respuestas para el contenido
        </p>
      </div>

      {/* Error Messages */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al guardar</h3>
              <p className="text-red-700 text-sm font-medium mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Server Validation Errors */}
      {serverErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-red-800 text-sm font-semibold mb-2">
                Errores de validación del servidor ({serverErrors.length}):
              </h4>
              <ul className="space-y-1">
                {serverErrors.map((error, index) => (
                  <li key={index} className="text-red-700 text-sm flex items-start">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>
                      <strong className="font-medium">{error.path}:</strong> {error.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Help text for form usage */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Consejos para crear quizzes</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Cada pregunta debe tener al menos una respuesta</li>
                <li>Para "Verdadero/Falso" usa exactamente 2 respuestas</li>
                <li>Para "Selección Única" marca solo 1 respuesta como correcta</li>
                <li>Para "Opción Múltiple" puedes marcar varias respuestas correctas</li>
                <li>Para "Respuesta Corta" las respuestas son de referencia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
