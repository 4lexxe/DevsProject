import { Router } from 'express';
import CourseController from './Controller/courseController';
import CourseGetController from './Controller/courseGetController';
import { validateCourse } from './courseValidation';
import { permissionsMiddleware } from '../../shared/middleware/permissionsMiddleware';

const router = Router();

// Ruta para obtener todos los cursos (requiere autenticación y permiso 'read:courses')
router.get('/courses', permissionsMiddleware(['read:courses']), CourseGetController.getAll);

// Obtener todos los cursos activos (requiere autenticación y permiso 'read:courses')
router.get('/courses/actives', permissionsMiddleware(['read:courses']), CourseGetController.getActiveCourses);

// Obtener todos los cursos en desarrollo (requiere autenticación y permiso 'read:courses')
router.get('/courses/development', permissionsMiddleware(['read:courses']), CourseGetController.getInDevelopmentCourses);

// Obtener conteo de todos los cursos (requiere autenticación y permiso 'read:courses')
router.get('/courses/count', permissionsMiddleware(['read:courses']), CourseGetController.getTotalCount);

// Obtener todos los cursos por categoría (requiere autenticación y permiso 'read:courses')
router.get('/courses/category/actives/:categoryId', permissionsMiddleware(['read:courses']), CourseGetController.getByCategory);

// Obtener todos los cursos por tipo de carrera (requiere autenticación y permiso 'read:courses')
router.get('/courses/careerType', permissionsMiddleware(['read:courses']), CourseGetController.getByCareerType);

// Obtener los cursos por admin (requiere autenticación y permiso 'read:courses')
router.get('/courses/admin/:id', permissionsMiddleware(['read:courses']), CourseGetController.getByAdminId);

// Ruta para obtener un curso por ID (requiere autenticación y permiso 'read:courses')
router.get('/courses/:id', permissionsMiddleware(['read:courses']), CourseGetController.getById);

// Ruta para crear un curso (solo Admin y SuperAdmin)
router.post('/courses', validateCourse, permissionsMiddleware(['write:courses']), CourseController.create);

// Ruta para actualizar un curso (solo Admin y SuperAdmin)
router.put('/courses/:id', validateCourse, permissionsMiddleware(['write:courses']), CourseController.update);

// Ruta para eliminar un curso (solo Admin y SuperAdmin)
router.delete('/courses/:id', permissionsMiddleware(['delete:courses']), CourseController.delete);

export default router;