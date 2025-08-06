import { Router } from 'express';
import SectionController from '../controllers/section.controller';
import SectionGetController from '../controllers/sectionGet.controller';
import { validateSectionAndContents } from '../validators/SectionValidation';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../../shared/middleware/permissionsMiddleware';
import { validateCourseAccess, validateAdminCourseAccess } from '../../../shared/middleware/courseAccessMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/sections', SectionGetController.getAll);
router.get('/sections/count', SectionGetController.getSectionCount);
router.get('/sections/:id', SectionGetController.getById);
router.get('/sections/course/:courseId', SectionGetController.getByCourseId);

// Rutas que requieren autenticación y acceso al curso
router.get('/sections/:id/contents', 
  authMiddleware,
  validateCourseAccess,
  SectionGetController.getByIdWithContents
);

// Rutas protegidas (requieren autenticación y permisos administrativos)
router.post('/sections', 
  authMiddleware, 
  validateAdminCourseAccess, 
  SectionController.create
);

router.post('/sections/contents', 
  authMiddleware, 
  validateAdminCourseAccess, 
  validateSectionAndContents, 
  SectionController.createSectionAndContents
);

router.put('/sections/:id/contents', 
  authMiddleware, 
  validateAdminCourseAccess, 
  validateSectionAndContents, 
  SectionController.updateSectionAndContents
);

router.put('/sections/:id', 
  authMiddleware, 
  validateAdminCourseAccess, 
  SectionController.update
);

router.delete('/sections/:id', 
  authMiddleware, 
  validateAdminCourseAccess, 
  SectionController.delete
);

export default router;