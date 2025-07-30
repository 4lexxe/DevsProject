import { Router } from "express";
import CourseDiscountEventController from "../controllers/CourseDiscountEvent.controller";
import {
  createCourseDiscountEventValidation,
  updateCourseDiscountEventValidation,
  getCourseDiscountEventByIdValidation,
  deleteCourseDiscountEventValidation,
  getCourseDiscountEventsValidation,
  addCoursesToDiscountEventValidation,
  updateCoursesForDiscountEventValidation,
  removeCoursesFromDiscountEventValidation,
  getCoursesForDiscountEventValidation,
  getActiveDiscountsForCourseValidation,
  toggleDiscountEventValidation,
} from "../validators/courseDiscountEvent.validators";

const router = Router();

// ==================== RUTAS CRUD ====================

/**
 * @route   GET /api/course-discount-events
 * @desc    Obtener todos los eventos de descuento con paginación
 * @access  Public/Private (dependiendo de los requerimientos)
 * @query   page, limit, courseId, isActive
 */
router.get('/', 
  getCourseDiscountEventsValidation, 
  CourseDiscountEventController.getAllDiscountEvents
);

/**
 * @route   GET /api/course-discount-events/statistics
 * @desc    Obtener estadísticas de eventos de descuento
 * @access  Private (Admin)
 */
router.get('/statistics',
  CourseDiscountEventController.getDiscountStatistics
);

/**
 * @route   GET /api/course-discount-events/:id
 * @desc    Obtener un evento de descuento por ID
 * @access  Public/Private
 */
router.get('/:id', 
  getCourseDiscountEventByIdValidation,
  CourseDiscountEventController.getDiscountEventById
);

/**
 * @route   POST /api/course-discount-events
 * @desc    Crear un nuevo evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.post('/',
  createCourseDiscountEventValidation,
  CourseDiscountEventController.createDiscountEvent
);

/**
 * @route   PUT /api/course-discount-events/:id
 * @desc    Actualizar un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.put('/:id',
  updateCourseDiscountEventValidation,
  CourseDiscountEventController.updateDiscountEvent
);

/**
 * @route   DELETE /api/course-discount-events/:id
 * @desc    Eliminar un evento de descuento
 * @access  Private (Admin)
 */
router.delete('/:id',
  deleteCourseDiscountEventValidation,
  CourseDiscountEventController.deleteDiscountEvent
);

// ==================== RUTAS DE ACCIONES ESPECÍFICAS ====================

/**
 * @route   PATCH /api/course-discount-events/:id/activate
 * @desc    Activar un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.patch('/:id/activate',
  toggleDiscountEventValidation,
  CourseDiscountEventController.activateDiscountEvent
);

/**
 * @route   PATCH /api/course-discount-events/:id/deactivate
 * @desc    Desactivar un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.patch('/:id/deactivate',
  toggleDiscountEventValidation,
  CourseDiscountEventController.deactivateDiscountEvent
);

/**
 * @route   GET /api/course-discount-events/course/:courseId/active
 * @desc    Obtener descuentos activos para un curso específico
 * @access  Public
 */
router.get('/course/:courseId/active',
  getActiveDiscountsForCourseValidation,
  CourseDiscountEventController.getActiveDiscountsForCourse
);

// ==================== RUTAS DE ASOCIACIONES M:N ====================

/**
 * @route   POST /api/course-discount-events/:eventId/courses
 * @desc    Asociar cursos a un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.post('/:eventId/courses',
  addCoursesToDiscountEventValidation,
  CourseDiscountEventController.addCoursesToDiscountEvent
);

/**
 * @route   PUT /api/course-discount-events/:eventId/courses
 * @desc    Actualizar completamente las asociaciones de cursos de un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.put('/:eventId/courses',
  updateCoursesForDiscountEventValidation,
  CourseDiscountEventController.updateCoursesForDiscountEvent
);

/**
 * @route   DELETE /api/course-discount-events/:eventId/courses
 * @desc    Desasociar cursos de un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.delete('/:eventId/courses',
  removeCoursesFromDiscountEventValidation,
  CourseDiscountEventController.removeCoursesFromDiscountEvent
);

/**
 * @route   GET /api/course-discount-events/:eventId/courses
 * @desc    Obtener todos los cursos asociados a un evento de descuento
 * @access  Public/Private
 */
router.get('/:eventId/courses',
  getCoursesForDiscountEventValidation,
  CourseDiscountEventController.getCoursesForDiscountEvent
);

export default router;
