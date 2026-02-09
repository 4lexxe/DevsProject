import { Request, Response } from 'express';
import { hybridVideoService } from '../services/hybridVideoService';
import { secureVideoController } from './secureVideoController';
import { videoCacheController } from './videoCacheController';
import { contentFileService } from '../services/contentFileService';

/**
 * Controlador híbrido que decide automáticamente entre cache y streaming
 * Ahora usa contentFileId para mayor seguridad
 */

/**
 * Endpoint principal que decide automáticamente la mejor estrategia
 */
export const getVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentFileId } = req.params;
    const userCount = parseInt(req.query.userCount as string) || 0;

    if (!contentFileId) {
      res.status(400).json({ error: 'ContentFile ID es requerido' });
      return;
    }

    // Obtener ContentFile
    const contentFile = await contentFileService.getContentFileById(contentFileId);
    if (!contentFile) {
      res.status(404).json({ error: 'Archivo no encontrado' });
      return;
    }

    const fileId = contentFile.driveFileId;

    // Obtener metadatos del video para conocer el tamaño
    const metadata = await contentFileService.getVideoMetadataByContentFileId(contentFileId);
    if (!metadata) {
      res.status(404).json({ error: 'Video no encontrado' });
      return;
    }

    const videoSize = parseInt(metadata.size || '0');
    
    // Determinar estrategia óptima
    const strategy = await hybridVideoService.determineStrategy(fileId, videoSize, userCount);
    
    console.log(` Estrategia seleccionada: ${strategy.useCache ? 'CACHE COMPLETO' : 'STREAMING DIRECTO'}`);
    console.log(` Razón: ${strategy.reason}`);
    
    if (strategy.cacheInfo) {
      console.log(` Estado del cache: ${(strategy.cacheInfo.utilization).toFixed(1)}% utilizado (${(strategy.cacheInfo.currentSize / 1024 / 1024).toFixed(2)} MB / ${(strategy.cacheInfo.maxSize / 1024 / 1024).toFixed(2)} MB)`);
    }

    // Agregar headers informativos
    res.set({
      'X-Video-Strategy': strategy.useCache ? 'cache' : 'streaming',
      'X-Strategy-Reason': strategy.reason,
      'X-Video-Size': videoSize.toString(),
      'X-Cache-Utilization': strategy.cacheInfo ? `${strategy.cacheInfo.utilization.toFixed(1)}%` : 'unknown'
    });

    // Delegar al controlador apropiado
    if (strategy.useCache) {
      // Crear una nueva request con fileId para el cache controller
      req.params.fileId = fileId;
      await videoCacheController.getVideoFromCache(req, res);
    } else {
      await secureVideoController.getVideoStream(req, res);
    }

  } catch (error: any) {
    console.error(' Error en controlador híbrido:', error);
    
    // Fallback a streaming directo en caso de error
    console.log(' Fallback a streaming directo...');
    try {
      await secureVideoController.getVideoStream(req, res);
    } catch (fallbackError: any) {
      console.error(' Error en fallback:', fallbackError);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Error interno del servidor',
          details: error.message 
        });
      }
    }
  }
};

/**
 * Fuerza el uso de cache para un video específico
 */
export const forceCache = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentFileId } = req.params;

    const contentFile = await contentFileService.getContentFileById(contentFileId);
    if (!contentFile) {
      res.status(404).json({ error: 'Archivo no encontrado' });
      return;
    }

    console.log(' Forzando uso de cache...');
    // Agregar fileId a los params para el cache controller
    req.params.fileId = contentFile.driveFileId;
    await videoCacheController.getVideoFromCache(req, res);
  } catch (error: any) {
    console.error(' Error forzando cache:', error);
    res.status(500).json({ error: 'Error forzando cache', details: error.message });
  }
};

/**
 * Fuerza el uso de streaming directo para un video específico  
 */
export const forceStreaming = async (req: Request, res: Response): Promise<void> => {
  console.log(' Forzando streaming directo...');
  await secureVideoController.getVideoStream(req, res);
};

/**
 * Obtiene estadísticas detalladas del sistema híbrido
 */
export const getHybridStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await hybridVideoService.getHybridStats();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        ...stats,
        cache: {
          ...stats.cache,
          currentSizeMB: (stats.cache.currentSize / 1024 / 1024).toFixed(2),
          maxSizeMB: (stats.cache.maxSize / 1024 / 1024).toFixed(2),
          availableSpaceMB: ((stats.cache.maxSize - stats.cache.currentSize) / 1024 / 1024).toFixed(2),
          utilizationPercentage: `${stats.cache.utilization.toFixed(1)}%`
        }
      }
    });

  } catch (error: any) {
    console.error(' Error obteniendo estadísticas híbridas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      details: error.message 
    });
  }
};

/**
 * Actualiza configuración del sistema híbrido
 */
