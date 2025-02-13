import express from 'express';

import { CourseController } from './courseController';

const router = express.Router();

// Ruta para obtener todos los cursos (público)
router.get('/course', CourseController.getAll);

// Obtener todos los curso activos
router.get('/course/actives', CourseController.getActiveCourses)

// Obtener todos los cursos en desarrollo
router.get('/course/development', CourseController.getInDevelopmentCourses)

// Obtener conteo de todos los cursos
router.get('/course/count', CourseController.getTotalCount)

// Obtener todos los curso por categoria
router.get('/courseByCategory', CourseController.getByCategory)

// Obtener todos los cursos por tipo de carrera
router.get('/courseByCareerType', CourseController.getByCareerType)

// Obtener los cursos por admin
router.get('/courseByAdmin', CourseController.getByAdminId)

// Ruta para obtener un curso por ID (público)
router.get('/course/:id', CourseController.getById);

// Ruta para crear un curso (solo Admin y SuperAdmin)
router.post('/course', CourseController.create);

// Ruta para obtener el conteo de módulos de un curso (público)
/* router.get('/course/:courseId/modules/count', getSectionsByCourse); */

// Ruta para actualizar un curso (solo Admin y SuperAdmin)
router.put('/course/:id', CourseController.update);

// Ruta para eliminar un curso (solo Admin y SuperAdmin)
router.delete('/course/:id', CourseController.delete);

export default router;
