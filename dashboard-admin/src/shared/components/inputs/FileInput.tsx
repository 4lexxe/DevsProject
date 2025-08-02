import { useState, type ChangeEvent } from "react";
import { X, Upload, File, Image, Video, FileText } from "lucide-react";

interface FileInputProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxSizeKb?: number;
  showPreview?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onFilesChange?: (files: File[]) => void;
  onError?: (error: string) => void;
}

interface FileWithPreview {
  file: File;
  preview?: string;
  id: string;
}

function FileInput({
  label = "Archivos",
  multiple = false,
  accept = "*/*",
  maxFiles = multiple ? 10 : 1,
  maxSizeKb = 10240, // 10MB por defecto
  showPreview = true,
  disabled = false,
  placeholder = "Elegir archivo(s)",
  className = "",
  onFilesChange,
  onError,
}: FileInputProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Función para validar archivos
  const validateFile = (file: File): string | null => {
    // Validar tamaño
    if (file.size > maxSizeKb * 1024) {
      return `El archivo "${file.name}" excede el tamaño máximo de ${maxSizeKb}KB`;
    }

    // Validar tipo si se especifica accept
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace("*", ".*"));
      });
      
      if (!isValidType) {
        return `El archivo "${file.name}" no es un tipo válido`;
      }
    }

    return null;
  };

  // Función para crear preview
  const createFilePreview = (file: File): Promise<FileWithPreview> => {
    return new Promise((resolve) => {
      const fileWithPreview: FileWithPreview = {
        file,
        id: Math.random().toString(36).substr(2, 9),
      };

      if (showPreview && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileWithPreview.preview = e.target?.result as string;
          resolve(fileWithPreview);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(fileWithPreview);
      }
    });
  };

  // Manejar selección de archivos
  const handleFileSelection = async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    
    // Validar número máximo de archivos
    const totalFiles = files.length + fileArray.length;
    if (totalFiles > maxFiles) {
      onError?.(`No puedes subir más de ${maxFiles} archivo(s)`);
      return;
    }

    // Validar cada archivo
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        onError?.(error);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Crear previews para archivos válidos
    const newFilesWithPreview = await Promise.all(
      validFiles.map(file => createFilePreview(file))
    );

    const updatedFiles = multiple 
      ? [...files, ...newFilesWithPreview]
      : newFilesWithPreview;

    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(f => f.file));
  };

  // Manejar cambio en input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelection(selectedFiles);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo otra vez
    e.target.value = "";
  };

  // Manejar drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelection(droppedFiles);
    }
  };

  // Remover archivo
  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(f => f.file));
  };

  // Limpiar todos los archivos
  const clearFiles = () => {
    setFiles([]);
    onFilesChange?.([]);
  };

  // Obtener icono según tipo de archivo
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (file.type.startsWith("video/")) return <Video className="w-4 h-4" />;
    if (file.type.includes("pdf") || file.type.includes("document")) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Drag & Drop Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
        />

        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              {placeholder}
            </span>
            {' o arrastra y suelta aquí'}
          </div>
          <p className="text-xs text-gray-500">
            {accept !== "*/*" && `Tipos permitidos: ${accept} • `}
            Máximo {formatFileSize(maxSizeKb * 1024)}
            {multiple && ` • Hasta ${maxFiles} archivo(s)`}
          </p>
        </div>
      </div>

      {/* Lista de archivos seleccionados */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Archivos seleccionados ({files.length}/{maxFiles})
            </span>
            {multiple && files.length > 1 && (
              <button
                type="button"
                onClick={clearFiles}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Limpiar todos
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((fileWithPreview) => (
              <div
                key={fileWithPreview.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg border"
              >
                {/* Preview o icono */}
                <div className="flex-shrink-0 mr-3">
                  {fileWithPreview.preview ? (
                    <img
                      src={fileWithPreview.preview}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      {getFileIcon(fileWithPreview.file)}
                    </div>
                  )}
                </div>

                {/* Información del archivo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileWithPreview.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileWithPreview.file.size)}
                  </p>
                </div>

                {/* Botón para remover */}
                <button
                  type="button"
                  onClick={() => removeFile(fileWithPreview.id)}
                  className="flex-shrink-0 ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileInput;
