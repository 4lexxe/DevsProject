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
 * @desc Búsqueda unificada de cursos (combina automáticamente búsqueda tradicional, inteligente y fuzzy)
 * @query q - Término de búsqueda (acepta errores ortográficos, espacios, texto incompleto)
 * @query page - Número de página (opcional, por defecto: 1)
 * @query limit - Elementos por página (opcional, por defecto: 30, máximo: 100)
 * @query category - ID de categoría (opcional)
 * @query careerType - ID de tipo de carrera (opcional)
 * @query minPrice - Precio mínimo (opcional)
 * @query maxPrice - Precio máximo (opcional)
 * @access Public
 * @example GET /api/search/courses/advanced?q=javascrpt&category=1&minPrice=0&maxPrice=100
 */
router.get('/search/courses/advanced', validateAdvancedSearch, CourseSearchController.advancedSearchCourses);

/**
 * @route GET /api/search/courses/fuzzy
 * @desc Búsqueda fuzzy específica con corrección de errores tipográficos
 * @query q - Término de búsqueda (requerido, puede contener errores tipográficos)
 * @query threshold - Umbral de similitud (opcional, por defecto: 0.3, rango: 0.0-1.0)
 * @query page - Número de página (opcional, por defecto: 1)
 * @query limit - Elementos por página (opcional, por defecto: 30)
 * @access Public
 * @example GET /api/search/courses/fuzzy?q=javascrpt&threshold=0.3&page=1&limit=30
 */
router.get('/search/courses/fuzzy', CourseSearchController.fuzzySearchCourses);

/**
 * @route GET /api/search/courses/statistics
 * @desc Obtiene estadísticas de rendimiento de las estructuras de búsqueda
 * @access Public
 * @example GET /api/search/courses/statistics
 */
router.get('/search/courses/statistics', CourseSearchController.getSearchStatistics);

/**
 * @route GET /api/search/courses/suggestions
 * @desc Obtiene sugerencias de búsqueda basadas en títulos de cursos
 * @query q - Término parcial para sugerencias (mínimo 2 caracteres)
 * @access Public
 * @example GET /api/search/courses/suggestions?q=jav
 */
router.get('/search/courses/suggestions', CourseSearchController.getSearchSuggestions);

export default router;