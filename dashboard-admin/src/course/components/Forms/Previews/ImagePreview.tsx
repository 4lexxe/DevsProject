import { useEffect, useState } from "react";

export default function ImagePreview({watchContentImage}: { watchContentImage: string}) {
    const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [watchContentImage])

  if (!watchContentImage) return null
  return (
    <div className="mt-6 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Previsualización de la Imagen:</h3>
      <div className="max-w-2xl mx-auto h-64 overflow-auto rounded-lg bg-white">
        {!imageError ? (
          <div className="flex items-center justify-center h-full shadow-md" >
            <img
              src={watchContentImage || "/placeholder.svg"}
              alt="Vista previa del contenido"
              className="max-w-full max-h-full object-contain"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            <span className="text-sm">Error al cargar la imagen</span>
          </div>
        )}
      </div>
    </div>
  );
}
