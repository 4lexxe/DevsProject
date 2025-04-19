import express from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { body } from 'express-validator';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../../shared/middleware/permissionsMiddleware';

const router = express.Router();

// Middleware para validar datos de entrada
const validateResource = [
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('url').isURL().withMessage('La URL debe ser válida'),
  body('type').isIn(['video', 'document', 'image', 'link']).withMessage('Tipo de recurso inválido'),
  body('isVisible').optional().isBoolean().withMessage('isVisible debe ser un valor booleano'),
  body('coverImage').optional().isURL().withMessage('La URL de la imagen de portada debe ser válida'),
];

// Crear un nuevo recurso (POST /resources)
router.post(
  '/',
  authMiddleware,
  permissionsMiddleware(['create:resources']),
  validateResource,
  ResourceController.createResource
);

// Obtener todos los recursos visibles (GET /resources)
router.get('/', ResourceController.getResources);

// Obtener un recurso por ID (GET /resources/:id)
router.get('/:id', ResourceController.getResourceById);

// Actualizar un recurso (PUT /resources/:id)
router.put(
  '/:id',
  validateResource,
  authMiddleware,
  permissionsMiddleware(['edit:resources']),
  ResourceController.updateResource
);

// Eliminar un recurso (DELETE /resources/:id)
router.delete('/:id', 
  authMiddleware, 
  permissionsMiddleware(['delete:resources']), 
  ResourceController.deleteResource);

export default router;