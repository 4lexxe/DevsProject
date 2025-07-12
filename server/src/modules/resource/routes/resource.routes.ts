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

// Rutas públicas
router.get('/', ResourceController.getResources);
router.get('/:id', ResourceController.getResourceById);

// Rutas protegidas
router.post('/',
  authMiddleware,
  permissionsMiddleware(['upload:resources']),
  validateResource,
  ResourceController.createResource
);

router.put('/:id',
  authMiddleware,
  permissionsMiddleware(['manage:own_resources', 'moderate:all_resources']),
  validateResource,
  ResourceController.updateResource
);

router.delete('/:id',
  authMiddleware,
  permissionsMiddleware(['manage:own_resources', 'moderate:all_resources']),
  ResourceController.deleteResource
);

export default router;