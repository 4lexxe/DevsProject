// components/InputFile.tsx
import React, { useState } from 'react';
import { Upload, X, AlertCircle, Link2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/shared/api/axios';


interface InputFileProps {
  value: string | null; // URL de la imagen seleccionada (si existe)
  onChange: (fileUrl: string | null) => void; // Callback para pasar la URL o limpiarla
  error?: string; // Mensaje de error (opcional)
  disabled?: boolean; // Deshabilitar el campo (opcional)
}

const InputFile: React.FC<InputFileProps> = ({ 
  value, 
  onChange, 
  error, 
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>(value && !value.includes('imgbb.com') ? 'url' : 'upload');
  const [urlInput, setUrlInput] = useState<string>(value || '');

  // Manejar cambios en el campo de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          toast.error('El archivo es demasiado grande. El límite es de 10MB.');
          return;
        }
        if (!file.type.startsWith('image/')) {
          toast.error('Solo se permiten imágenes.');
          return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data?.url) {
          setPreviewUrl(response.data.url);
          onChange(response.data.url);
          toast.success('Imagen subida correctamente');
        } else {
          throw new Error('URL no recibida del servidor');
        }
      } catch (error) {
        console.error('Error al subir archivo:', error);
        toast.error('Error al subir el archivo. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Manejar arrastre y soltura
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  // Eliminar archivo
  const handleRemove = () => {
    onChange(null); // Limpiar la URL en el padre
    setPreviewUrl(null); // Limpiar la vista previa
    setUrlInput(''); // Limpiar el input de URL
    toast.success('Imagen eliminada');
  };

  // Manejar cambio de URL
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  // Validar y aplicar URL
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Por favor, ingresa una URL válida');
      return;
    }

    try {
      // Validar que es una URL válida
      new URL(urlInput);
      
      // Verificar que termina con una extensión de imagen común
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validExtensions.some(ext => 
        urlInput.toLowerCase().endsWith(ext) || urlInput.toLowerCase().includes(ext + '?')
      );
      
      if (!hasValidExtension && !urlInput.includes('imgbb.com')) {
        toast.error('La URL debe ser una imagen válida (jpg, png, gif, etc.)');
        return;
      }

      setPreviewUrl(urlInput);
      onChange(urlInput);
      toast.success('URL de imagen aplicada');
    } catch {
      toast.error('URL inválida. Por favor, ingresa una URL completa y válida');
    }
  };

  return (
    <div className="w-full">
      {/* Selector de modo */}
      <div className="flex mb-2 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setInputMode('upload')}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
            inputMode === 'upload' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          <Upload className="w-4 h-4" />
          Subir archivo
        </button>
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
            inputMode === 'url' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          disabled={disabled}
        >
          <Link2 className="w-4 h-4" />
          Ingresar URL
        </button>
      </div>

      {/* Campo de archivo o URL */}
      {!previewUrl ? (
        <>
          {inputMode === 'upload' ? (
            <div
              className={`
                relative rounded-lg border-2 border-dashed
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                transition-all duration-200 ease-in-out
                hover:border-blue-400 hover:bg-blue-50
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file"
                name="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={disabled}
              />
              <div className="flex flex-col items-center justify-center px-6 py-8">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Haz clic para subir
                    </span>{' '}
                    o arrastra y suelta
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Solo imágenes (máx. 10MB)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex">
                <input
                  type="text"
                  value={urlInput}
                  onChange={handleUrlInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={disabled || !urlInput.trim()}
                >
                  Aplicar
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Ingresa la URL completa de una imagen (jpg, png, gif, etc.)
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="mt-2 relative">
          <div className="relative group">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="w-full h-full object-contain"
                onError={() => {
                  toast.error('Error al cargar la imagen. Verifica la URL.');
                  handleRemove();
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                {!disabled && (
                  <button
                    onClick={handleRemove}
                    className="p-2 rounded-full bg-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200"
                    type="button"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Estado de carga */}
      {isLoading && (
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          Subiendo imagen...
        </div>
      )}
      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default InputFile;