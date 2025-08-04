import { Router } from 'express';
import * as hybridVideoController from '../controllers/hybridVideoController';
import { videoCacheController } from '../controllers/videoCacheController';
import { secureVideoController } from '../controllers/secureVideoController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * RUTAS DEL SISTEMA HÍBRIDO DE VIDEO (SEGURO)
 * 
 * El sistema decide automáticamente entre cache completo y streaming directo
 * basado en el espacio disponible, tamaño del video y popularidad.
 * 
 * IMPORTANTE: Ahora usa contentFileId para mayor seguridad en lugar de exponer driveFileId
 */

// ========================================
// RUTAS PRINCIPALES (HÍBRIDAS)
// ========================================

/**
 * GET /api/video/hybrid/:contentFileId
 * Endpoint principal que decide automáticamente la mejor estrategia
 * Query params opcionales:
 * - userCount: número de usuarios viendo el video (ayuda en la decisión)
 */
router.get('/hybrid/:contentFileId', hybridVideoController.getVideo);

/**
 * GET /api/video/analyze/:contentFileId
 * Analiza qué estrategia se usaría sin ejecutarla
 * Útil para debugging y monitoreo
 */
router.get('/analyze/:contentFileId', hybridVideoController.analyzeStrategy);

// ========================================
// RUTAS DE CONTROL MANUAL
// ========================================

/**
 * GET /api/video/cache/:contentFileId
 * Fuerza el uso de cache completo
 */
router.get('/cache/:contentFileId', hybridVideoController.forceCache);

/**
 * GET /api/video/stream/:contentFileId  
 * Fuerza el uso de streaming directo (método seguro)
 */
router.get('/stream/:contentFileId', hybridVideoController.forceStreaming);

// ========================================
// RUTAS DE GESTIÓN DE CACHE
// ========================================

/**
 * POST /api/video/preload-popular
 * Pre-carga múltiples videos populares de forma inteligente
 * Body: { videos: [{ contentFileId, userCount }, ...] }
 */
router.post('/preload-popular', hybridVideoController.preloadPopularVideos);

/**
 * GET /api/video/cache-info
 * Obtiene información detallada del cache
 */
router.get('/cache-info', videoCacheController.getCacheInfo);

/**
 * DELETE /api/video/cache
 * Limpia todo el cache
 */
router.delete('/cache', videoCacheController.clearCache);

// ========================================
// RUTAS DE CONFIGURACIÓN Y ESTADÍSTICAS
// ========================================

/**
 * GET /api/video/hybrid-stats
 * Obtiene estadísticas detalladas del sistema híbrido
 */
router.get('/hybrid-stats', hybridVideoController.getHybridStats);

/**
 * PUT /api/video/hybrid-config
 * Actualiza configuración del sistema híbrido
 * Body: {
 *   maxCacheSizeGB?: number,
 *   maxVideoSizeMB?: number,
 *   preloadPopularVideos?: boolean,
 *   cleanupThreshold?: number
 * }
 */
router.put('/hybrid-config', hybridVideoController.updateConfig);

// ========================================
// RUTAS DE METADATOS (SEGURAS)
// ========================================

/**
 * GET /api/video/metadata/:contentFileId
 * Obtiene metadatos del video sin exponer URLs de Drive
 */
router.get('/metadata/:contentFileId', secureVideoController.getVideoMetadata);

/**
 * GET /api/video/test
 * Endpoint de prueba de conectividad
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor de video híbrido seguro funcionando correctamente',
    timestamp: new Date().toISOString(),
    endpoints: {
      main: '/api/video/hybrid/:contentFileId',
      analyze: '/api/video/analyze/:contentFileId',
      cache: '/api/video/cache/:contentFileId',
      stream: '/api/video/stream/:contentFileId',
      stats: '/api/video/hybrid-stats'
    },
    security: {
      authentication: 'required',
      accessControl: 'contentFile-based',
      idType: 'UUID'
    }
  });
});

export default router;
