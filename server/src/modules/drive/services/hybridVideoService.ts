import { videoProxyService } from './videoProxyService';
import { videoCacheService } from './videoCacheService';

export interface HybridVideoConfig {
  maxCacheSize: number; // Tamaño máximo del cache en bytes (8GB por defecto)
  maxVideoSizeForCache: number; // Tamaño máximo de video individual para cache (500MB por defecto)
  preloadPopularVideos: boolean; // Si pre-cargar videos populares
  cleanupThreshold: number; // Umbral para limpiar cache (90% del máximo)
}

export interface VideoStrategy {
  useCache: boolean;
  reason: string;
  cacheInfo?: {
    currentSize: number;
    maxSize: number;
    availableSpace: number;
    utilization: number;
  };
}

/**
 * Servicio híbrido que decide entre cache completo y streaming directo
 */
export class HybridVideoService {
  private config: HybridVideoConfig;
  
  constructor(config?: Partial<HybridVideoConfig>) {
    // Leer configuraciones desde variables de entorno
    const maxCacheSizeMB = parseInt(process.env.VIDEO_CACHE_MAX_SIZE_MB || '2048');
    const maxVideoSizeMB = parseInt(process.env.VIDEO_CACHE_MAX_FILE_SIZE_MB || '500');
    
    this.config = {
      maxCacheSize: maxCacheSizeMB * 1024 * 1024, // Convertir MB a bytes
      maxVideoSizeForCache: maxVideoSizeMB * 1024 * 1024, // Convertir MB a bytes
      preloadPopularVideos: process.env.VIDEO_CACHE_PRELOAD_POPULAR === 'true',
      cleanupThreshold: parseFloat(process.env.VIDEO_CACHE_CLEANUP_THRESHOLD || '0.9'), // 90%
      ...config
    };

    console.log(`⚙️ Configuración de Video Cache:`);
    console.log(`   - Cache máximo: ${maxCacheSizeMB} MB (${(this.config.maxCacheSize / 1024 / 1024).toFixed(1)} MB)`);
    console.log(`   - Archivo máximo: ${maxVideoSizeMB} MB (${(this.config.maxVideoSizeForCache / 1024 / 1024).toFixed(1)} MB)`);
    console.log(`   - Pre-carga activa: ${this.config.preloadPopularVideos}`);
    console.log(`   - Umbral de limpieza: ${(this.config.cleanupThreshold * 100).toFixed(1)}%`);
  }

  /**
   * Decide qué estrategia usar para un video específico
   */
  async determineStrategy(fileId: string, videoSize: number, userCount?: number): Promise<VideoStrategy> {
    try {
      const cacheInfo = await videoCacheService.getCacheInfo();
      const currentCacheSize = cacheInfo.totalSize;
      const availableSpace = this.config.maxCacheSize - currentCacheSize;
      const utilization = (currentCacheSize / this.config.maxCacheSize) * 100;

      console.log(`📊 Análisis de estrategia para video ${fileId}:`);
      console.log(`   - Tamaño del video: ${(videoSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   - Cache actual: ${(currentCacheSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   - Espacio disponible: ${(availableSpace / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   - Utilización: ${utilization.toFixed(1)}%`);

      // Criterios para decidir estrategia
      const videoTooLarge = videoSize > this.config.maxVideoSizeForCache;
      const notEnoughSpace = availableSpace < videoSize;
      const cacheAlmostFull = utilization >= (this.config.cleanupThreshold * 100);
      const videoAlreadyCached = await videoCacheService.isVideoCached(fileId, 'video/mp4'); // Simplificado para el ejemplo

      // Decision tree
      if (videoAlreadyCached) {
        return {
          useCache: true,
          reason: 'Video ya está en cache',
          cacheInfo: {
            currentSize: currentCacheSize,
            maxSize: this.config.maxCacheSize,
            availableSpace,
            utilization
          }
        };
      }

      if (videoTooLarge) {
        return {
          useCache: false,
          reason: `Video muy grande (${(videoSize / 1024 / 1024).toFixed(2)} MB > ${(this.config.maxVideoSizeForCache / 1024 / 1024).toFixed(2)} MB)`,
          cacheInfo: {
            currentSize: currentCacheSize,
            maxSize: this.config.maxCacheSize,
            availableSpace,
            utilization
          }
        };
      }

      if (notEnoughSpace) {
        if (cacheAlmostFull) {
          // Intentar limpiar cache si está casi lleno
          await this.cleanupCache();
          
          // Re-evaluar después de limpiar
          const newCacheInfo = await videoCacheService.getCacheInfo();
          const newAvailableSpace = this.config.maxCacheSize - newCacheInfo.totalSize;
          
          if (newAvailableSpace >= videoSize) {
            return {
              useCache: true,
              reason: 'Espacio liberado después de limpieza',
              cacheInfo: {
                currentSize: newCacheInfo.totalSize,
                maxSize: this.config.maxCacheSize,
                availableSpace: newAvailableSpace,
                utilization: (newCacheInfo.totalSize / this.config.maxCacheSize) * 100
              }
            };
          }
        }

        return {
          useCache: false,
          reason: `Sin espacio suficiente (necesario: ${(videoSize / 1024 / 1024).toFixed(2)} MB, disponible: ${(availableSpace / 1024 / 1024).toFixed(2)} MB)`,
          cacheInfo: {
            currentSize: currentCacheSize,
            maxSize: this.config.maxCacheSize,
            availableSpace,
            utilization
          }
        };
      }

      // Si hay espacio y el video no es muy grande, usar cache
      const priority = this.calculateCachePriority(videoSize, userCount);
      
      return {
        useCache: priority > 0.5, // Umbral de prioridad
        reason: priority > 0.5 
          ? `Video apto para cache (prioridad: ${(priority * 100).toFixed(1)}%)`
          : `Prioridad baja para cache (${(priority * 100).toFixed(1)}%), usar streaming`,
        cacheInfo: {
          currentSize: currentCacheSize,
          maxSize: this.config.maxCacheSize,
          availableSpace,
          utilization
        }
      };

    } catch (error: any) {
      console.error('❌ Error al determinar estrategia:', error);
      return {
        useCache: false,
        reason: `Error en análisis: ${error.message}`,
      };
    }
  }

