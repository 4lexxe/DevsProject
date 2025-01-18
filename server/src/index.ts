import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import roleRoutes from './routes/roleRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import courseRoutes from './routes/courseRoutes';
import contentRoutes from './routes/contentRoutes';
import sectionRoutes from './routes/sectionRoutes';
import headerSectionRoutes from './routes/headerSectionRoutes';

const app = express();
const PORT = 3000;

// Habilitar CORS
app.use(cors()); // Permite que el frontend haga solicitudes

// Middleware para procesar cuerpos JSON
app.use(bodyParser.json()); // Antes de definir las rutas

// Conectar las rutas de Roles
app.use('/api', roleRoutes);

// Conectar las rutas de Usuario
app.use('/api', userRoutes);

// Conectar las rutas de Admin
app.use('/api', adminRoutes);

// Conectar las rutas de Cursos y su contenido
app.use('/api', courseRoutes);
app.use('/api', contentRoutes);

// Conectar las rutas de Secciones y encabezados
app.use('/api', sectionRoutes);
app.use('/api', headerSectionRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});