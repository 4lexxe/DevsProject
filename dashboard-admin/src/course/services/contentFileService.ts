import api from '../../shared/api/axios';

// Interfaces for TypeScript support
export interface ContentFile {
  id: bigint;
  contentId: bigint;
  fileName: string;
  originalName: string;
  fileType: "video" | "audio" | "document" | "image" | "pdf" | "presentation" | "spreadsheet" | "code" | "archive" | "other";
  fileSize: number;
  mimeType: string;
  driveFileId: string;
  driveUrl: string;
  driveWebViewLink?: string;
  driveWebContentLink?: string;
  drivePreviewLink?: string;
  description?: string;
  isPublic: boolean;
  allowDownload: boolean;
  uploadedBy: bigint;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUploadResponse {
  uploadedFiles: number; // cantidad de archivos subidos
  totalFiles: number;
  files: ContentFile[]; // array real de archivos subidos
  errors?: Array<{
    originalName?: string;
    fileName?: string;
    error: string;
  }>;
  summary: {
    success: number;
    failed: number;
    total: number;
    successRate: string;
  };
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  fileTypes: Record<string, number>;
  publicFiles: number;
  privateFiles: number;
}

// Get all files for a specific content
export const getContentFiles = async (contentId: string, options?: {
  fileType?: string;
  isPublic?: boolean;
  orderBy?: 'position' | 'createdAt' | 'fileName';
  order?: 'ASC' | 'DESC';
}): Promise<ContentFile[]> => {
  try {
    console.log(`Obteniendo archivos para el contenido ID: ${contentId}`);
    
    const params = new URLSearchParams();
    if (options?.fileType) params.append('fileType', options.fileType);
    if (options?.isPublic !== undefined) params.append('isPublic', options.isPublic.toString());
    if (options?.orderBy) params.append('orderBy', options.orderBy);
    if (options?.order) params.append('order', options.order);
    
    const queryString = params.toString();
    const url = `/contents/${contentId}/files${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener archivos del contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get a specific file by ID
export const getFileById = async (fileId: string): Promise<ContentFile> => {
  try {
    console.log(`Obteniendo archivo con ID: ${fileId}`);
    const response = await api.get(`/content-files/${fileId}`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al obtener el archivo (ID: ${fileId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Upload files to content
export const uploadFiles = async (
  contentId: string,
  files: File[],
  options?: {
    isPublic?: boolean;
    allowDownload?: boolean;
    descriptions?: string[];
  }
): Promise<FileUploadResponse> => {
  try {
    console.log(`Subiendo ${files.length} archivo(s) al contenido ID: ${contentId}`);
    
    const formData = new FormData();
    
    // Add contentId and options
    if (options?.isPublic !== undefined) {
      formData.append('isPublic', options.isPublic.toString());
    }
    if (options?.allowDownload !== undefined) {
      formData.append('allowDownload', options.allowDownload.toString());
    }
    
    // Add files with the correct field name that multer expects
    files.forEach((file, index) => {
      formData.append('files', file);
      if (options?.descriptions?.[index]) {
        formData.append(`description_${index}`, options.descriptions[index]);
      }
    });
    
    const response = await api.post(`/contents/${contentId}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Progress tracking
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      },
    });
    
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al subir archivos al contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a file
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    console.log(`Eliminando archivo ID: ${fileId}`);
    await api.delete(`/content-files/${fileId}`);
    console.log(`Archivo eliminado exitosamente (ID: ${fileId})`);
  } catch (error: any) {
    console.error(
      `Error al eliminar el archivo (ID: ${fileId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Reorder files
export const reorderFiles = async (
  contentId: string,
  fileOrders: Array<{ fileId: string; position: number }>
): Promise<ContentFile[]> => {
  try {
    console.log(`Reordenando archivos del contenido ID: ${contentId}`);
    const response = await api.put(`/contents/${contentId}/files/reorder`, {
      fileOrders
    });
    return response.data.data;
  } catch (error: any) {
    console.error(
      `Error al reordenar archivos del contenido (ID: ${contentId}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file type icon/color
export const getFileTypeInfo = (fileType: ContentFile['fileType']) => {
  const typeMap = {
    video: { icon: '🎥', color: 'text-red-600', bgColor: 'bg-red-100' },
    audio: { icon: '🎵', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    image: { icon: '🖼️', color: 'text-green-600', bgColor: 'bg-green-100' },
    pdf: { icon: '📄', color: 'text-red-600', bgColor: 'bg-red-100' },
    document: { icon: '📝', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    presentation: { icon: '📊', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    spreadsheet: { icon: '📈', color: 'text-green-600', bgColor: 'bg-green-100' },
    code: { icon: '💻', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    archive: { icon: '🗂️', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    other: { icon: '📎', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  };
  
  return typeMap[fileType] || typeMap.other;
};

// Helper function to validate file types (can be customized)
export const validateFileType = (file: File): { isValid: boolean; message?: string } => {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // Videos
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
    // Audio
    'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-tar',
    // Code
    'text/plain', 'application/json', 'text/javascript', 'text/css', 'text/html'
  ];
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      message: `El archivo ${file.name} excede el tamaño máximo de 100MB`
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: `El tipo de archivo ${file.type} no está permitido`
    };
  }
  
  return { isValid: true };
};