  /**
   * Calcula prioridad de cache basada en varios factores
   */
  private calculateCachePriority(videoSize: number, userCount: number = 0): number {
    let priority = 0.5; // Base score

    // Factor de tamaño (videos más pequeños tienen mayor prioridad)
    const sizeFactor = Math.max(0, 1 - (videoSize / this.config.maxVideoSizeForCache));
    priority += sizeFactor * 0.3;

    // Factor de popularidad (más usuarios = mayor prioridad)
    if (userCount > 0) {
      const popularityFactor = Math.min(1, userCount / 50); // Normalizar a máximo 50 usuarios
      priority += popularityFactor * 0.4;
    }

    // Factor de espacio disponible
    return Math.min(1, Math.max(0, priority));
  }

  /**
   * Limpia archivos del cache usando estrategia LRU (Least Recently Used)
   */
  private async cleanupCache(): Promise<void> {
    try {
      console.log('🧹 Iniciando limpieza inteligente del cache...');
      
      const cacheInfo = await videoCacheService.getCacheInfo();
      const currentSize = cacheInfo.totalSize;
      const targetSize = this.config.maxCacheSize * 0.7; // Liberar hasta 70% del máximo
      const bytesToFree = currentSize - targetSize;

      if (bytesToFree <= 0) {
        console.log('✅ Cache no necesita limpieza');
        return;
      }

      console.log(`🎯 Objetivo: liberar ${(bytesToFree / 1024 / 1024).toFixed(2)} MB`);

      // TODO: Implementar lógica LRU real
      // Por ahora, limpiar todo el cache como fallback
      console.log('⚠️ Implementando limpieza simple - eliminar todo el cache');
      await videoCacheService.clearAllCache();
      
      console.log('✅ Cache limpiado completamente');

    } catch (error: any) {
      console.error('❌ Error en limpieza de cache:', error);
    }
  }

  /**
   * Obtiene estadísticas detalladas del sistema híbrido
   */
  async getHybridStats(): Promise<{
    config: HybridVideoConfig;
    cache: {
      currentSize: number;
      maxSize: number;
      utilization: number;
      filesCount: number;
    };
    recommendations: string[];
  }> {
    const cacheInfo = await videoCacheService.getCacheInfo();
    const utilization = (cacheInfo.totalSize / this.config.maxCacheSize) * 100;

    const recommendations: string[] = [];

    if (utilization > 90) {
      recommendations.push('Cache casi lleno - considerar limpiar archivos antiguos');
    }

    if (utilization < 30) {
      recommendations.push('Cache poco utilizado - considerar pre-cargar videos populares');
    }

    if (cacheInfo.totalFiles > 100) {
      recommendations.push('Muchos archivos en cache - implementar sistema LRU');
    }

    return {
      config: this.config,
      cache: {
        currentSize: cacheInfo.totalSize,
        maxSize: this.config.maxCacheSize,
        utilization,
        filesCount: cacheInfo.totalFiles
      },
      recommendations
    };
  }

  /**
   * Actualiza configuración del sistema híbrido
   */
  updateConfig(newConfig: Partial<HybridVideoConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Configuración híbrida actualizada:', this.config);
  }

  /**
   * Pre-carga videos basado en popularidad y espacio disponible
   */
  async preloadPopularVideos(videoList: Array<{ fileId: string; size: number; userCount: number }>): Promise<void> {
    if (!this.config.preloadPopularVideos) {
      return;
    }

    // Ordenar por prioridad
    const prioritizedVideos = videoList
      .map(video => ({
        ...video,
        priority: this.calculateCachePriority(video.size, video.userCount)
      }))
      .sort((a, b) => b.priority - a.priority);

    for (const video of prioritizedVideos) {
      const strategy = await this.determineStrategy(video.fileId, video.size, video.userCount);
      
      if (strategy.useCache) {
        console.log(`📥 Pre-cargando video ${video.fileId} (prioridad: ${(video.priority * 100).toFixed(1)}%)`);
        
        // Pre-cargar de forma asíncrona sin bloquear
        const metadata = await videoProxyService.getVideoMetadata(video.fileId);
        if (metadata) {
          videoCacheService.downloadVideoToCache(video.fileId, metadata.mimeType, video.size)
            .catch(error => console.error(`❌ Error pre-cargando ${video.fileId}:`, error));
        }
      } else {
        console.log(`⏩ Saltando video ${video.fileId}: ${strategy.reason}`);
      }
    }
  }
}

export const hybridVideoService = new HybridVideoService();
