import { Request, Response } from 'express';
import { contentFileService } from '../services/contentFileService';

/**
 * Controlador para el proxy de videos usando ContentFile IDs
 */
export class SecureVideoController {
  
  /**
   * Obtiene el stream de video usando contentFileId
   */
  async getVideoStream(req: Request, res: Response): Promise<void> {
    try {
      const { contentFileId } = req.params;
      const { range } = req.headers;
      const userId = (req as any).user?.id; // Obtener ID del usuario autenticado

      if (!contentFileId) {
        res.status(400).json({ error: 'Content File ID es requerido' });
        return;
      }

      console.log(`🎥 Solicitando stream de video por ContentFile: ${contentFileId}`);
      console.log(`📊 Headers recibidos:`, {
        range: range,
        userAgent: req.headers['user-agent'],
        origin: req.headers.origin,
        userId: userId || 'anónimo'
      });

      // Verificar acceso del usuario al archivo
      const accessCheck = await contentFileService.verifyUserAccess(contentFileId, userId);
      if (!accessCheck.hasAccess) {
        res.status(403).json({ 
          error: 'Acceso denegado',
          reason: accessCheck.reason 
        });
        return;
      }

      console.log(`✅ Acceso verificado: ${accessCheck.reason}`);

      // Obtener stream del video
      const streamResult = await contentFileService.getVideoStreamByContentFileId(
        contentFileId, 
        range as string
      );
      
      if (!streamResult.success || !streamResult.stream) {
        res.status(500).json({ error: streamResult.error || 'Error al obtener el stream' });
        return;
      }

      // Configurar headers para streaming de video con CORS
      res.set({
        'Content-Type': streamResult.contentType || 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Headers CORS para permitir acceso desde el frontend
        'Access-Control-Allow-Origin': process.env.CLIENT_URL || 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        // Cross-Origin Resource Policy para permitir el acceso
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        // Headers informativos
        'X-Content-File-ID': contentFileId,
        'X-Access-Reason': accessCheck.reason
      });

      if (streamResult.contentRange) {
        res.set('Content-Range', streamResult.contentRange);
        res.set('Content-Length', streamResult.contentLength?.toString() || '0');
        res.status(206); // Partial Content
      } else {
        res.set('Content-Length', streamResult.totalLength?.toString() || '0');
        res.status(200);
      }

      // Pipe el stream al response
      streamResult.stream.pipe(res);

      streamResult.stream.on('error', (error: any) => {
        console.error('❌ Error en el stream de video:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error en el stream de video' });
        }
      });

    } catch (error: any) {
      console.error('❌ Error en getVideoStream:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Error interno del servidor',
          details: error.message 
        });
      }
    }
  }

  /**
   * Obtiene metadatos del video usando contentFileId
   */
  async getVideoMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { contentFileId } = req.params;
      const userId = (req as any).user?.id;

      if (!contentFileId) {
        res.status(400).json({ error: 'Content File ID es requerido' });
        return;
      }

      console.log(`📋 Obteniendo metadatos de video por ContentFile: ${contentFileId}`);

      // Verificar acceso del usuario al archivo
      const accessCheck = await contentFileService.verifyUserAccess(contentFileId, userId);
      if (!accessCheck.hasAccess) {
        res.status(403).json({ 
          error: 'Acceso denegado',
          reason: accessCheck.reason 
        });
        return;
      }

      // Obtener metadatos del video
      const metadata = await contentFileService.getVideoMetadataByContentFileId(contentFileId);
      
      if (!metadata) {
        res.status(404).json({ error: 'Video no encontrado' });
        return;
      }

      res.json({
        success: true,
        data: {
          contentFileId: metadata.contentFileId,
          id: metadata.id,
          name: metadata.name,
          fileName: metadata.fileName,
          mimeType: metadata.mimeType,
          size: metadata.size,
          fileSize: metadata.fileSize,
          duration: metadata.duration,
          isPublic: metadata.isPublic,
          allowDownload: metadata.allowDownload,
          // URLs seguras usando contentFileId
          proxyUrl: `/api/video/secure/stream/${contentFileId}`,
          hybridUrl: `/api/video/secure/hybrid/${contentFileId}`,
          cacheUrl: `/api/video/secure/cache/${contentFileId}`
        }
      });

    } catch (error: any) {
      console.error('❌ Error en getVideoMetadata:', error);
      res.status(500).json({ 
        error: 'Error al obtener metadatos del video',
        details: error.message 
      });
    }
  }

  /**
   * Verifica acceso del usuario al archivo de video
   */
  async verifyVideoAccess(req: Request, res: Response): Promise<void> {
    try {
      const { contentFileId } = req.params;
      const userId = (req as any).user?.id;

      if (!contentFileId) {
        res.status(400).json({ error: 'Content File ID es requerido' });
        return;
      }

      console.log(`🔐 Verificando acceso de usuario a ContentFile: ${contentFileId}`);

      const accessCheck = await contentFileService.verifyUserAccess(contentFileId, userId);
      
      res.json({
        success: true,
        hasAccess: accessCheck.hasAccess,
        reason: accessCheck.reason,
        contentFileInfo: accessCheck.contentFileInfo,
        proxyUrl: accessCheck.hasAccess ? `/api/video/secure/stream/${contentFileId}` : null
      });

    } catch (error: any) {
      console.error('❌ Error en verifyVideoAccess:', error);
      res.status(500).json({ 
        error: 'Error al verificar acceso al video',
        details: error.message 
      });
    }
  }

  /**
   * Obtiene todos los videos de un contenido específico
   */
  async getContentVideos(req: Request, res: Response): Promise<void> {
    try {
      const { contentId } = req.params;
      const userId = (req as any).user?.id;

      if (!contentId) {
        res.status(400).json({ error: 'Content ID es requerido' });
        return;
      }

      console.log(`📹 Obteniendo videos del contenido: ${contentId}`);

      const videoFiles = await contentFileService.getVideoFilesByContentId(contentId);
      
      // Filtrar videos según acceso del usuario
      const accessibleVideos = [];
      for (const video of videoFiles) {
        const accessCheck = await contentFileService.verifyUserAccess(video.id, userId);
        if (accessCheck.hasAccess) {
          accessibleVideos.push({
            ...video,
            proxyUrl: `/api/video/secure/stream/${video.id}`,
            hybridUrl: `/api/video/secure/hybrid/${video.id}`,
            accessReason: accessCheck.reason
          });
        }
      }

      res.json({
        success: true,
        contentId,
        totalVideos: videoFiles.length,
        accessibleVideos: accessibleVideos.length,
        videos: accessibleVideos
      });

    } catch (error: any) {
      console.error('❌ Error en getContentVideos:', error);
      res.status(500).json({ 
        error: 'Error al obtener videos del contenido',
        details: error.message 
      });
    }
  }
}

export const secureVideoController = new SecureVideoController();
