import { Router } from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from './roleController';

const router = Router();

// Rutas para manejar las operaciones CRUD de los roles
router.post('/roles', createRole); // Crear un nuevo rol
router.get('/roles', getRoles); // Obtener todos los roles
router.get('/roles/:id', getRoleById); // Obtener un rol por ID
router.put('/roles/:id', updateRole); // Actualizar un rol por ID
router.delete('/roles/:id', deleteRole); // Eliminar un rol por ID

export default router;