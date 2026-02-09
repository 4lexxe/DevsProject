import { Readable } from 'stream';
import { createDriveClient } from '../config/driveConfig';
import { drive_v3 } from 'googleapis';

export interface VideoStreamResult {
  success: boolean;
  stream?: Readable;
  contentType?: string;
  contentRange?: string;
  contentLength?: number;
  totalLength?: number;
  error?: string;
}

export interface VideoMetadata {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  duration?: string;
}

/**
 * Servicio para hacer proxy de videos de Google Drive sin exponer URLs
 */
export class VideoProxyService {
  private drive: drive_v3.Drive;

  constructor() {
    this.drive = createDriveClient();
  }

  /**
   * Valida que el archivo existe y es un video
   */
  async validateVideoFile(fileId: string): Promise<VideoMetadata | null> {
    try {
      console.log(` Validando archivo de video: ${fileId}`);

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,size,videoMediaMetadata'
      });

      const file = response.data;

      if (!file.mimeType?.startsWith('video/')) {
        console.log(` El archivo ${fileId} no es un video: ${file.mimeType}`);
        return null;
      }

      console.log(` Video válido: ${file.name} (${file.mimeType})`);

      return {
        id: file.id!,
        name: file.name || 'Video sin nombre',
        mimeType: file.mimeType,
        size: file.size || undefined,
        duration: file.videoMediaMetadata?.durationMillis
      };

    } catch (error: any) {
      console.error(` Error al validar archivo de video ${fileId}:`, error.message);
      return null;
    }
  }

  /**
   * Obtiene el stream de video desde Google Drive
   */
  async getVideoStream(fileId: string, totalSize: number, mimeType: string, rangeHeader?: string): Promise<VideoStreamResult> {
    try {
      console.log(` Obteniendo stream de video: ${fileId} (${totalSize} bytes)`);

      // Ya no necesitamos consultar metadatos - los recibimos como parámetros
      if (!mimeType.startsWith('video/')) {
        return {
          success: false,
          error: 'El archivo no es un video'
        };
      }

      // Configurar headers para el request a Google Drive
      const headers: any = {};
      let start = 0;
      let end = totalSize - 1;

      // Procesar header Range si existe (para streaming progresivo)
      if (rangeHeader) {
        const range = rangeHeader.replace(/bytes=/, '').split('-');
        start = parseInt(range[0], 10) || 0;
        end = parseInt(range[1], 10) || totalSize - 1;
        
        headers.Range = `bytes=${start}-${end}`;
        console.log(` Range solicitado: ${start}-${end} de ${totalSize}`);
      }

      // Obtener el stream desde Google Drive
      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, {
        headers,
        responseType: 'stream'
      });

      const contentLength = end - start + 1;
      const contentRange = rangeHeader ? `bytes ${start}-${end}/${totalSize}` : undefined;

      console.log(` Stream obtenido exitosamente para ${fileId}`);

      return {
        success: true,
        stream: response.data as Readable,
        contentType: mimeType,
        contentRange,
        contentLength,
        totalLength: totalSize
      };

    } catch (error: any) {
      console.error(` Error al obtener stream de video ${fileId}:`, error.message);
      return {
        success: false,
        error: error.message || 'Error al obtener el stream del video'
      };
    }
  }

  /**
   * Obtiene metadatos del video sin exponer URLs de Drive
   */
  async getVideoMetadata(fileId: string): Promise<VideoMetadata | null> {
    try {
      console.log(` Obteniendo metadatos de video: ${fileId}`);

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,size,videoMediaMetadata(durationMillis,width,height)'
      });

      const file = response.data;

      if (!file.mimeType?.startsWith('video/')) {
        return null;
      }

      return {
        id: file.id!,
        name: file.name || 'Video sin nombre',
        mimeType: file.mimeType,
        size: file.size || undefined,
        duration: file.videoMediaMetadata?.durationMillis
      };

    } catch (error: any) {
      console.error(` Error al obtener metadatos de video ${fileId}:`, error.message);
      return null;
    }
  }

  /**
   * Limpia cache de streams (si implementas caching)
   */
  async clearVideoCache(fileId: string): Promise<void> {
    try {
      console.log(` Limpiando cache de video: ${fileId}`);
      // TODO: Implementar limpieza de cache si es necesario
    } catch (error: any) {
      console.error(` Error al limpiar cache de video ${fileId}:`, error.message);
    }
  }
}

export const videoProxyService = new VideoProxyService();