export const updateConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { maxCacheSizeGB, maxVideoSizeMB, preloadPopularVideos, cleanupThreshold } = req.body;

    const config: any = {};

    if (maxCacheSizeGB !== undefined) {
      config.maxCacheSize = maxCacheSizeGB * 1024 * 1024 * 1024; // Convertir GB a bytes
    }

    if (maxVideoSizeMB !== undefined) {
      config.maxVideoSizeForCache = maxVideoSizeMB * 1024 * 1024; // Convertir MB a bytes
    }

    if (preloadPopularVideos !== undefined) {
      config.preloadPopularVideos = preloadPopularVideos;
    }

    if (cleanupThreshold !== undefined) {
      config.cleanupThreshold = cleanupThreshold;
    }

    hybridVideoService.updateConfig(config);

    res.json({
      success: true,
      message: 'Configuración actualizada',
      newConfig: config
    });

  } catch (error: any) {
    console.error(' Error actualizando configuración:', error);
    res.status(500).json({ 
      error: 'Error al actualizar configuración',
      details: error.message 
    });
  }
};

/**
 * Endpoint para analizar estrategia sin ejecutarla
 */
export const analyzeStrategy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentFileId } = req.params;
    const userCount = parseInt(req.query.userCount as string) || 0;

    if (!contentFileId) {
      res.status(400).json({ error: 'ContentFile ID es requerido' });
      return;
    }

    const contentFile = await contentFileService.getContentFileById(contentFileId);
    if (!contentFile) {
      res.status(404).json({ error: 'Archivo no encontrado' });
      return;
    }

    // Obtener metadatos
    const metadata = await contentFileService.getVideoMetadataByContentFileId(contentFileId);
    if (!metadata) {
      res.status(404).json({ error: 'Video no encontrado' });
      return;
    }

    const videoSize = parseInt(metadata.size || '0');
    
    // Analizar estrategia sin ejecutar
    const strategy = await hybridVideoService.determineStrategy(contentFile.driveFileId, videoSize, userCount);

    res.json({
      success: true,
      contentFileId,
      video: {
        name: metadata.name,
        mimeType: metadata.mimeType,
        sizeMB: (videoSize / 1024 / 1024).toFixed(2),
        sizeBytes: videoSize
      },
      strategy: {
        recommended: strategy.useCache ? 'cache' : 'streaming',
        reason: strategy.reason,
        cacheInfo: strategy.cacheInfo ? {
          currentSizeMB: (strategy.cacheInfo.currentSize / 1024 / 1024).toFixed(2),
          maxSizeMB: (strategy.cacheInfo.maxSize / 1024 / 1024).toFixed(2),
          availableSpaceMB: (strategy.cacheInfo.availableSpace / 1024 / 1024).toFixed(2),
          utilization: `${strategy.cacheInfo.utilization.toFixed(1)}%`
        } : null
      },
      endpoints: {
        hybrid: `/api/video/hybrid/${contentFileId}`,
        forceCache: `/api/video/cache/${contentFileId}`,
        forceStreaming: `/api/video/stream/${contentFileId}`
      }
    });

  } catch (error: any) {
    console.error(' Error analizando estrategia:', error);
    res.status(500).json({ 
      error: 'Error al analizar estrategia',
      details: error.message 
    });
  }
};

/**
 * Pre-carga videos populares de forma inteligente
 */
export const preloadPopularVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videos } = req.body; // Array de { contentFileId, userCount }

    if (!Array.isArray(videos)) {
      res.status(400).json({ error: 'Se requiere un array de videos' });
      return;
    }

    console.log(` Iniciando pre-carga de ${videos.length} videos...`);

    // Convertir contentFileIds a fileIds para el servicio híbrido
    const videosWithFileIds = [];
    for (const video of videos) {
      const contentFile = await contentFileService.getContentFileById(video.contentFileId);
      if (contentFile) {
        const metadata = await contentFileService.getVideoMetadataByContentFileId(video.contentFileId);
        videosWithFileIds.push({
          fileId: contentFile.driveFileId,
          size: parseInt(metadata?.size || '0'),
          userCount: video.userCount
        });
      }
    }

    // Iniciar pre-carga de forma asíncrona
    hybridVideoService.preloadPopularVideos(videosWithFileIds)
      .then(() => console.log(' Pre-carga de videos populares completada'))
      .catch(error => console.error(' Error en pre-carga:', error));

    res.json({
      success: true,
      message: `Pre-carga iniciada para ${videosWithFileIds.length} videos`,
      videos: videosWithFileIds.map(v => ({
        fileId: v.fileId,
        sizeMB: (v.size / 1024 / 1024).toFixed(2)
      }))
    });

  } catch (error: any) {
    console.error(' Error en pre-carga de videos:', error);
    res.status(500).json({ 
      error: 'Error al iniciar pre-carga',
      details: error.message 
    });
  }
};
