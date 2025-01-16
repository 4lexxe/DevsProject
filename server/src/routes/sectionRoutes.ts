// routes/SectionRoutes.ts
import express from 'express';
import { createSection, getSectionsByCourse, getSectionById, updateSection, deleteSection } from '../controllers/sectionContentController';

const router = express.Router();

// Ruta para crear una sección
router.post('/sections', createSection);

// Ruta para obtener todas las secciones de un curso
router.get('/sections/course/:courseId', getSectionsByCourse);

// Ruta para obtener una sección por ID
router.get('/sections/:id', getSectionById);

// Ruta para actualizar una sección
router.put('/sections/:id', updateSection);

// Ruta para eliminar una sección
router.delete('/sections/:id', deleteSection);

export default router;