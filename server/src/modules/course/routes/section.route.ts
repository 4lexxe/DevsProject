import { Router } from 'express';
import SectionController from '../controllers/section.controller';
import SectionGetController from '../controllers/sectionGet.controller';
import { validateSectionAndContents } from '../validators/SectionValidation';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

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
  SectionController.create
);

router.post('/sections/contents', 
  authMiddleware, 
  validateSectionAndContents, 
  SectionController.createSectionAndContents
);

router.put('/sections/:id/contents', 
  authMiddleware, 
  validateSectionAndContents, 
  SectionController.updateSectionAndContents
);

router.put('/sections/:id', 
  authMiddleware, 
  SectionController.update
);

router.delete('/sections/:id', 
  authMiddleware, 
  SectionController.delete
);

export default router;