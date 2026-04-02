import { Router } from 'express';
import SectionController from '../controllers/section.controller';
import SectionGetController from '../controllers/sectionGet.controller';
import { validateSectionAndContents } from '../validators/SectionValidation';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { requirePermission } from '../../../shared/middleware/permissionsMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/sections', SectionGetController.getAll);
router.get('/sections/count', SectionGetController.getSectionCount);
router.get('/sections/:id', SectionGetController.getById);
router.get('/sections/course/:courseId', SectionGetController.getByCourseId);
router.get('/sections/:id/contents', SectionGetController.getByIdWithContents);

// Rutas protegidas (requieren autenticación y permisos)
router.post('/sections',
  authMiddleware,
  requirePermission('section:create'),
  SectionController.create
);

router.post('/sections/contents',
  authMiddleware,
  requirePermission('section:create'), // Creating section and contents
  validateSectionAndContents,
  SectionController.createSectionAndContents
);

router.put('/sections/:id/contents',
  authMiddleware,
  requirePermission('section:update'), // Updating section and contents
  validateSectionAndContents,
  SectionController.updateSectionAndContents
);

router.put('/sections/:id',
  authMiddleware,
  requirePermission('section:update'),
  SectionController.update
);

router.delete('/sections/:id',
  authMiddleware,
  requirePermission('section:delete'),
  SectionController.delete
);

export default router;