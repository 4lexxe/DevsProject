// components/InputFile.tsx
import React, { useState, useEffect } from 'react';
import { Upload, X, AlertCircle, Link2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';


interface InputFileProps {
  value: string | null; // URL de la imagen seleccionada (si existe)
  onChange: (fileUrl: string | null, allUrls?: string[]) => void; // Callback para pasar la URL o limpiarla
  error?: string; // Mensaje de error (opcional)
  disabled?: boolean; // Deshabilitar el campo (opcional)
  allImages?: string[]; // Array con todas las imágenes (opcional)
}

const InputFile: React.FC<InputFileProps> = ({ 
  value, 
  onChange, 
  error, 
  disabled = false,
  allImages = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Array para almacenar múltiples imágenes (hasta 8)
  const [imageUrls, setImageUrls] = useState<string[]>(value ? [value] : []);
  
  // Índice de la imagen actualmente mostrada
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [inputMode, setInputMode] = useState<'upload' | 'url'>(value && !value.includes('imgbb.com') ? 'url' : 'upload');
  const [urlInput, setUrlInput] = useState<string>('');

  // Solo inicializar con allImages al montar el componente o cuando cambie
  useEffect(() => {
    if (allImages && allImages.length > 0) {
      setImageUrls(allImages);
    }
  }, [allImages]);

  // Efecto para actualizar imageUrls cuando cambia el valor de entrada
  // Esto es importante cuando las imágenes se cargan desde el servidor
  useEffect(() => {
    if (value && !imageUrls.includes(value)) {
      setImageUrls(prev => [...prev, value]);
    }
  }, [value, imageUrls]);

  // Obtener la URL de la imagen actual para mostrar
  const currentImageUrl = imageUrls.length > 0 ? imageUrls[currentImageIndex] : null;

  // Manejar cambios en el campo de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        console.log('Archivo seleccionado:', file.name);
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          toast.error('El archivo es demasiado grande. El límite es de 10MB.');
          return;
        }
        if (!file.type.startsWith('image/')) {
          toast.error('Solo se permiten imágenes.');
          return;
        }
        
        // Verificar si ya alcanzamos el límite de 8 imágenes
        if (imageUrls.length >= 8) {
          toast.error('Has alcanzado el límite máximo de 8 imágenes.');
          return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        console.log('Subiendo archivo...');
        const response = await api.post('/forum/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data?.url) {
          console.log('URL recibida:', response.data.url);
          // Agregar la nueva URL al array de imágenes
          const newUrls = [...imageUrls, response.data.url];
          setImageUrls(newUrls);
          
          // Actualizar el índice para mostrar la nueva imagen
          setCurrentImageIndex(newUrls.length - 1);
          
          // Notificar al componente padre con la URL recibida y todas las URLs
          onChange(response.data.url, newUrls);
          
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

  // Eliminar imagen actual
  const handleRemoveCurrentImage = () => {
    if (imageUrls.length === 0) return;
    
    // Crear una nueva array sin la imagen actual
    const newUrls = [...imageUrls];
    newUrls.splice(currentImageIndex, 1);
    
    setImageUrls(newUrls);
    
    // Ajustar el índice actual si es necesario
    if (currentImageIndex >= newUrls.length && newUrls.length > 0) {
      setCurrentImageIndex(newUrls.length - 1);
    } else if (newUrls.length === 0) {
      setCurrentImageIndex(0);
      // Notificar al componente padre que no hay imágenes Y pasar array vacío
      onChange(null, []);
      toast.success('Imagen eliminada');
      return;
    }
    
    // Siempre notificar al padre con el array completo de imágenes restantes
    onChange(newUrls[currentImageIndex < newUrls.length ? currentImageIndex : 0], newUrls);
    
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
    
    // Verificar si ya alcanzamos el límite de 8 imágenes
    if (imageUrls.length >= 8) {
      toast.error('Has alcanzado el límite máximo de 8 imágenes.');
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

      // Agregar la URL al array de imágenes
      const newUrls = [...imageUrls, urlInput];
      setImageUrls(newUrls);
      
      // Actualizar el índice para mostrar la nueva imagen
      setCurrentImageIndex(newUrls.length - 1);
      
      // Notificar al componente padre con la URL recibida y todas las URLs
      onChange(urlInput, newUrls);
      
      // Limpiar el input de URL
      setUrlInput('');
      
      toast.success('URL de imagen aplicada');
    } catch {
      toast.error('URL inválida. Por favor, ingresa una URL completa y válida');
    }
  };
  
  // Navegar a la imagen anterior
  const handlePrevImage = () => {
    if (imageUrls.length <= 1) return;
    
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : imageUrls.length - 1));
  };
  
  // Navegar a la imagen siguiente
  const handleNextImage = () => {
    if (imageUrls.length <= 1) return;
    
    setCurrentImageIndex(prev => (prev < imageUrls.length - 1 ? prev + 1 : 0));
  };
  
  // Muestra el botón de añadir imagen si hay al menos una imagen pero menos de 8
  const showAddImageButton = imageUrls.length > 0 && imageUrls.length < 8;
  
  // Muestra los controles de navegación si hay más de una imagen
  const showNavigationControls = imageUrls.length > 1;

  return (
    <div className="w-full">
      {/* Selector de modo (solo se muestra si no hay imágenes) */}
      {imageUrls.length === 0 && (
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
      )}

      {/* Campo de archivo o URL (solo se muestra si no hay imágenes) */}
      {imageUrls.length === 0 ? (
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
          {/* Contador de imágenes */}
          <div className="absolute top-2 right-2 z-20 bg-black bg-opacity-50 text-white rounded-full px-2 py-0.5 text-xs">
            {currentImageIndex + 1} / {imageUrls.length}
          </div>
          
          {/* Vista previa de la imagen actual */}
          <div className="relative group">
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImageUrl!}
                alt="Vista previa"
                className="w-full h-full object-contain"
                onError={() => {
                  toast.error('Error al cargar la imagen. Verifica la URL.');
                  handleRemoveCurrentImage();
                }}
              />
              
              {/* Overlay con botones */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                {!disabled && (
                  <button
                    onClick={handleRemoveCurrentImage}
                    className="p-2 rounded-full bg-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200"
                    type="button"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Controles de navegación */}
              {showNavigationControls && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                    type="button"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                    type="button"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Botón para agregar más imágenes */}
          {showAddImageButton && (
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {8 - imageUrls.length} imágenes restantes
              </div>
              <div className="flex gap-2">
                {/* Botón para agregar por URL */}
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('url');
                    // Mostrar el input de URL
                    if (imageUrls.length > 0) {
                      const modal = document.getElementById('urlInputModal');
                      if (modal) modal.classList.remove('hidden');
                    }
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded flex items-center gap-1 text-sm hover:bg-gray-200 transition-colors"
                  disabled={disabled}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Añadir URL
                </button>
                
                {/* Botón para subir archivo */}
                <div className="relative">
                  <input
                    type="file"
                    id="addImage"
                    name="addImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={disabled}
                  />
                  <button
                    type="button"
                    className="px-6 py-1.5 bg-blue-600 text-white rounded flex items-center gap-1 text-sm hover:bg-blue-700 transition-colors"
                    disabled={disabled}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Añadir imagen
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal para input de URL (visible cuando se hace clic en Añadir URL) */}
          <div id="urlInputModal" className="hidden mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
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
                  onClick={() => {
                    handleUrlSubmit();
                    // Ocultar el modal después de agregar
                    const modal = document.getElementById('urlInputModal');
                    if (modal) modal.classList.add('hidden');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={disabled || !urlInput.trim()}
                >
                  Añadir
                </button>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">
                  Ingresa la URL completa de una imagen
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const modal = document.getElementById('urlInputModal');
                    if (modal) modal.classList.add('hidden');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancelar
                </button>
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