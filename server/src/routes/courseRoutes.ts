// routes/CourseRoutes.ts
import express from 'express';
import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/courseController';
import { getSectionsByCourse } from '../controllers/sectionContentController';

const router = express.Router();

// Ruta para crear un curso (solo Admin)
router.post('/courses', createCourse);

// Ruta para obtener todos los cursos
router.get('/courses', getCourses);

// Ruta para obtener un curso por ID
router.get('/courses/:id', getCourseById);

// Ruta para obtener el conteo de módulos de un curso 
router.get('/courses/:courseId/modules/count', getSectionsByCourse);


// Ruta para actualizar un curso (solo Admin)
router.put('/courses/:id', updateCourse);

// Ruta para eliminar un curso (solo Admin)
router.delete('/courses/:id', deleteCourse);

export default router;