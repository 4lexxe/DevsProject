import { Router } from 'express';
import SectionController from '../section/sectionContentController';

const router = Router();

router.get('/sections', SectionController.getAll)


router.get('/sections/count', SectionController.getSectionCount)

// Ruta para obtener una sección por ID (sin autenticación)
router.get('/section/:id', SectionController.getById);

// Ruta para obtener todas las secciones de un curso (sin autenticación)
router.get('/course/sections/:courseId', SectionController.getByCourseId);

// Ruta para crear una nueva sección (requiere autenticación)
router.post('/section', SectionController.create);

// Ruta para crear varias secciones y que cada seccion tenga varios contenidos
router.post('/sections', SectionController.createSectionsAndContents);

/* router.post('/sections/contents') */

// Ruta para actualizar una sección por ID (requiere autenticación)
router.put('/sections/:id', SectionController.update);

// Ruta para eliminar una sección por ID (requiere autenticación)
router.delete('/sections/:id', SectionController.delete);

export default router;