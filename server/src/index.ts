import './lib/env';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import './config/passport'; // Importa la configuración de Passport
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes'; // Importamos las rutas de usuario
import adminRoutes from './routes/adminRoutes'; // Importamos las rutas de admin
import roleRoutes from './routes/roleRoutes';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuración de CORS mejorada
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración de sesión mejorada
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
  rolling: true
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de seguridad básica
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuario
app.use('/api', userRoutes); // Agregamos las rutas de usuario

// Rutas de admin
app.use('/api/', adminRoutes); // Agregamos las rutas de admin

// Rutas de roles
app.use('/api', roleRoutes);


// Manejador de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});