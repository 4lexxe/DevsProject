// components/InputFile.tsx
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';


interface InputFileProps {
  value: string | null; // URL de la imagen seleccionada (si existe)
  onChange: (fileUrl: string | null) => void; // Callback para pasar la URL o limpiarla
  error?: string; // Mensaje de error (opcional)
  disabled?: boolean; // Deshabilitar el campo (opcional)
}

const InputFile: React.FC<InputFileProps> = ({ value, onChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);

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
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Etiqueta del campo */}
      <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
        Subir archivo *
      </label>
      {/* Campo de archivo */}
      {!previewUrl ? (
        <div
          className={`
            relative rounded-lg border-2 border-dashed
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            transition-all duration-200 ease-in-out
            hover:border-blue-400 hover:bg-blue-50
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
        <div className="mt-2 relative">
          <div className="relative group">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewUrl} // Mostrar la vista previa usando la URL pública devuelta por el backend
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={handleRemove}
                  className="p-2 rounded-full bg-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200"
                  type="button"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Estado de carga */}
      {isLoading && (
        <p className="mt-2 text-sm text-blue-600">Subiendo archivo...</p>
      )}
      {/* Mensaje de error */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default InputFile;