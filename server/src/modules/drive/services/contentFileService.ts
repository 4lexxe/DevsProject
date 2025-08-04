import ContentFiles from '../../course/models/ContentFiles';
import { videoProxyService } from './videoProxyService';

export interface ContentFileInfo {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  driveFileId: string;
  isVideo: boolean;
  allowDownload: boolean;
}

/**
 * Servicio para gestión segura de archivos de contenido
 */
export class ContentFileService {
  
  /**
   * Obtiene información de un archivo de contenido por su ID
   */
  async getContentFileById(contentFileId: string): Promise<ContentFileInfo | null> {
    try {
      console.log(`🔍 Buscando archivo de contenido: ${contentFileId}`);
      
      const contentFile = await ContentFiles.findByPk(contentFileId);
      
      if (!contentFile) {
        console.log(`❌ Archivo de contenido no encontrado: ${contentFileId}`);
        return null;
      }

      console.log(`✅ Archivo encontrado: ${contentFile.fileName} (${contentFile.mimeType})`);
      
      return {
        id: contentFile.id,
        fileName: contentFile.fileName,
        mimeType: contentFile.mimeType,
        fileSize: contentFile.fileSize,
        driveFileId: contentFile.driveFileId,
        isVideo: contentFile.fileType === 'video',
        allowDownload: contentFile.allowDownload
      };

    } catch (error: any) {
      console.error(`❌ Error al obtener archivo de contenido ${contentFileId}:`, error.message);
      return null;
    }
  }

  /**
   * Obtiene metadatos de video usando el ID del content file
   */
  async getVideoMetadataByContentFileId(contentFileId: string): Promise<any> {
    try {
      const contentFileInfo = await this.getContentFileById(contentFileId);
      
      if (!contentFileInfo) {
        throw new Error('Archivo de contenido no encontrado');
      }

      if (!contentFileInfo.isVideo) {
        throw new Error('El archivo no es un video');
      }

      // Usar el driveFileId para obtener metadatos de Drive
      const driveMetadata = await videoProxyService.getVideoMetadata(contentFileInfo.driveFileId);
      
      if (!driveMetadata) {
        throw new Error('No se pudieron obtener metadatos del video');
      }

      // Combinar información del ContentFile con metadatos de Drive
      return {
        ...driveMetadata,
        contentFileId: contentFileInfo.id,
        fileName: contentFileInfo.fileName,
        fileSize: contentFileInfo.fileSize,
        allowDownload: contentFileInfo.allowDownload
      };

    } catch (error: any) {
      console.error(`❌ Error al obtener metadatos de video ${contentFileId}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtiene stream de video usando el ID del content file
   */
  async getVideoStreamByContentFileId(
    contentFileId: string, 
    rangeHeader?: string
  ): Promise<any> {
    try {
      const contentFileInfo = await this.getContentFileById(contentFileId);
      
      if (!contentFileInfo) {
        throw new Error('Archivo de contenido no encontrado');
      }

      if (!contentFileInfo.isVideo) {
        throw new Error('El archivo no es un video');
      }

      // Usar el driveFileId para obtener el stream
      return await videoProxyService.getVideoStream(
        contentFileInfo.driveFileId,
        contentFileInfo.fileSize,
        contentFileInfo.mimeType,
        rangeHeader
      );

    } catch (error: any) {
      console.error(`❌ Error al obtener stream de video ${contentFileId}:`, error.message);
      throw error;
    }
  }

}

export const contentFileService = new ContentFileService();
