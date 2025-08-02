interface LoadingAndErrorStatesProps {
  loading?: boolean;
  error?: string | null;
  section?: any;
  onNavigateHome: () => void;
}

export default function LoadingAndErrorStates({ 
  loading, 
  error, 
  section, 
  onNavigateHome 
}: LoadingAndErrorStatesProps) {
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#42d7c7" }}></div>
          <span className="text-gray-700 text-lg" style={{ color: "#0c154c" }}>Cargando sección...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#0c154c" }}>Error al cargar la sección</h2>
            <p className="text-red-600 text-lg mb-6">{error}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full px-4 py-2 text-blue-700 hover:text-blue-900 font-semibold border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Volver al Dashboard
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <h3 className="font-medium text-gray-800 mb-2">Posibles soluciones:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Verifica tu conexión a internet</li>
              <li>• Asegúrate de que la sección existe</li>
              <li>• Contacta al administrador si el problema persiste</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.86 2.172"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#0c154c" }}>Sección no encontrada</h2>
            <p className="text-gray-700 text-lg mb-6">La sección que buscas no existe o no está disponible.</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onNavigateHome}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Volver al Dashboard
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-medium text-blue-800 mb-2">¿Qué puedes hacer?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verificar la URL de la sección</li>
              <li>• Buscar la sección desde el dashboard</li>
              <li>• Contactar al administrador</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
