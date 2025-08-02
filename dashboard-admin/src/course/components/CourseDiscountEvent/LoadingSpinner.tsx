export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#42d7c7" }}></div>
        <span style={{ color: "#0c154c" }}>Cargando...</span>
      </div>
    </div>
  );
}
