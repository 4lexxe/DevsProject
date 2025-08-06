import { Request, Response } from 'express';
import fs from 'fs';
import { videoProxyService } from '../services/videoProxyService';
import { videoCacheService } from '../services/videoCacheService';

/**
 * Controlador para video con cache completo
 */
export class VideoCacheController {
  
  /**
   * Obtiene video desde cache local (descarga completa si es necesario)
   */
  async getVideoFromCache(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const { range } = req.headers;

      if (!fileId) {
        res.status(400).json({ error: 'File ID es requerido' });
        return;
      }

      console.log(`🎥 Solicitando video desde cache: ${fileId}`);

      // Obtener metadatos del video
      const metadata = await videoProxyService.getVideoMetadata(fileId);
      if (!metadata) {
        res.status(404).json({ error: 'Video no encontrado' });
        return;
      }

      const totalSize = parseInt(metadata.size || '0');
      
      // Intentar obtener desde cache (o descargar si no existe)
      const cacheResult = await videoCacheService.getCachedVideo(
        fileId, 
        metadata.mimeType, 
        totalSize
      );

      if (!cacheResult.success) {
        if (cacheResult.isDownloading) {
          res.status(202).json({ 
            message: 'Video siendo descargado, intenta nuevamente en unos momentos',
            isDownloading: true 
          });
          return;
        } else {
          res.status(500).json({ error: cacheResult.error });
          return;
        }
      }

      if (!cacheResult.filePath) {
        res.status(500).json({ error: 'No se pudo obtener la ruta del archivo' });
        return;
      }

      // Servir archivo desde cache local con soporte para Range
      await this.serveVideoFromLocalFile(res, cacheResult.filePath, metadata.mimeType, range as string);

    } catch (error: any) {
      console.error('❌ Error en getVideoFromCache:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error.message 
      });
    }
  }

  /**
   * Sirve video desde archivo local con soporte para Range requests
   */
  private async serveVideoFromLocalFile(
    res: Response, 
    filePath: string, 
    mimeType: string, 
    rangeHeader?: string
  ): Promise<void> {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    if (rangeHeader) {
      // Procesar Range request
      const range = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(range[0], 10) || 0;
      const end = parseInt(range[1], 10) || fileSize - 1;
      const chunkSize = end - start + 1;

      // Headers para partial content
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
        // CORS headers
        'Access-Control-Allow-Origin': process.env.CLIENT_URL || 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      });

      // Stream del chunk específico
      const fileStream = fs.createReadStream(filePath, { start, end });
      fileStream.pipe(res);

      console.log(`📤 Sirviendo chunk ${start}-${end} de ${fileSize} bytes desde cache`);

    } else {
      // Servir archivo completo
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        // CORS headers
        'Access-Control-Allow-Origin': process.env.CLIENT_URL || 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      });

      // Stream del archivo completo
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      console.log(`📤 Sirviendo archivo completo desde cache: ${fileSize} bytes`);
    }
  }

  /**
   * Pre-carga un video al cache (útil para pre-loading)
   */
  async preloadVideoToCache(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        res.status(400).json({ error: 'File ID es requerido' });
        return;
      }

      // Obtener metadatos
      const metadata = await videoProxyService.getVideoMetadata(fileId);
      if (!metadata) {
        res.status(404).json({ error: 'Video no encontrado' });
        return;
      }

      const totalSize = parseInt(metadata.size || '0');

      // Iniciar descarga sin esperar (asíncrono)
      videoCacheService.downloadVideoToCache(fileId, metadata.mimeType, totalSize)
        .then((result) => {
          if (result.success) {
            console.log(`✅ Pre-carga completada: ${fileId}`);
          } else {
            console.error(`❌ Error en pre-carga: ${fileId}`, result.error);
          }
        });

      res.json({
        success: true,
        message: 'Pre-carga iniciada',
        fileId,
        size: totalSize
      });

    } catch (error: any) {
      console.error('❌ Error en preloadVideoToCache:', error);
      res.status(500).json({ 
        error: 'Error al iniciar pre-carga',
        details: error.message 
      });
    }
  }

  /**
   * Obtiene información del cache
   */
  async getCacheInfo(req: Request, res: Response): Promise<void> {
    try {
      const cacheInfo = await videoCacheService.getCacheInfo();
      
      res.json({
        success: true,
        cache: {
          totalFiles: cacheInfo.totalFiles,
          totalSizeMB: (cacheInfo.totalSize / 1024 / 1024).toFixed(2),
          totalSizeBytes: cacheInfo.totalSize,
          files: cacheInfo.files
        }
      });
    } catch (error: any) {
      console.error('❌ Error en getCacheInfo:', error);
      res.status(500).json({ 
        error: 'Error al obtener información del cache',
        details: error.message 
      });
    }
  }

  /**
   * Limpia el cache completo
   */
  async clearCache(req: Request, res: Response): Promise<void> {
    try {
      const success = await videoCacheService.clearAllCache();
      
      if (success) {
        res.json({
          success: true,
          message: 'Cache limpiado exitosamente'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error al limpiar cache'
        });
      }
    } catch (error: any) {
      console.error('❌ Error en clearCache:', error);
      res.status(500).json({ 
        error: 'Error al limpiar cache',
        details: error.message 
      });
    }
  }
}

export const videoCacheController = new VideoCacheController();
