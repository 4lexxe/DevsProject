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
   * Búsqueda avanzada de cursos con filtros adicionales
   * Endpoint: GET /api/search/courses/advanced?q=palabraClave&category=id&careerType=id&minPrice=100&maxPrice=500&page=1&limit=30
   */
  static advancedSearchCourses: RequestHandler = async (req, res) => {
    if (!CourseSearchController.handleValidationErrors(req, res)) return;

    try {
      const { q, category, careerType, minPrice, maxPrice, page, limit } = req.query;
      const searchTerm = q as string;
      
      // Validar parámetros usando el servicio
      const validation = CourseSearchService.validateSearchParams(searchTerm);
      if (!validation.isValid) {
        CourseSearchController.sendError(res, req, validation.error!, 400);
        return;
      }

      // Preparar opciones de búsqueda
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

      CourseSearchController.sendSuccess(
        res,
        req,
        searchResults,
        `Página ${searchResults.pagination.currentPage} de ${searchResults.pagination.totalPages} - ${searchResults.totalResults} resultados encontrados`
      );
      
    } catch (error) {
      CourseSearchController.handleServerError(
        res,
        req,
        error,
        "Error al realizar la búsqueda avanzada de cursos"
      );
    }
  };

  /**
   * Obtiene sugerencias de búsqueda
   * Endpoint: GET /api/search/courses/suggestions?q=jav
   */
  static getSearchSuggestions: RequestHandler = async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        CourseSearchController.sendError(res, req, "El término debe tener al menos 2 caracteres", 400);
        return;
      }

      const suggestions = await CourseSearchService.getSearchSuggestions(q.trim());

      CourseSearchController.sendSuccess(
        res,
        req,
        { suggestions, query: q.trim() },
        "Sugerencias obtenidas correctamente"
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