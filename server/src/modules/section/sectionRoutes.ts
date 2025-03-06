import { Router } from 'express';
import SectionController from './controller/sectionController';
import SectionGetController from './controller/sectionGetController';
import { validateSectionAndContents } from './SectionValidation';

const router = Router();

router.get('/sections', SectionGetController.getAll)


router.get('/sections/count', SectionGetController.getSectionCount)

// Ruta para obtener una sección por ID (sin autenticación)
router.get('/sections/:id', SectionGetController.getById);

// Ruta para obtener todas las secciones de un curso (sin autenticación)
router.get('/sections/course/:courseId', SectionGetController.getByCourseId);

// Ruta para crear una nueva sección (requiere autenticación)
router.post('/sections', SectionController.create);

// Ruta para crear una seccion con sus contenidos
router.post('/sections/contents', validateSectionAndContents, SectionController.createSectionAndContents);

// Ruta para actualizar una seccion con sus contenidos
router.put('/sections/:id/contents', validateSectionAndContents, SectionController.updateSectionAndContents);

// Ruta para actualizar una sección por ID (requiere autenticación)
router.put('/sections/:id', SectionController.update);

// Ruta para eliminar una sección por ID (requiere autenticación)
router.delete('/sections/:id', SectionController.delete);

export default router;