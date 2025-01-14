import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

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

app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});