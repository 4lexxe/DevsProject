import { Router } from "express";
import CourseDiscountController from "../controllers/CourseDiscount.controller";
import {
  createCourseDiscountEventValidation,
  updateCourseDiscountEventValidation,
  getCourseDiscountEventByIdValidation,
  deleteCourseDiscountEventValidation,
  getCourseDiscountEventsValidation,
  getActiveDiscountForCourseValidation,
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
  CourseDiscountController.getAllDiscounts
);

/**
 * @route   GET /api/course-discount-events/:id
 * @desc    Obtener un evento de descuento por ID
 * @access  Public/Private
 */
router.get('/:id', 
  getCourseDiscountEventByIdValidation,
  CourseDiscountController.getDiscountById
);

/**
 * @route   POST /api/course-discount-events
 * @desc    Crear un nuevo evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.post('/',
  createCourseDiscountEventValidation,
  CourseDiscountController.createDiscount
);

/**
 * @route   PUT /api/course-discount-events/:id
 * @desc    Actualizar un evento de descuento
 * @access  Private (Admin/Content Manager)
 */
router.put('/:id',
  updateCourseDiscountEventValidation,
  CourseDiscountController.updateDiscount
);

/**
 * @route   DELETE /api/course-discount-events/:id
 * @desc    Eliminar un evento de descuento
 * @access  Private (Admin)
 */
router.delete('/:id',
  deleteCourseDiscountEventValidation,
  CourseDiscountController.deleteDiscount
);

// ==================== RUTAS ESPECIALES ====================

/**
 * @route   GET /api/course-discount-events/:id/courses
 * @desc    Obtener los cursos asociados a un evento de descuento
 * @access  Public
 */
router.get('/:id/courses',
  CourseDiscountController.getCoursesForDiscountEvent
);

/**
 * @route   GET /api/course-discount-events/course/:courseId/active
 * @desc    Obtener el descuento activo para un curso específico
 * @access  Public
 */
router.get('/course/:courseId/active',
  getActiveDiscountForCourseValidation,
  CourseDiscountController.getActiveDiscountForCourse
);


export default router;
