import { Request, Response } from 'express';
import { videoProxyService } from '../services/videoProxyService';
import ContentFiles from '../../course/models/ContentFiles';

/**
 * Controlador para el proxy de videos de Google Drive
 */
export class VideoProxyController {
  
  /**
   * Obtiene el stream de video a través del proxy
   */
  async getVideoStream(req: Request, res: Response): Promise<void> {
    try {
      const { contentFileId } = req.params;
      const { range } = req.headers;

      if (!contentFileId) {
        res.status(400).json({ error: 'ContentFile ID es requerido' });
        return;
      }

      console.log(`🎥 Solicitando stream de video: ${contentFileId}`);
      console.log(`📊 Headers recibidos:`, {
        range: range,
        userAgent: req.headers['user-agent'],
        origin: req.headers.origin
      });

      // Obtener el ContentFile y su driveFileId correspondiente
      const contentFile = await ContentFiles.findByPk(contentFileId, {
        attributes: ['id', 'driveFileId']
      });

      if (!contentFile) {
        res.status(404).json({ error: 'Archivo no encontrado' });
        return;
      }

      const fileId = contentFile.driveFileId;

      // Obtener metadatos del video (una sola vez)
      const metadata = await videoProxyService.getVideoMetadata(fileId);
      if (!metadata) {
        res.status(404).json({ error: 'Video no encontrado o no válido' });
        return;
      }

      const totalSize = parseInt(metadata.size || '0');
      if (totalSize === 0) {
        res.status(400).json({ error: 'No se pudo determinar el tamaño del video' });
        return;
      }

      // Obtener el stream del video desde Google Drive (sin consultar metadatos de nuevo)
      const streamResult = await videoProxyService.getVideoStream(
        fileId, 
        totalSize, 
        metadata.mimeType, 
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
        'Cross-Origin-Embedder-Policy': 'unsafe-none'
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
   * Obtiene metadatos del video sin exponer la URL de Drive
   */
  async getVideoMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { contentFileId } = req.params;

      if (!contentFileId) {
        res.status(400).json({ error: 'File ID es requerido' });
        return;
      }

      const contentFile = await ContentFiles.findByPk(contentFileId, {
        attributes: ['id', 'driveFileId']
      });

      if (!contentFile) {
        res.status(404).json({ error: 'Archivo no encontrado' });
        return;
      }

      const metadata = await videoProxyService.getVideoMetadata(contentFile?.driveFileId);
      
      if (!metadata) {
        res.status(404).json({ error: 'Video no encontrado' });
        return;
      }

      res.json({
        success: true,
        data: {
          id: metadata.id,
          name: metadata.name,
          mimeType: metadata.mimeType,
          size: metadata.size,
          duration: metadata.duration,
          // NO incluir enlaces directos de Drive
          proxyUrl: `/api/video/stream/${contentFileId}` // URL del proxy
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
}

export const videoProxyController = new VideoProxyController();
