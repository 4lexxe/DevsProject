import { Router } from "express";
import CourseDiscountEventController from "../controllers/CourseDiscountEvent.controller";
import {
  createCourseDiscountEventValidation,
  updateCourseDiscountEventValidation,
  getCourseDiscountEventByIdValidation,
  deleteCourseDiscountEventValidation,
  getCourseDiscountEventsValidation,
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
  getCourseDiscountEventByIdValidation,
  CourseDiscountEventController.activateDiscountEvent
);

/**
 * @route   PATCH /api/course-discount-events/:id/deactivate
 * @desc    Desactivar un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.patch('/:id/deactivate',
  getCourseDiscountEventByIdValidation,
  CourseDiscountEventController.deactivateDiscountEvent
);

/**
 * @route   GET /api/course-discount-events/course/:courseId/active
 * @desc    Obtener descuentos activos para un curso específico
 * @access  Public
 */
router.get('/course/:courseId/active',
  getCourseDiscountEventByIdValidation,
  CourseDiscountEventController.getActiveDiscountsForCourse
);

export default router;
