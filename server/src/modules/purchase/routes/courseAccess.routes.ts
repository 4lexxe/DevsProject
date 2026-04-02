import { Router } from 'express';
import { CourseAccessController } from '../controllers/courseAccess.controller';
import {
  validateUserId,
  validateUserIdAndCourseId,
  validateGrantAccess,
  validateRevokeAccess
} from '../validators/courseAccessValidation';

import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { requirePermission } from '../../../shared/middleware/permissionsMiddleware';

const router = Router();

// Rutas auht sin permisos

/**
 * @route GET /course-access/:userId/courses
 * @desc Obtiene todos los cursos a los que el usuario tiene acceso
 * @access Private
 */
router.get('/user/courses', authMiddleware, validateUserId, CourseAccessController.getUserCourses);

/**
 * @route GET /course-access/:userId/courses/:courseId
 * @desc Obtiene los detalles de un curso específico al que el usuario tiene acceso
 * @access Private
 */
router.get('/:userId/courses/:courseId', authMiddleware, validateUserIdAndCourseId, CourseAccessController.getCourseDetails);

/**
 * @route GET /course-access/:userId/courses/:courseId/check
 * @desc Verifica si el usuario tiene acceso a un curso específico
 * @access Private
 */
router.get('/:userId/courses/:courseId/check', authMiddleware, validateUserIdAndCourseId, CourseAccessController.checkCourseAccess);

/**
 * @route GET /course-access/:userId/stats
 * @desc Obtiene estadísticas de cursos del usuario
 * @access Private
 */
router.get('/:userId/stats', validateUserId, CourseAccessController.getUserCourseStats);

/**
 * @route GET /course-access/course/:courseId/users
 * @desc Obtiene todos los usuarios que tienen acceso a un curso
 * @access Private - Admin only
 */
router.get('/course/:courseId/users', CourseAccessController.getCourseUsers);



/**
 * @route POST /course-access/grant
 * @desc Otorga acceso a un curso para un usuario (usado después de una compra exitosa)
 * @access Private - Admin only
 */
router.post('/grant', authMiddleware, requirePermission('course_access:grant'), validateGrantAccess, CourseAccessController.grantCourseAccess);

/**
 * @route PUT /course-access/:userId/courses/:courseId/revoke
 * @desc Revoca el acceso a un curso (solo para administradores)
 * @access Private - Admin only
 */
router.put('/:userId/courses/:courseId/revoke', authMiddleware, requirePermission('course_access:revoke'), validateRevokeAccess, CourseAccessController.revokeCourseAccess);

/**
 * @route GET /course-access/:userId/history
 * @desc Obtiene el historial de accesos de un usuario (incluyendo revocados)
 * @access Private
 */
router.get('/:userId/history', validateUserId, CourseAccessController.getCourseAccessHistory);

export default router;
