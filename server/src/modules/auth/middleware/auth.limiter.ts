import rateLimit from 'express-rate-limit';
import { GeoUtils } from '../utils/geo.utils';

// Limitador estricto para rutas de autenticación (login/register)
// Previene ataques de fuerza bruta y enumeración
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Usar la utilidad GeoUtils para obtener la IP real (maneja proxies)
    const ip = GeoUtils.getValidIP(req);
    return ip || '127.0.0.1';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiados intentos de autenticación. Por favor, intente nuevamente en 15 minutos.',
      timestamp: new Date().toISOString()
    });
  },
  skipSuccessfulRequests: false // Contar también los intentos exitosos para evitar spam de login/logout
});
