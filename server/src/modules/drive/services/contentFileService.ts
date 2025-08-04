import ContentFiles from '../../course/models/ContentFiles';
import { videoProxyService } from './videoProxyService';

export interface ContentFileInfo {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  driveFileId: string;
  isVideo: boolean;
  isPublic: boolean;
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
        isVideo: contentFile.isVideoFile(),
        isPublic: contentFile.isPublic,
        allowDownload: contentFile.allowDownload
      };

    } catch (error: any) {
      console.error(`❌ Error al obtener archivo de contenido ${contentFileId}:`, error.message);
      return null;
    }
  }

  /**
   * Verifica si un archivo de contenido es un video
   */
  async isVideoFile(contentFileId: string): Promise<boolean> {
    try {
      const contentFile = await ContentFiles.findByPk(contentFileId);
      return contentFile ? contentFile.isVideoFile() : false;
    } catch (error: any) {
      console.error(`❌ Error al verificar tipo de archivo ${contentFileId}:`, error.message);
      return false;
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
        isPublic: contentFileInfo.isPublic,
        allowDownload: contentFileInfo.allowDownload
      };

    } catch (error: any) {
      console.error(`❌ Error al obtener metadatos de video ${contentFileId}:`, error.message);
      throw error;
    }
  }

  /**
   * Verifica acceso del usuario a un archivo de contenido
   */
  async verifyUserAccess(contentFileId: string, userId?: string): Promise<{
    hasAccess: boolean;
    reason: string;
    contentFileInfo?: ContentFileInfo;
  }> {
    try {
      const contentFileInfo = await this.getContentFileById(contentFileId);
      
      if (!contentFileInfo) {
        return {
          hasAccess: false,
          reason: 'Archivo de contenido no encontrado'
        };
      }

      // Si el archivo es público, permitir acceso
      if (contentFileInfo.isPublic) {
        return {
          hasAccess: true,
          reason: 'Archivo público',
          contentFileInfo
        };
      }

      // TODO: Implementar lógica de verificación de acceso basada en suscripciones/compras
      // Por ahora, permitir acceso si el usuario está autenticado
      if (userId) {
        return {
          hasAccess: true,
          reason: 'Usuario autenticado',
          contentFileInfo
        };
      }

      return {
        hasAccess: false,
        reason: 'Acceso denegado - archivo privado y usuario no autenticado'
      };

    } catch (error: any) {
      console.error(`❌ Error al verificar acceso ${contentFileId}:`, error.message);
      return {
        hasAccess: false,
        reason: `Error al verificar acceso: ${error.message}`
      };
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

  /**
   * Obtiene todos los archivos de video de un contenido específico
   */
  async getVideoFilesByContentId(contentId: string): Promise<ContentFileInfo[]> {
    try {
      const contentFiles = await ContentFiles.findAll({
        where: {
          contentId: contentId,
          fileType: 'video'
        },
        order: [['position', 'ASC']]
      });

      return contentFiles.map(file => ({
        id: file.id,
        fileName: file.fileName,
        mimeType: file.mimeType,
        fileSize: file.fileSize,
        driveFileId: file.driveFileId,
        isVideo: file.isVideoFile(),
        isPublic: file.isPublic,
        allowDownload: file.allowDownload
      }));

    } catch (error: any) {
      console.error(`❌ Error al obtener archivos de video del contenido ${contentId}:`, error.message);
      return [];
    }
  }
}

export const contentFileService = new ContentFileService();
