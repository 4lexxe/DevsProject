import { google } from 'googleapis';
import path from 'path';

export interface DriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  refreshToken?: string;
  folderId?: string; // Id de la carpeta raíz para archivos
  scopes: string[];
}

const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';  

if(!clientId || !clientSecret || !refreshToken) {
  throw new Error('Faltan variables de entorno necesarias para la configuración de Google Drive');
}


export const driveConfig: DriveConfig = {
  clientId: clientId,
  clientSecret: clientSecret,
  refreshToken: refreshToken,
  folderId: folderId,
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata'
  ]
};

/**
 * Crea y configura el cliente OAuth2 para Google Drive
 */
export function createDriveAuth() {
  const oauth2Client = new google.auth.OAuth2(
    driveConfig.clientId,
    driveConfig.clientSecret,
    /* driveConfig.redirectUri */
  );

  oauth2Client.setCredentials({
    refresh_token: driveConfig.refreshToken
  });

  return oauth2Client;
}

/**
 * Crea instancia de Google Drive API
 */
export function createDriveClient() {
  const auth = createDriveAuth();
  return google.drive({ version: 'v3', auth });
}

/**
 * Valida que todas las variables de entorno necesarias estén configuradas
 */
export function validateDriveConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    clientId,
    clientSecret,
    refreshToken
  ];

  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.trim() === '';
  });

  return {
    isValid: missingVars.length === 0,
    missingVars
  };
}

/**
 * Configuración de tipos de archivo permitidos
 */
export const allowedFileTypes = {
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],
  videos: [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv'
  ],
  audio: [
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/flac',
    'audio/m4a'
  ],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ],
  archives: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-tar',
    'application/gzip'
  ],
  code: [
    'text/javascript',
    'text/html',
    'text/css',
    'application/json',
    'application/xml',
    'text/xml'
  ]
};

/**
 * Configuración de límites de archivo
 */
export const fileLimits = {
  maxFileSize: 100 * 1024 * 1024, // 100MB en bytes
  maxFilesPerUpload: 10,
  allowedExtensions: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv',
    '.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a',
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
    '.txt', '.csv', '.zip', '.rar', '.tar', '.gz',
    '.js', '.html', '.css', '.json', '.xml'
  ]
};

/**
 * Obtiene la configuración completa de tipos de archivo permitidos
 */
export function getAllowedMimeTypes(): string[] {
  return [
    ...allowedFileTypes.images,
    ...allowedFileTypes.videos,
    ...allowedFileTypes.documents,
  ];
}

/**
 * Verifica si un tipo MIME está permitido
 */
export function isMimeTypeAllowed(mimeType: string): boolean {
  return getAllowedMimeTypes().includes(mimeType);
}

/**
 * Obtiene el tipo de archivo basado en el MIME type
 */
export function getFileTypeFromMime(mimeType: string): string {
  if (allowedFileTypes.images.includes(mimeType)) return 'image';
  if (allowedFileTypes.videos.includes(mimeType)) return 'video';
  if (allowedFileTypes.documents.includes(mimeType)) return 'document';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('presentation')) return 'presentation';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
  return 'other';
}

export default {
  driveConfig,
  createDriveAuth,
  createDriveClient,
  validateDriveConfig,
  allowedFileTypes,
  fileLimits,
  getAllowedMimeTypes,
  isMimeTypeAllowed,
  getFileTypeFromMime
};
