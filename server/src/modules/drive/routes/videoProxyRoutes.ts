import { Router } from 'express';
import { videoProxyController } from '../controllers/videoProxyController';

const router = Router();

// Middleware CORS específico para rutas de video
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

/**
 * Rutas para el proxy de videos de Google Drive
 * Base: /api/video
 */

/**
 * GET /api/video/test
 * Endpoint de prueba para verificar que las rutas funcionan
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Proxy de video funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/video/stream/:contentFileId
 * Obtiene el stream de video a través del proxy (oculta URL de Drive)
 */
router.get('/stream/:contentFileId', async (req, res) => {
  await videoProxyController.getVideoStream(req, res);
});

/**
 * GET /api/video/metadata/:fileId
 * Obtiene metadatos del video sin exponer URLs de Drive
 */
router.get('/metadata/:contentFileId', async (req, res) => {
  await videoProxyController.getVideoMetadata(req, res);
});

export default router;
