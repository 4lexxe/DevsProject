interface AccessDeniedProps {
  message?: string;
  title?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  fullScreen?: boolean;
}

const AccessDenied = ({
  message = "No tienes acceso a este curso.",
  title = "Acceso Denegado",
  showRetry = false,
  onRetry,
  fullScreen = false,
}: AccessDeniedProps) => {
  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50"
    : "min-h-[400px] flex items-center justify-center";

  return (
    <div className={containerClass}>
      <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-200 shadow-lg">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <div className="text-xl text-gray-800 mb-2 font-semibold">{title}</div>
        <div className="text-gray-700 mb-4">{message}</div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default AccessDenied;
