import {Router} from 'express';

import CourseController from './Controller/courseController';
import CourseGetController from './Controller/courseGetController';
import { validateCourse } from './courseValidation';

const router = Router();

// Ruta para obtener todos los cursos (público)
router.get('/courses', CourseGetController.getAll);

// Obtener todos los curso activos
router.get('/courses/actives', CourseGetController.getActiveCourses)

// Obtener todos los cursos en desarrollo
router.get('/courses/development', CourseGetController.getInDevelopmentCourses)

// Obtener conteo de todos los cursos
router.get('/courses/count', CourseGetController.getTotalCount)

// Obtener todos los cursos por categoria
router.get('/courses/category/actives/:categoryId', CourseGetController.getByCategory)

// Obtener todos los cursos por tipo de carrera
router.get('/courses/careerType', CourseGetController.getByCareerType)

// Obtener los cursos por admin
router.get('/courses/admin/:id', CourseGetController.getByAdminId)

// Ruta para obtener un curso por ID (público)
router.get('/courses/:id', CourseGetController.getById);

// Ruta para obtener un curso por ID y la navegacion entre sus secciones y contenidos de cada una
router.get('/courses/:id/navigate', CourseGetController.getCourseNavigation);

// Ruta para crear un curso (solo Admin y SuperAdmin)
router.post('/courses', validateCourse, CourseController.create);

// Ruta para actualizar un curso (solo Admin y SuperAdmin)
router.put('/courses/:id', validateCourse, CourseController.update);

// Ruta para eliminar un curso (solo Admin y SuperAdmin)
router.delete('/courses/:id', CourseController.delete);

export default router;
