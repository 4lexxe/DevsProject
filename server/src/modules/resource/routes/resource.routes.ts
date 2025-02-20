import express from 'express';
import { ResourceController } from '../controllers/resource.controller';

const router = express.Router();

// Use validations directly from controller
router.post(
  '/',
  ResourceController.resourceValidations,
  ResourceController.createResource
);

router.get('/', ResourceController.getResources);
router.get('/:id', ResourceController.getResourceById);

router.put(
  '/:id',
  ResourceController.resourceValidations,
  ResourceController.updateResource
);

router.delete('/:id', ResourceController.deleteResource);

export default router;