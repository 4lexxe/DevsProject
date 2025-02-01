import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import './infrastructure/passport/passport';
import authRoutes from './modules/auth/routes/auth.routes';
import userRoutes from './modules/user/userRoutes';
import adminRoutes from './modules/admin/adminRoutes';
import roleRoutes from './modules/role/roleRoutes';
import { GeoUtils } from './modules/auth/utils/geo.utils';
import courseRoutes from './modules/course/courseRoutes';
import sectionRoutes from './modules/section/sectionRoutes';
import contentRoutes from './modules/content/contentRoutes';
import HeaderSectionRoutes from './modules/headerSection/headerSectionRoutes';

import geoip from 'geoip-lite';
import { Request } from 'express';

// Extender tipos para geoip-lite
declare module 'geoip-lite' {
  interface Lookup {
    proxy?: boolean;
    timezone: string;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración inicial de seguridad y middleware
app.set('trust proxy', true);
app.use(helmet()); // Seguridad de cabeceras HTTP
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Forwarded-For']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para detectar velocidad de solicitudes
interface RequestTimes {
  [key: string]: number[];
}

declare global {
  var requestTimes: RequestTimes;
}

interface TooManyRequestsResponse {
  error: string;
  ip: string;
  timestamp: string;
}

const requestSpeedLimiter = (
  req: express.Request,
  res: express.Response<TooManyRequestsResponse>,
  next: express.NextFunction
): void | express.Response<TooManyRequestsResponse> => {
  const ip: string = GeoUtils.getValidIP(req) || '127.0.0.1';
  const now: number = Date.now();

  if (!global.requestTimes) {
    global.requestTimes = {};
  }

  if (!global.requestTimes[ip]) {
    global.requestTimes[ip] = [];
  }

  // Registrar la hora de la solicitud actual
  global.requestTimes[ip].push(now);

  // Mantener solo las solicitudes dentro de la ventana de tiempo (por ejemplo, 1 minuto)
  global.requestTimes[ip] = global.requestTimes[ip].filter(time => now - time < 60 * 1000);

  // Verificar la velocidad de las solicitudes (por ejemplo, más de 10 solicitudes en 1 segundo)
  const recentRequests: number[] = global.requestTimes[ip].filter(time => now - time < 1000);
  if (recentRequests.length > 10) {
    return res.status(429).json({
      error: 'Too many requests',
      ip,
      timestamp: new Date().toISOString()
    });
  }
  next();
};

app.use('*', requestSpeedLimiter as express.RequestHandler);

// Configuración de sesión segura
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'sessionId',
  rolling: true,
  store: process.env.NODE_ENV === 'production' ? new (require('connect-pg-simple')(session))() : undefined
}));

// Middleware de geolocalización mejorado
app.use((req: Request, res, next) => {
  try {
    const ip = GeoUtils.getValidIP(req);
    
    // Forzar IP pública en desarrollo para testing
    if (process.env.NODE_ENV === 'development' && ip === '127.0.0.1') {
      req.realIp = '190.190.190.190'; // IP de prueba (Argentina)
    } else {
      req.realIp = ip || undefined;
    }

    // Obtener datos geográficos
    const geo: geoip.Lookup = req.realIp ? geoip.lookup(req.realIp) || {} as geoip.Lookup : {} as geoip.Lookup;
    
    // Añadir datos al request
    req.geo = {
      city: geo.city || 'Desconocido',
      region: geo.region || 'Desconocido',
      country: geo.country || 'Desconocido',
      ll: geo.ll?.length === 2 ? geo.ll : [0, 0],
      timezone: geo.timezone || 'UTC',
      proxy: geo.proxy || false
    };

    // Logging para debugging
    console.log('Datos de conexión:', {
      ip: req.realIp,
      geo: req.geo,
      method: req.method,
      endpoint: req.originalUrl
    });

    next();
  } catch (error) {
    console.error('Error en middleware de geolocalización:', error);
    next();
  }
});

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Headers de seguridad adicionales
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Sistema de rutas
// Rutas protegidas por autenticación
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roles', roleRoutes);

// Rutas públicas
app.use('/api', courseRoutes);
app.use('/api', sectionRoutes);
app.use('/api', contentRoutes);
app.use('/api', HeaderSectionRoutes);

// Endpoint de estado mejorado
app.get('/api/status', (req: Request, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV,
    clientIp: req.realIp,
    geoData: req.geo,
    services: {
      database: 'connected',
      auth: 'active',
      geo: req.geo?.country !== 'Desconocido' ? 'active' : 'inactive'
    }
  });
});

// Manejador de errores global mejorado
app.use((err: any, req: Request, res: express.Response, next: express.NextFunction) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    endpoint: req.originalUrl,
    method: req.method,
    ip: req.realIp,
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      code: err.code,
      details: err.errors
    }
  };

  console.error('Error global:', errorData);

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    referenceId: errorData.timestamp,
    ...(process.env.NODE_ENV === 'development' && { details: errorData })
  });
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('Entorno:', process.env.NODE_ENV || 'development');
  console.log('Configuración de geolocalización:', GeoUtils.checkServiceStatus());
});

// Función para obtener la IP válida del request
function getValidIP(req: Request): string | undefined {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  } else if (Array.isArray(forwardedFor)) {
    return forwardedFor[0].trim();
  }
  return req.socket.remoteAddress || undefined;
}