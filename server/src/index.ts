import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import courseRoutes from './routes/courseRoutes';
import contentRoutes from './routes/contentRoutes';
import sectionRoutes from './routes/sectionRoutes';

const app = express();
app.use(express.json());

app.use(userRoutes);
// Conectar las rutas de Admin
app.use(adminRoutes);
// Path: server/src/index.ts
app.use(bodyParser.json());
// Conectar las rutas de Usuario
app.use('/api', userRoutes);
// Conectar las rutas de Admin
app.use("/api", adminRoutes);
// Conectar las rutas de Cursos
app.use("/api", courseRoutes);
// Conectar las rustas de Contenido de los cursos
app.use("/api", contentRoutes);
// Conectar las rutas de Secciones
app.use("/api", sectionRoutes);


app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});