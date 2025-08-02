import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Interfaces para garantizar consistencia en las respuestas
 */
interface APIResponse<T = any> {
  statusCode: number;
  url: string;
  method: string;
  timestamp: string;
  requestId: string;
  userAgent?: string;
  ip?: string;
  status: "success" | "error";
  message: string;
  data?: T;
  errors?: any;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ControllerMethod {
  (req: Request, res: Response, next?: NextFunction): Promise<void> | void;
}

/**
 * Clase base para controladores del módulo de compras
 * Proporciona métodos comunes para manejo de respuestas, errores y validaciones
 * Garantiza respuestas consistentes y simplifica el desarrollo de controladores
 */
export abstract class BaseController {
  /**
   * Genera metadata común para las respuestas (SIEMPRE CONSISTENTE)
   * @param req - Request de Express
   * @param res - Response de Express
   * @returns Objeto con metadata de la petición
   */
  private static metadata(req: Request, res: Response) {
    const host = req.get("host") || "localhost";
    const protocol = req.get("x-forwarded-proto") || req.protocol;
    const requestIdHeader = req.headers["x-request-id"];
    const requestId = Array.isArray(requestIdHeader) ? requestIdHeader[0] : requestIdHeader;
    
    return {
      statusCode: res.statusCode,
      url: `${protocol}://${host}${req.originalUrl}`,
      method: req.method,
      timestamp: new Date().toISOString(),
      requestId: requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userAgent: req.get("user-agent"),
      ip: req.ip || req.connection.remoteAddress,
    };
  }

  /**
   * Método base para enviar respuestas - GARANTIZA CONSISTENCIA TOTAL
   * @param res - Response de Express
   * @param req - Request de Express
   * @param status - Status de la respuesta
   * @param message - Mensaje
   * @param statusCode - Código HTTP
   * @param data - Datos (opcional)
   * @param errors - Errores (opcional)
   * @param pagination - Información de paginación (opcional)
   */
  private static sendResponse<T>(
    res: Response,
    req: Request,
    status: "success" | "error",
    message: string,
    statusCode: number,
    data?: T,
    errors?: any,
    pagination?: any
  ): void {
    const response: APIResponse<T> = {
      ...this.metadata(req, res),
      status,
      message,
    };

    // Solo agregar propiedades si tienen valor (respuesta limpia)
    if (data !== undefined && data !== null) {
      response.data = data;
    }

    if (errors !== undefined && errors !== null) {
      response.errors = errors;
    }

    if (pagination !== undefined && pagination !== null) {
      response.pagination = pagination;
    }

    res.status(statusCode).json(response);
  }

  /**
   * Maneja errores de validación usando express-validator
   * @param req - Request de Express
   * @param res - Response de Express
   * @returns true si no hay errores, false si hay errores
   */
  protected static handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      // Agrupar errores por campo para mejor legibilidad
      const groupedErrors = errors.array().reduce((acc: any, error: any) => {
        const field = error.path || error.param || 'unknown';
        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push({
          message: error.msg,
          value: error.value,
          location: error.location
        });
        return acc;
      }, {});

