import { Request, Response, RequestHandler } from "express";
import { BaseController } from "./BaseController";
import { CourseSearchService } from "../services/searchService";

export default class CourseSearchController extends BaseController {
  
  /**
   * Búsqueda de cursos con coincidencias parciales
   * Endpoint: GET /api/search/courses?q=palabraClave&page=1&limit=30
   */
  static searchCourses: RequestHandler = async (req, res) => {
    if (!CourseSearchController.handleValidationErrors(req, res)) return;

    try {
      const { q, page, limit } = req.query;
      const searchTerm = q as string;
      const pageNumber = page ? parseInt(page as string) : 1;
      const limitNumber = limit ? parseInt(limit as string) : 30;
      
      // Validar parámetros usando el servicio
      const validation = CourseSearchService.validateSearchParams(searchTerm);
      if (!validation.isValid) {
        CourseSearchController.sendError(res, req, validation.error!, 400);
        return;
      }

      // Realizar búsqueda usando el servicio
      const searchResults = await CourseSearchService.basicSearch(searchTerm.trim(), pageNumber, limitNumber);

      CourseSearchController.sendSuccess(
        res, 
        req, 
        searchResults, 
        `Página ${searchResults.pagination.currentPage} de ${searchResults.pagination.totalPages} - ${searchResults.totalResults} cursos encontrados para: "${searchResults.searchTerm}"`
      );
      
    } catch (error) {
      CourseSearchController.handleServerError(
        res, 
        req, 
        error, 
        "Error al realizar la búsqueda de cursos"
      );
    }
  };

  /**
   * Búsqueda unificada de cursos (combina tradicional, inteligente y fuzzy automáticamente)
   * Endpoint: GET /api/search/courses/advanced?q=palabraClave&category=id&careerType=id&minPrice=100&maxPrice=500&page=1&limit=30
   */
  static advancedSearchCourses: RequestHandler = async (req, res) => {
    if (!CourseSearchController.handleValidationErrors(req, res)) return;

    try {
      const { 
        q, 
        category, 
        careerType, 
        minPrice, 
        maxPrice, 
        page, 
        limit
      } = req.query;
      
      const searchTerm = q as string;
      
      // Validar parámetros usando el servicio
      const validation = CourseSearchService.validateSearchParams(searchTerm);
      if (!validation.isValid) {
        CourseSearchController.sendError(res, req, validation.error!, 400);
        return;
      }

      // Preparar opciones de búsqueda simplificadas
      const searchOptions = {
        searchTerm: searchTerm.trim(),
        categoryId: category ? parseInt(category as string) : undefined,
        careerTypeId: careerType ? parseInt(careerType as string) : undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 30,
        onlyActive: true
      };

      // Realizar búsqueda avanzada usando el servicio
      const searchResults = await CourseSearchService.advancedSearch(searchOptions);

      // Mensaje simplificado
      const searchTime = searchResults.searchMetadata?.searchTime || 0;
      
      CourseSearchController.sendSuccess(
        res,
        req,
        searchResults,
        `Se encontraron ${searchResults.totalResults} cursos. Tiempo de búsqueda: ${searchTime}ms.`
      );
      
    } catch (error) {
      CourseSearchController.handleServerError(
        res,
        req,
        error,
        "Error al realizar la búsqueda de cursos"
      );
    }
  };

  /**
   * Búsqueda fuzzy específica con corrección de errores tipográficos
   * Endpoint: GET /api/search/courses/fuzzy?q=javascrpt&threshold=0.3&page=1&limit=30
   */
  static fuzzySearchCourses: RequestHandler = async (req, res) => {
    if (!CourseSearchController.handleValidationErrors(req, res)) return;

    try {
      const { q, threshold, page, limit } = req.query;
      const searchTerm = q as string;
      
      // Validar parámetros
      const validation = CourseSearchService.validateSearchParams(searchTerm);
      if (!validation.isValid) {
        CourseSearchController.sendError(res, req, validation.error!, 400);
        return;
      }

      // Preparar opciones específicas para fuzzy search
      const searchOptions = {
        searchTerm: searchTerm.trim(),
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 30,
        onlyActive: true,
        useFuzzySearch: true,
        fuzzyThreshold: threshold ? parseFloat(threshold as string) : 0.3
      };

      const searchResults = await CourseSearchService.fuzzySearch(searchOptions);

      CourseSearchController.sendSuccess(
        res,
        req,
        searchResults,
        `Búsqueda fuzzy completada en ${searchResults.searchMetadata?.searchTime}ms - ${searchResults.totalResults} resultados con corrección de errores`
      );
      
    } catch (error) {
      CourseSearchController.handleServerError(
        res,
        req,
        error,
        "Error al realizar la búsqueda fuzzy"
      );
    }
  };

  /**
   * Obtiene estadísticas de rendimiento de búsqueda
   * Endpoint: GET /api/search/courses/statistics
   */
  static getSearchStatistics: RequestHandler = async (req, res) => {
    try {
      const statistics = CourseSearchService.getSearchStatistics();

      CourseSearchController.sendSuccess(
        res,
        req,
        statistics,
        "Estadísticas de rendimiento de búsqueda obtenidas exitosamente"
      );
      
    } catch (error) {
      CourseSearchController.handleServerError(
        res,
        req,
        error,
        "Error al obtener estadísticas de búsqueda"
      );
    }
  };

  /**
   * Obtiene sugerencias de búsqueda mejoradas
   * Endpoint: GET /api/search/courses/suggestions?q=jav
   */
  static getSearchSuggestions: RequestHandler = async (req, res) => {
    if (!CourseSearchController.handleValidationErrors(req, res)) return;

    try {
      const { q, limit } = req.query;
      const partialTerm = q as string;
      const limitNumber = limit ? parseInt(limit as string) : 10;
      
      if (!partialTerm || partialTerm.trim().length < 2) {
        CourseSearchController.sendError(res, req, "El término de búsqueda debe tener al menos 2 caracteres", 400);
        return;
      }

      const suggestions = await CourseSearchService.getSearchSuggestions(partialTerm.trim(), limitNumber);

      CourseSearchController.sendSuccess(
        res,
        req,
        { suggestions },
        `${suggestions.length} sugerencias encontradas para: "${partialTerm}"`
      );
      
    } catch (error) {
      CourseSearchController.handleServerError(
        res,
        req,
        error,
        "Error al obtener sugerencias de búsqueda"
      );
    }
  };
}