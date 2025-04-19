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

// Crear un nuevo rol
router.post('/roles', createRole);

// Obtener todos los roles
router.get('/roles', getRoles);

// Obtener un rol por ID
router.get('/roles/:id', getRoleById);

// Actualizar un rol por ID
router.put('/roles/:id', updateRole);

// Eliminar un rol por ID
router.delete('/roles/:id', deleteRole);

export default router;