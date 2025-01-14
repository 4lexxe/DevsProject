import express from 'express';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
app.use(express.json());

app.use(userRoutes);
app.use(adminRoutes);

app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});