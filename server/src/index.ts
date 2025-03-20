// ==================================================
// Importaciones de librerías y módulos necesarios
// ==================================================
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import geoip from 'geoip-lite';
import { Server, Socket } from 'socket.io';
import { Request } from 'express';

// ==================================================
// Importaciones de rutas
// ==================================================

// Rutas de Autenticación
import authRoutes from './modules/auth/routes/auth.routes';

// Rutas de Usuarios
import userRoutes from './modules/user/userRoutes';
import adminRoutes from './modules/admin/adminRoutes';
import roleRoutes from './modules/role/roleRoutes';

// Rutas de Contenido
import HeaderSectionRoutes from './modules/headerSection/headerSectionRoutes';
import careerTypeRoutes from './modules/careerType/CareerTypeRoutes';
import categoryRoutes from './modules/category/CategoryRoutes';
import courseRoutes from './modules/course/courseRoutes';
import sectionRoutes from './modules/section/sectionRoutes';
import contentRoutes from './modules/content/contentRoutes';

// Rutas de Recursos
import recourseRoutes from './modules/resource/routes/resource.routes';
import ratingRoutes from './modules/resource/rating/rating.routes';
import commentRoutes from './modules/resource/comment/comment.routes';
import uploadRoutes from './modules/resource/routes/upload.routes';

// Rutas de Roadmap
import roadMapRoutes from './modules/roadmap/roadMapRoutes';

// Rutas de Foro
import forumCategoryRoutes from './modules/forum/routes/forumCategory.routes';
import forumPostRoutes from './modules/forum/routes/forumpost.routes';
import forumReplyRoutes from './modules/forum/routes/forumreply.routes';
import forumReactionPostRoutes from './modules/forum/routes/forumreactionpost.routes';
import forumReactionReplyRoutes from './modules/forum/routes/forumreactionreply.routes';
import forumVotePostRoutes from './modules/forum/routes/forumvotepost.routes';
import forumVoteReplyRoutes from './modules/forum/routes/forumvotereply.routes';
import forumFlairRoutes from './modules/forum/routes/forumflairs.routes';
import forumReportRoutes from './modules/forum/routes/report.routes';
import forumUploadRoutes from './modules/forum/routes/upload.routes';

// ==================================================
// Importaciones de utilidades y configuraciones
// ==================================================
import './infrastructure/passport/passport';
import { GeoUtils } from './modules/auth/utils/geo.utils';

// ==================================================
// Extensiones de tipos para librerías externas
// ==================================================

// Extender tipos para Socket.IO
declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

// Extender tipos para geoip-lite
declare module 'geoip-lite' {
  interface Lookup {
    proxy?: boolean;
    timezone: string;
  }
}

// ==================================================
// Configuración inicial de la aplicación
// ==================================================
const app = express();
const PORT = /* process.env.PORT || */ 3000;

// ==================================================
// 1. Middlewares de seguridad básicos
// Configuración inicial
// ==================================================
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

// ==================================================
// 2. Limitador de peticiones para API pública
// Rate limiting con validación reforzada de IP
// ==================================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = GeoUtils.getValidIP(req);
    return ip || '127.0.0.1';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Demasiadas peticiones. Intente nuevamente en 15 minutos.',
      ip: getValidIP(req),
      timestamp: new Date().toISOString()
    });
  }
});

// ==================================================
// 3. Configuración de sesiones seguras
// ==================================================
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas de duración de la sesión 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'sessionId',
  rolling: true,
  store: process.env.NODE_ENV === 'production' 
    ? new (require('connect-pg-simple')(session))() 
    : undefined
}));

// ==================================================
// 4. Middleware de geolocalización mejorado
// ==================================================
app.use((req: Request, res, next) => {
  try {
    let ip = GeoUtils.getValidIP(req);
    
    // Forzar IP de prueba en entorno de desarrollo para testing
    if (process.env.NODE_ENV === 'development' && ip === '127.0.0.1') {
      ip = '190.190.190.190'; // IP de prueba (Argentina)
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
      proxy: !!geo.proxy
    };

    // Mostrar en formato de tablas
    console.log('\n══════════════════════════════════════════════════');
    console.log('           DATOS DE CONEXIÓN            ');
    console.log('══════════════════════════════════════════════════');
    console.table([{
      'IP': ip,
      'Ciudad': req.geo.city,
      'Región': req.geo.region,
      'País': req.geo.country,
      'Coordenadas': `Lat: ${req.geo.ll[0]}, Lon: ${req.geo.ll[1]}`
    }]);
    console.table([{
      'Zona Horaria': req.geo.timezone,
      'Proxy': req.geo.proxy ? '✅ Sí' : '❌ No',
      'Método': req.method,
      'Endpoint': req.originalUrl
    }]);
    console.log('══════════════════════════════════════════════════');
    
    // este es next es para que siga con la ejecución de la aplicación
    next();
    
  } catch (error) {
    console.error('\n⚠️  Error en geolocalización:', error);
    next();
  }
});

