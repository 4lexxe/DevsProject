import { Router } from 'express';
import SectionController from './controller/sectionController';
import SectionGetController from './controller/sectionGetController';
import { validateSectionAndContents } from './SectionValidation';
import { authMiddleware } from '../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/sections', SectionGetController.getAll);
router.get('/sections/count', SectionGetController.getSectionCount);
router.get('/sections/:id', SectionGetController.getById);
router.get('/sections/course/:courseId', SectionGetController.getByCourseId);

// Rutas protegidas (requieren autenticación y permisos)
router.post('/sections', 
  authMiddleware, 
  permissionsMiddleware(['manage:course_content']), 
  SectionController.create
);

router.post('/sections/contents', 
  authMiddleware, 
  permissionsMiddleware(['manage:course_content']), 
  validateSectionAndContents, 
  SectionController.createSectionAndContents
);

router.put('/sections/:id/contents', 
  authMiddleware, 
  permissionsMiddleware(['manage:course_content']), 
  validateSectionAndContents, 
  SectionController.updateSectionAndContents
);

router.put('/sections/:id', 
  authMiddleware, 
  permissionsMiddleware(['manage:course_content']), 
  SectionController.update
);

router.delete('/sections/:id', 
  authMiddleware, 
  permissionsMiddleware(['delete:content']), 
  SectionController.delete
);

export default router;