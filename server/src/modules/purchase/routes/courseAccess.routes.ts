import { Router } from 'express';
import { CourseAccessController } from '../controllers/courseAccess.controller';
import { 
  validateUserId, 
  validateUserIdAndCourseId, 
  validateGrantAccess, 
  validateRevokeAccess 
} from '../validators/courseAccessValidation';

const router = Router();

/**
 * @route GET /course-access/:userId/courses
 * @desc Obtiene todos los cursos a los que el usuario tiene acceso
 * @access Private
 */
router.get('/:userId/courses', validateUserId, CourseAccessController.getUserCourses);

/**
 * @route GET /course-access/:userId/courses/:courseId
 * @desc Obtiene los detalles de un curso específico al que el usuario tiene acceso
 * @access Private
 */
router.get('/:userId/courses/:courseId', validateUserIdAndCourseId, CourseAccessController.getCourseDetails);

/**
 * @route GET /course-access/:userId/courses/:courseId/check
 * @desc Verifica si el usuario tiene acceso a un curso específico
 * @access Private
 */
router.get('/:userId/courses/:courseId/check', validateUserIdAndCourseId, CourseAccessController.checkCourseAccess);

/**
 * @route GET /course-access/:userId/stats
 * @desc Obtiene estadísticas de cursos del usuario
 * @access Private
 */
router.get('/:userId/stats', validateUserId, CourseAccessController.getUserCourseStats);

/**
 * @route POST /course-access/grant
 * @desc Otorga acceso a un curso para un usuario (usado después de una compra exitosa)
 * @access Private - Admin only
 */
router.post('/grant', validateGrantAccess, CourseAccessController.grantCourseAccess);

/**
 * @route PUT /course-access/:userId/courses/:courseId/revoke
 * @desc Revoca el acceso a un curso (solo para administradores)
 * @access Private - Admin only
 */
router.put('/:userId/courses/:courseId/revoke', validateRevokeAccess, CourseAccessController.revokeCourseAccess);

/**
 * @route GET /course-access/:userId/history
 * @desc Obtiene el historial de accesos de un usuario (incluyendo revocados)
 * @access Private
 */
router.get('/:userId/history', validateUserId, CourseAccessController.getCourseAccessHistory);

export default router;