      this.sendResponse(
        res,
        req,
        "error",
        "Error de validaciones",
        400,
        null,
        {
          count: errors.array().length,
          details: groupedErrors,
          raw: errors.array()
        }
      );
      return false;
    }
    return true;
  }

  /**
   * Maneja errores internos del servidor
   * @param res - Response de Express
   * @param req - Request de Express
   * @param error - Error capturado
   * @param message - Mensaje personalizado del error
   * @param includeStack - Si incluir el stack trace en desarrollo (por defecto false)
   */
  protected static handleServerError(
    res: Response,
    req: Request,
    error: any,
    message: string,
    includeStack: boolean = false
  ) {
    // Log detallado del error para debugging
    console.error(`[${new Date().toISOString()}] ${message}:`, {
      error: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers,
      userAgent: req.get("user-agent"),
      ip: req.ip
    });

    // Preparar detalles del error
    const errorDetails: any = {
      type: error.name || "ServerError",
      message: error.message,
      timestamp: new Date().toISOString()
    };

    // En desarrollo, incluir más detalles del error
    if (process.env.NODE_ENV === "development" || includeStack) {
      errorDetails.stack = error.stack;
      errorDetails.details = {
        code: error.code,
        errno: error.errno,
        syscall: error.syscall
      };
    }

    this.sendResponse(res, req, "error", message, 500, null, errorDetails);
  }

  // ==================== MÉTODOS DE RESPUESTA SIMPLIFICADOS ====================

  /**
   * Respuesta exitosa estándar - CONSISTENTE
   * @param res - Response de Express
   * @param req - Request de Express
   * @param data - Datos a enviar en la respuesta
   * @param message - Mensaje personalizado
   * @param statusCode - Código de estado HTTP (por defecto 200)
   */
  protected static sendSuccess<T>(
    res: Response,
    req: Request,
    data?: T,
    message: string = "Operación exitosa",
    statusCode: number = 200
  ): void {
    this.sendResponse(res, req, "success", message, statusCode, data);
  }

  /**
   * Respuesta de error estándar - CONSISTENTE
   * @param res - Response de Express
   * @param req - Request de Express
   * @param message - Mensaje de error
   * @param statusCode - Código de estado HTTP
   * @param errors - Errores específicos (opcional)
   */
  protected static sendError(
    res: Response,
    req: Request,
    message: string,
    statusCode: number = 400,
    errors?: any
  ): void {
    this.sendResponse(res, req, "error", message, statusCode, null, errors);
  }

  /**
   * Respuesta paginada - CONSISTENTE
   * @param res - Response de Express
   * @param req - Request de Express
   * @param items - Datos paginados
   * @param total - Total de registros
   * @param page - Página actual
   * @param limit - Límite por página
   * @param message - Mensaje personalizado
   */
  protected static sendPaginated<T>(
    res: Response,
    req: Request,
    items: T[],
    total: number,
    page: number,
    limit: number,
    message: string = "Datos obtenidos exitosamente"
  ): void {
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    this.sendResponse(res, req, "success", message, 200, items, null, pagination);
  }

  // ==================== MÉTODOS DE RESPUESTA RÁPIDOS ====================

  /**
   * Respuesta de recurso creado (201) - SIMPLIFICADO
   */
  protected static created<T>(res: Response, req: Request, data: T, message: string = "Recurso creado exitosamente"): void {
    this.sendSuccess(res, req, data, message, 201);
  }

  /**
   * Respuesta de recurso actualizado - SIMPLIFICADO
   */
  protected static updated<T>(res: Response, req: Request, data: T, message: string = "Recurso actualizado exitosamente"): void {
    this.sendSuccess(res, req, data, message, 200);
  }

  /**
   * Respuesta de recurso eliminado - SIMPLIFICADO
   */
  protected static deleted(res: Response, req: Request, message: string = "Recurso eliminado exitosamente"): void {
    this.sendSuccess(res, req, null, message, 200);
  }

  /**
   * Respuesta de recurso no encontrado (404) - SIMPLIFICADO
   */
  protected static notFound(res: Response, req: Request, resource: string = "Recurso"): void {
    this.sendError(res, req, `${resource} no encontrado`, 404);
  }

  /**
   * Respuesta de error de autorización (401) - SIMPLIFICADO
   */
  protected static unauthorized(res: Response, req: Request, message: string = "No autorizado"): void {
    this.sendError(res, req, message, 401);
  }

  /**
   * Respuesta de acceso prohibido (403) - SIMPLIFICADO
   */
  protected static forbidden(res: Response, req: Request, message: string = "Acceso prohibido"): void {
    this.sendError(res, req, message, 403);
  }

  /**
   * Respuesta de conflicto (409) - SIMPLIFICADO
   */
  protected static conflict(res: Response, req: Request, message: string = "Conflicto de datos"): void {
    this.sendError(res, req, message, 409);
  }

  /**
   * Respuesta de validación fallida (422) - SIMPLIFICADO
   */
  protected static validationFailed(res: Response, req: Request, errors: any, message: string = "Datos de entrada inválidos"): void {
    this.sendError(res, req, message, 422, errors);
  }

  // ==================== UTILIDADES Y HELPERS ====================

  /**
   * Wrapper para ejecutar funciones async con manejo de errores automático
   * SIMPLIFICA: No necesitas try-catch en cada método
   */
  protected static asyncHandler(fn: ControllerMethod) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch((error) => {
        this.handleServerError(res, req, error, "Error interno del servidor");
      });
    };
  }

  /**
   * Extrae y valida parámetros de paginación
   * SIMPLIFICA: Parámetros de paginación listos para usar
   */
  protected static getPaginationParams(req: Request, maxLimit: number = 100) {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), maxLimit);
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Valida campos requeridos en el body
   * SIMPLIFICA: Validación rápida de campos obligatorios
   */
  protected static requireFields(req: Request, res: Response, fields: string[]): boolean {
    const missing = fields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      this.validationFailed(res, req, {
        missingFields: missing,
        providedFields: Object.keys(req.body)
      }, "Campos requeridos faltantes");
      return false;
    }
    return true;
  }

  /**
   * Valida y parsea parámetro numérico de URL
   * SIMPLIFICA: Validación automática de IDs
   */
  protected static getNumericParam(req: Request, res: Response, paramName: string): number | null {
    const param = req.params[paramName];
    const parsed = parseInt(param, 10);

    if (isNaN(parsed) || parsed <= 0) {
      this.sendError(res, req, `Parámetro '${paramName}' debe ser un número válido mayor a 0`, 400);
      return null;
    }
    return parsed;
  }

  /**
   * Extrae información del usuario autenticado
   * SIMPLIFICA: Acceso rápido a datos del usuario
   */
  protected static getUser(req: Request): any | null {
    return (req as any).user || null;
  }

  /**
   * Extrae ID del usuario autenticado
   * SIMPLIFICA: Acceso directo al ID del usuario
   */
  protected static getUserId(req: Request): number | string | null {
    const user = this.getUser(req);
    return user?.id || null;
  }

  /**
   * Verifica si el usuario está autenticado
   * SIMPLIFICA: Verificación rápida de autenticación
   */
  protected static requireAuth(req: Request, res: Response): boolean {
    const user = this.getUser(req);
    if (!user) {
      this.unauthorized(res, req, "Debe estar autenticado para acceder a este recurso");
      return false;
    }
    return true;
  }

  /**
   * Manejo simplificado de operaciones CRUD
   * SIMPLIFICA: Patrón común para operaciones de base de datos
   */
  protected static async handleCrudOperation<T>(
    req: Request,
    res: Response,
    operation: () => Promise<T>,
    successMessage: string,
    errorMessage: string = "Error en la operación"
  ): Promise<void> {
    try {
      const result = await operation();
      
      if (!result) {
        this.notFound(res, req);
        return;
      }

      this.sendSuccess(res, req, result, successMessage);
    } catch (error) {
      this.handleServerError(res, req, error, errorMessage);
    }
  }

  /**
   * Logging de actividades para auditoría
   * SIMPLIFICA: Log estructurado automático
   */
  protected static logActivity(req: Request, action: string, resource: string, details?: any): void {
    const user = this.getUser(req);
    const logData = {
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      action,
      resource,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      url: req.originalUrl,
      method: req.method,
      details
    };

    console.log(`[USER_ACTIVITY]`, JSON.stringify(logData));
  }

  // ==================== MÉTODOS DE CONVENIENCIA PARA CONTROLADORES ====================

  /**
   * Manejo estándar de listado con paginación
   * SIMPLIFICA: Listados paginados en una línea
   */
  protected static async handleList<T>(
    req: Request,
    res: Response,
    fetcher: (limit: number, offset: number) => Promise<{ items: T[], total: number }>,
    message: string = "Datos obtenidos exitosamente"
  ): Promise<void> {
    try {
      const { page, limit, offset } = this.getPaginationParams(req);
      const { items, total } = await fetcher(limit, offset);
      
      this.sendPaginated(res, req, items, total, page, limit, message);
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener la lista de datos");
    }
  }

  /**
   * Manejo estándar de obtención por ID
   * SIMPLIFICA: Obtener recurso por ID en una línea
   */
  protected static async handleGetById<T>(
    req: Request,
    res: Response,
    paramName: string,
    fetcher: (id: number) => Promise<T | null>,
    resourceName: string = "Recurso",
    message?: string
  ): Promise<void> {
    const id = this.getNumericParam(req, res, paramName);
    if (!id) return;

    await this.handleCrudOperation(
      req,
      res,
      () => fetcher(id),
      message || `${resourceName} obtenido exitosamente`,
      `Error al obtener ${resourceName.toLowerCase()}`
    );
  }

  /**
   * Manejo estándar de creación
   * SIMPLIFICA: Creación de recursos en una línea
   */
  protected static async handleCreate<T>(
    req: Request,
    res: Response,
    creator: (data: any) => Promise<T>,
    resourceName: string = "Recurso",
    requiredFields?: string[]
  ): Promise<void> {
    // Validar campos requeridos si se especifican
    if (requiredFields && !this.requireFields(req, res, requiredFields)) {
      return;
    }

    // Validar errores de express-validator
    if (!this.handleValidationErrors(req, res)) {
      return;
    }

    try {
      const result = await creator(req.body);
      this.created(res, req, result, `${resourceName} creado exitosamente`);
      this.logActivity(req, 'CREATE', resourceName, { data: req.body });
    } catch (error) {
      this.handleServerError(res, req, error, `Error al crear ${resourceName.toLowerCase()}`);
    }
  }

  /**
   * Manejo estándar de actualización
   * SIMPLIFICA: Actualización de recursos en una línea
   */
  protected static async handleUpdate<T>(
    req: Request,
    res: Response,
    paramName: string,
    updater: (id: number, data: any) => Promise<T | null>,
    resourceName: string = "Recurso"
  ): Promise<void> {
    const id = this.getNumericParam(req, res, paramName);
    if (!id) return;

    // Validar errores de express-validator
    if (!this.handleValidationErrors(req, res)) {
      return;
    }

    await this.handleCrudOperation(
      req,
      res,
      () => updater(id, req.body),
      `${resourceName} actualizado exitosamente`,
      `Error al actualizar ${resourceName.toLowerCase()}`
    );

    this.logActivity(req, 'UPDATE', resourceName, { id, data: req.body });
  }

  /**
   * Manejo estándar de eliminación
   * SIMPLIFICA: Eliminación de recursos en una línea
   */
  protected static async handleDelete(
    req: Request,
    res: Response,
    paramName: string,
    deleter: (id: number) => Promise<boolean>,
    resourceName: string = "Recurso"
  ): Promise<void> {
    const id = this.getNumericParam(req, res, paramName);
    if (!id) return;

    try {
      const deleted = await deleter(id);
      
      if (!deleted) {
        this.notFound(res, req, resourceName);
        return;
      }

      this.deleted(res, req, `${resourceName} eliminado exitosamente`);
      this.logActivity(req, 'DELETE', resourceName, { id });
    } catch (error) {
      this.handleServerError(res, req, error, `Error al eliminar ${resourceName.toLowerCase()}`);
    }
  }
}
