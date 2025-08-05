import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFiles, validateFileType } from '../services/contentFileService';

export default function FileUploadPage() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errorFiles, setErrorFiles] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [allowDownload, setAllowDownload] = useState(false); // Por defecto no permitir descarga
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    // Clear previous validation errors
    setValidationErrors([]);
    
    // Validate each file
    fileArray.forEach(file => {
      const validation = validateFileType(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        const errorMessage = validation.message || `Error en archivo ${file.name}`;
        invalidFiles.push(errorMessage);
        setErrorFiles(prev => [...prev, file.name]);
      }
    });
    
    // Set validation errors to display them
    if (invalidFiles.length > 0) {
      setValidationErrors(invalidFiles);
      console.error('Archivos inválidos:', invalidFiles);
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

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
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAllFiles = async () => {
    if (!contentId || selectedFiles.length === 0) return;

    // Update uploading state for all files
    const fileNames = selectedFiles.map(f => f.name);
    setUploadingFiles(fileNames);
    setErrorFiles([]);
    setValidationErrors([]); // Clear validation errors when starting upload

    try {
      // Upload all files at once using the service
      const result = await uploadFiles(contentId, selectedFiles, { 
        isPublic: false,
        allowDownload: allowDownload 
      });
      
      // Handle successful uploads (result.files contains the actual uploaded files array)
      const successfulFiles = result.files?.map(file => file.originalName) || [];
      setUploadedFiles(prev => [...prev, ...successfulFiles]);
      
      // Handle failed uploads (result.errors contains error information)
      const failedFiles = result.errors?.map(error => error.originalName || error.fileName).filter(Boolean) || [];
      setErrorFiles(failedFiles as string[]);
      
      console.log(`Subida completada: ${successfulFiles.length} exitosos, ${failedFiles.length} fallidos`);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setErrorFiles(fileNames);
    } finally {
      setUploadingFiles([]);
    }
  };

  const getFileIcon = (_file: File) => {
    return <FileText className="h-6 w-6 text-blue-500" />;
  };

  const getFileStatus = (fileName: string) => {
    if (uploadingFiles.includes(fileName)) {
      return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
    if (uploadedFiles.includes(fileName)) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (errorFiles.includes(fileName)) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Subir Archivos al Contenido
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Drag and drop area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Puedes subir múltiples archivos a la vez
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Seleccionar archivos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-medium text-red-800">
                  Errores de validación
                </h3>
              </div>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-700">
                    • {error}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setValidationErrors([])}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* Upload options */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Opciones de subida</h3>
            <div className="flex items-center">
              <input
                id="allowDownload"
                type="checkbox"
                checked={allowDownload}
                onChange={(e) => setAllowDownload(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowDownload" className="ml-2 text-sm text-gray-700">
                Permitir descarga de archivos
                <span className="text-gray-500 block text-xs mt-1">
                  Si no está marcado, los archivos solo se pueden ver/reproducir pero no descargar
                </span>
              </label>
            </div>
          </div>

          {/* Selected files list */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Archivos seleccionados ({selectedFiles.length})
                </h3>
                <button
                  onClick={uploadAllFiles}
                  disabled={uploadingFiles.length > 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Subir todos los archivos
                </button>
              </div>

              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file)}
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getFileStatus(file.name)}
                      
                      {!uploadingFiles.includes(file.name) && 
                       !uploadedFiles.includes(file.name) && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload status */}
          {(uploadedFiles.length > 0 || errorFiles.length > 0) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              {uploadedFiles.length > 0 && (
                <p className="text-green-600 mb-2">
                  ✓ {uploadedFiles.length} archivo(s) subido(s) exitosamente
                </p>
              )}
              {errorFiles.length > 0 && (
                <p className="text-red-600">
                  ✗ Error al subir {errorFiles.length} archivo(s)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
