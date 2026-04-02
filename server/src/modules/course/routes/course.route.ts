import { Router } from 'express';

import CourseController from '../controllers/course.controller';
import CourseGetController from '../controllers/courseGet.controller';
import { validateCourse } from '../validators/courseValidation';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { requirePermission } from '../../../shared/middleware/permissionsMiddleware';
import { verifyCourseAccess } from '../../../shared/middleware/courseAccessMiddleware';

const router = Router();

//Rutas auht si permisos


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

// Ruta para obtener un curso por ID (público)
router.get('/courses/:id/price', CourseGetController.getByIdWithPrices);

// Ruta para obtener un curso por ID y la navegacion entre sus secciones y contenidos de cada una
router.get('/courses/:id/navigate',
  authMiddleware,
  verifyCourseAccess,
  CourseGetController.getCourseNavigation
);

// Ruta para crear un curso (requiere autenticación y permisos)
router.post('/courses',
  authMiddleware,
  requirePermission('course:create'),
  validateCourse,
  CourseController.create
);

// Ruta para actualizar un curso (requiere autenticación y permisos)
router.put('/courses/:id',
  authMiddleware,
  requirePermission('course:update'),
  validateCourse,
  CourseController.update
);

// Ruta para eliminar un curso (requiere autenticación y permisos)
router.delete('/courses/:id',
  authMiddleware,
  requirePermission('course:delete'),
  CourseController.delete
);

export default router;
