import {Router} from 'express';

import { CourseController } from './courseController';

const router = Router();

// Ruta para obtener todos los cursos (público)
router.get('/courses', CourseController.getAll);

// Obtener todos los curso activos
router.get('/courses/actives', CourseController.getActiveCourses)

// Obtener todos los cursos en desarrollo
router.get('/courses/development', CourseController.getInDevelopmentCourses)

// Obtener conteo de todos los cursos
router.get('/courses/count', CourseController.getTotalCount)

// Obtener todos los cursos por categoria
router.get('/courses/category/actives/:categoryId', CourseController.getByCategory)

// Obtener todos los cursos por tipo de carrera
router.get('/courses/careerType', CourseController.getByCareerType)

// Obtener los cursos por admin
router.get('/courses/admin/:id', CourseController.getByAdminId)

// Ruta para obtener un curso por ID (público)
router.get('/courses/:id', CourseController.getById);

// Ruta para crear un curso (solo Admin y SuperAdmin)
router.post('/courses', CourseController.create);

// Ruta para actualizar un curso (solo Admin y SuperAdmin)
router.put('/courses/:id', CourseController.update);

// Ruta para eliminar un curso (solo Admin y SuperAdmin)
router.delete('/courses/:id', CourseController.delete);

export default router;
