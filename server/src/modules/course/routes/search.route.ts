import { Router } from 'express';
import CourseSearchController from '../controllers/courseSearch.controller';
import { validateBasicSearch, validateAdvancedSearch } from '../validators/searchValidation';

const router = Router();

/**
 * @route GET /api/search/courses
 * @desc Búsqueda básica de cursos con coincidencias parciales
 * @query q - Término de búsqueda (requerido)
 * @query page - Número de página (opcional, por defecto: 1)
 * @query limit - Elementos por página (opcional, por defecto: 30, máximo: 100)
 * @access Public
 * @example GET /api/search/courses?q=javascript&page=1&limit=30
 */
router.get('/search/courses', validateBasicSearch, CourseSearchController.searchCourses);

/**
 * @route GET /api/search/courses/advanced
 * @desc Búsqueda avanzada de cursos con filtros adicionales
 * @query q - Término de búsqueda (requerido)
 * @query page - Número de página (opcional, por defecto: 1)
 * @query limit - Elementos por página (opcional, por defecto: 30, máximo: 100)
 * @query category - ID de categoría (opcional)
 * @query careerType - ID de tipo de carrera (opcional)
 * @query minPrice - Precio mínimo (opcional)
 * @query maxPrice - Precio máximo (opcional)
 * @access Public
 * @example GET /api/search/courses/advanced?q=java&category=1&minPrice=50&maxPrice=200&page=2&limit=30
 */
router.get('/search/courses/advanced', validateAdvancedSearch, CourseSearchController.advancedSearchCourses);

/**
 * @route GET /api/search/courses/suggestions
 * @desc Obtiene sugerencias de búsqueda basadas en títulos de cursos
 * @query q - Término parcial para sugerencias (mínimo 2 caracteres)
 * @access Public
 * @example GET /api/search/courses/suggestions?q=jav
 */
router.get('/search/courses/suggestions', CourseSearchController.getSearchSuggestions);

export default router;