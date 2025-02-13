import { Router } from 'express';
import SectionController from '../section/sectionContentController';

const router = Router();

router.get('/sections', SectionController.getAll)

// Ruta para obtener todas las secciones de un curso (sin autenticación)
router.get('/sections/course/:courseId', SectionController.getByCourseId);

router.get('/sections/count', SectionController.getSectionCount)

// Ruta para obtener una sección por ID (sin autenticación)
router.get('/sections/:id', SectionController.getById);

// Ruta para crear una nueva sección (requiere autenticación)
router.post('/sections', SectionController.create);

// Ruta para actualizar una sección por ID (requiere autenticación)
router.put('/sections/:id', SectionController.update);

// Ruta para eliminar una sección por ID (requiere autenticación)
router.delete('/sections/:id', SectionController.delete);

export default router;