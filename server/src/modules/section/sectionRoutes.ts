import { Router } from 'express';
import {
  createSection,
  getSectionsByCourse,
  getSectionById,
  updateSection,
  deleteSection,
} from '../section/sectionContentController';

const router = Router();

/* // Ruta para crear una nueva sección (requiere autenticación)
router.post('/sections', createSection);

// Ruta para obtener todas las secciones de un curso (sin autenticación)
router.get('/sections/course/:courseId', getSectionsByCourse);

// Ruta para obtener una sección por ID (sin autenticación)
router.get('/sections/:id', getSectionById);

// Ruta para actualizar una sección por ID (requiere autenticación)
router.put('/sections/:id', updateSection);

// Ruta para eliminar una sección por ID (requiere autenticación)
router.delete('/sections/:id', deleteSection); */

export default router;