// ==================================================
// 5. Configuración de Passport (Autenticación)
// ==================================================
app.use(passport.initialize());
app.use(passport.session());

// ==================================================
// 6. Headers de seguridad adicionales
// ==================================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// ==================================================
// 7. Sistema de enrutamiento
// ==================================================

// --------------------------
// 7.1 Rutas de Autenticación
// --------------------------
app.use('/api/auth', apiLimiter, authRoutes);

// --------------------------
// 7.2 Rutas
// --------------------------

// NO CAMBIAR EL ORDEN DE LAS RUTAS!

/* 
--------------------------
Aclaración de rutas: Usuario necesita de la ruta de autenticación para poder acceder a las rutas de usuario, admin y roles.

admin y roles no necesitan de la ruta de autenticación para poder acceder a sus rutas pero si de la ruta de usuario para poder acceder a sus rutas.
--------------------------
*/

// Rutas de Usuarios
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roles', roleRoutes);

/*
--------------------------

Aclaración de rutas: Recursos necesita de la ruta de autenticación para poder acceder a sus rutas.
--------------------------
*/

// Rutas de Recursos
app.use('/api/resources', recourseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/comment', commentRoutes);

// Rutas de Contenido en el hero
app.use('/api', HeaderSectionRoutes);

// Rutas de Cursos
app.use('/api', courseRoutes);
app.use('/api', sectionRoutes);
app.use('/api', careerTypeRoutes);
app.use('/api', categoryRoutes);
app.use('/api', contentRoutes);

// Rutas de Roadmap
app.use('/api', roadMapRoutes);

// Rutas de Foro
app.use('/api/forum', forumCategoryRoutes);
app.use('/api/forum', forumPostRoutes);
app.use('/api/forum', forumReplyRoutes);
app.use('/api/forum', forumReactionPostRoutes);
app.use('/api/forum', forumReactionReplyRoutes);
app.use('/api/forum', forumVotePostRoutes);
app.use('/api/forum', forumVoteReplyRoutes);
app.use('/api/forum', forumFlairRoutes);
app.use('/api/forum', forumReportRoutes);
app.use('/api/forum/upload', forumUploadRoutes);

// Endpoint de estado del sistema
app.get('/api/status', (req: Request, res) => {
  res.json({
    status: 'OK',
    entorno: process.env.NODE_ENV,
    ipCliente: req.realIp,
    geolocalizacion: req.geo,
    servicios: {
      baseDatos: 'conectada',
      autenticacion: 'activa',
      geo: req.geo?.country !== 'Desconocido' ? 'activo' : 'inactivo'
    }
  });
});

// ==================================================
// 8. Manejo de errores global
// ==================================================
app.use((err: any, req: Request, res: express.Response, next: express.NextFunction) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    endpoint: req.originalUrl,
    método: req.method,
    ip: req.realIp,
    error: {
      mensaje: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      código: err.code,
      detalles: err.errors
    }
  };
  
  console.error('Error global:', errorData);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
    referencia: errorData.timestamp,
    ...(process.env.NODE_ENV === 'development' && { detalles: errorData })
  });
});

// ==================================================
// 9. Configuración del servidor web
// ==================================================
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log('Entorno:', process.env.NODE_ENV || 'development');
  console.log('Estado geolocalización:', GeoUtils.checkServiceStatus());
});

// ==================================================
// 10. Configuración de WebSockets (Socket.IO)
// ==================================================
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

const estadoMensajesBienvenida: Record<string, boolean> = {};

io.on('connection', (socket: Socket) => {
  console.log('🔌 Nuevo cliente conectado');

  socket.on('identify', ({ userId }) => {
    console.log(`🆔 Usuario identificado: ${userId}`);
    socket.userId = userId;
    socket.emit('welcomeMessageStatus', { 
      shown: estadoMensajesBienvenida[userId] || false 
    });
  });

  socket.on('welcomeMessageShown', ({ userId }) => {
    console.log(`✅ Mensaje visto por usuario: ${userId}`);
    estadoMensajesBienvenida[userId] = true;
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.userId}`);
  });
});

// ==================================================
// Funciones auxiliares
// ==================================================
function getValidIP(req: Request): string | undefined {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  } else if (Array.isArray(forwardedFor)) {
    return forwardedFor[0].trim();
  }
  return req.socket.remoteAddress || undefined;
}

// ==================================================
// Manejo de rutas no encontradas (404)
// ==================================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    método: req.method,
    ruta: req.originalUrl
  });
});