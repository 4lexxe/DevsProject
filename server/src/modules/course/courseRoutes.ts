import express from 'express';
import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from '../course/courseController';
import { getSectionsByCourse } from '../section/sectionContentController';

const router = express.Router();

// Ruta para obtener todos los cursos (público)
router.get('/courses', getCourses);

// Ruta para obtener un curso por ID (público)
router.get('/courses/:id', getCourseById);

// Ruta para crear un curso (solo Admin y SuperAdmin)
router.post('/courses', createCourse);

// Ruta para obtener el conteo de módulos de un curso (público)
router.get('/courses/:courseId/modules/count', getSectionsByCourse);

// Ruta para actualizar un curso (solo Admin y SuperAdmin)
router.put('/courses/:id', updateCourse);

// Ruta para eliminar un curso (solo Admin y SuperAdmin)
router.delete('/courses/:id', deleteCourse);

export default router;
