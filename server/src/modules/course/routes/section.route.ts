import { Router } from 'express';
import SectionController from '../controllers/section.controller';
import SectionGetController from '../controllers/sectionGet.controller';
import { validateSectionAndContents } from '../validators/SectionValidation';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { permissionsMiddleware } from '../../../shared/middleware/permissionsMiddleware';
import { optionalAuthMiddleware } from '../../../shared/middleware/optionalAuthMiddleware';

const router = Router();

// Ruta PÚBLICA - Devuelve solo estructura del curso (títulos y duraciones) sin contenido real
// Para mostrar preview a usuarios no logueados o sin acceso
router.get('/sections/course/:courseId/public', 
  SectionGetController.getPublicCourseStructure
);

// Rutas protegidas - requieren autenticación y permisos para ver secciones
// Las secciones contienen información del curso que debe estar protegida
router.get('/sections', 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  SectionGetController.getAll
);

router.get('/sections/count', 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'manage:course_content']),
  SectionGetController.getSectionCount
);

router.get('/sections/:id', 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  SectionGetController.getById
);

router.get('/sections/course/:courseId', 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  SectionGetController.getByCourseId
);

// Resumen de secciones y contenidos (solo nombres) por curso
router.get('/sections/course/:courseId/summary',
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  SectionGetController.getCourseSectionsSummary
);

router.get('/sections/:id/contents', 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  SectionGetController.getByIdWithContents
);

// Nueva ruta para buscar sección por courseSlug y sectionSlug
router.get('/sections/course/:courseSlug/section/:sectionSlug', 
  authMiddleware,
  permissionsMiddleware(['read:course_details', 'access:course_content']),
  SectionGetController.getByCourseAndSectionSlug
);

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