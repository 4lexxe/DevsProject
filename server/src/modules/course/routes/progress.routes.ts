import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { body, param } from 'express-validator';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

/**
 * @route POST /api/courses/:courseId/content/:contentId/access
 * @desc Registra el acceso a un contenido específico
 * @access Private
 */
router.post(
  '/courses/:courseId/content/:contentId/access',
  [
    param('courseId').isNumeric().withMessage('ID del curso debe ser numérico'),
    param('contentId').isNumeric().withMessage('ID del contenido debe ser numérico'),
    body('timeSpent').optional().isNumeric().withMessage('Tiempo gastado debe ser numérico')
  ],
  ProgressController.accessContent
);

/**
 * @route POST /api/courses/:courseId/content/:contentId/complete
 * @desc Marca un contenido como completado
 * @access Private
 */
router.post(
  '/courses/:courseId/content/:contentId/complete',
  [
    param('courseId').isNumeric().withMessage('ID del curso debe ser numérico'),
    param('contentId').isNumeric().withMessage('ID del contenido debe ser numérico'),
    body('timeSpent').optional().isNumeric().withMessage('Tiempo gastado debe ser numérico')
  ],
  ProgressController.markContentCompleted
);

/**
 * @route GET /api/courses/:courseId/progress
 * @desc Obtiene el progreso completo de un usuario en un curso
 * @access Private
 */
router.get(
  '/courses/:courseId/progress',
  [
    param('courseId').isNumeric().withMessage('ID del curso debe ser numérico')
  ],
  ProgressController.getCourseProgress
);

/**
 * @route GET /api/courses/progress
 * @desc Obtiene el progreso de todos los cursos de un usuario
 * @access Private
 */
router.get(
  '/courses/progress',
  ProgressController.getUserProgress
);

/**
 * @route DELETE /api/courses/:courseId/progress/:targetUserId
 * @desc Reinicia el progreso de un curso (solo administradores o propio usuario)
 * @access Private
 */
router.delete(
  '/courses/:courseId/progress/:targetUserId',
  [
    param('courseId').isNumeric().withMessage('ID del curso debe ser numérico'),
    param('targetUserId').isNumeric().withMessage('ID del usuario debe ser numérico')
  ],
  ProgressController.resetCourseProgress
);

export default router;