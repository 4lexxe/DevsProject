import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import CourseDiscountEvent from "../models/CourseDiscountEvent";

/**
 * Controlador para gestionar eventos de descuentos de cursos
 * Extiende BaseController para respuestas consistentes y métodos utilitarios
 */
class CourseDiscountEventController extends BaseController {

  /**
   * Lista todos los eventos de descuento con paginación
   */
  static getAllDiscountEvents = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleList(
      req,
      res,
      async (limit, offset) => {
        const events = await CourseDiscountEvent.findAll({
          limit,
          offset,
          order: [["createdAt", "DESC"]]
        });
        const total = await CourseDiscountEvent.count();
        
        return { items: events, total };
      },
      "Eventos de descuento obtenidos exitosamente"
    );
  });

  /**
   * Obtiene un evento de descuento por ID
   */
  static getDiscountEventById = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleGetById(
      req,
      res,
      "id",
      async (id) => {
        return await CourseDiscountEvent.findByPk(id);
      },
      "Evento de descuento"
    );
  });

  /**
   * Crea un nuevo evento de descuento
   */
  static createDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const { courseIds, ...eventData } = req.body;
      
      // Crear el evento de descuento
      const newEvent = await CourseDiscountEvent.create({
        ...eventData,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        isActive: eventData.isActive !== undefined ? eventData.isActive : true
      });

      // Si se proporcionaron IDs de cursos, asociarlos al evento
      if (courseIds && Array.isArray(courseIds) && courseIds.length > 0) {
        const Course = require("../../course/models/Course").default;
        
        // Verificar que todos los cursos existen
        const courses = await Course.findAll({
          where: { id: courseIds }
        });

        if (courses.length !== courseIds.length) {
          // Si algunos cursos no existen, eliminar el evento creado y devolver error
          await newEvent.destroy();
          this.validationFailed(res, req, { courseIds }, "Algunos cursos no fueron encontrados");
          return;
        }

        // Asociar los cursos al evento
        await (newEvent as any).addCourses(courses);
        
        // Recargar el evento con las asociaciones para la respuesta
        const eventWithCourses = await CourseDiscountEvent.findByPk(newEvent.id, {
          include: [
            {
              model: Course,
              as: "courses",
              attributes: ["id", "title"]
            }
          ]
        });

        this.created(res, req, eventWithCourses, "Evento de descuento creado y asociado a cursos exitosamente");
      } else {
        this.created(res, req, newEvent, "Evento de descuento creado exitosamente");
      }
    } catch (error) {
      this.handleServerError(res, req, error, "Error al crear el evento de descuento");
    }
  });

  /**
   * Actualiza un evento de descuento existente
   */
  static updateDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const id = this.getNumericParam(req, res, "id");
    if (!id) return;

    try {
      const { courseIds, ...eventData } = req.body;

      // Verificar que el evento existe
      const existingEvent = await CourseDiscountEvent.findByPk(id);
      if (!existingEvent) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      // Actualizar los datos del evento
      const [updatedRows] = await CourseDiscountEvent.update(
        {
          ...eventData,
          ...(eventData.startDate && { startDate: new Date(eventData.startDate) }),
          ...(eventData.endDate && { endDate: new Date(eventData.endDate) })
        },
        { where: { id } }
      );

      if (updatedRows === 0) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      // Si se proporcionaron IDs de cursos, actualizar las asociaciones
      if (courseIds !== undefined && Array.isArray(courseIds)) {
        const Course = require("../../course/models/Course").default;
        
        if (courseIds.length > 0) {
          // Verificar que todos los cursos existen
          const courses = await Course.findAll({
            where: { id: courseIds }
          });

          if (courses.length !== courseIds.length) {
            this.validationFailed(res, req, { courseIds }, "Algunos cursos no fueron encontrados");
            return;
          }

          // Reemplazar todas las asociaciones con las nuevas
          await (existingEvent as any).setCourses(courses);
        } else {
          // Si courseIds es un array vacío, remover todas las asociaciones
          await (existingEvent as any).setCourses([]);
        }
      }

      // Obtener el evento actualizado con las asociaciones
      const updatedEvent = await CourseDiscountEvent.findByPk(id, {
        include: [
          {
            model: require("../../course/models/Course").default,
            as: "courses",
            attributes: ["id", "title"]
          }
        ]
      });

      this.updated(res, req, updatedEvent, "Evento de descuento actualizado exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al actualizar el evento de descuento");
    }
  });

  /**
   * Elimina un evento de descuento
   */
  static deleteDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleDelete(
      req,
      res,
      "id",
      async (id) => {
        const deleted = await CourseDiscountEvent.destroy({
          where: { id }
        });
        return deleted > 0;
      },
      "Evento de descuento"
    );
  });

  /**
   * Activa un evento de descuento
   */
  static activateDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;
    
    const id = this.getNumericParam(req, res, "id");
    if (!id) return;

    try {
      const event = await CourseDiscountEvent.findByPk(id);
      if (!event) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      // Verificar que el evento no haya expirado
      if (new Date() > event.endDate) {
        this.validationFailed(res, req, 
          { reason: "expired" }, 
          "No se puede activar un evento expirado"
        );
        return;
      }

      await event.update({ isActive: true });
      
      this.updated(res, req, { id, isActive: true }, "Evento de descuento activado exitosamente");
      this.logActivity(req, "ACTIVATE", "DiscountEvent", { eventId: id });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al activar el evento de descuento");
    }
  });

  /**
   * Desactiva un evento de descuento
   */
  static deactivateDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;
    
    const id = this.getNumericParam(req, res, "id");
    if (!id) return;

    try {
      const event = await CourseDiscountEvent.findByPk(id);
      if (!event) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      await event.update({ isActive: false });
      
      this.updated(res, req, { id, isActive: false }, "Evento de descuento desactivado exitosamente");
      this.logActivity(req, "DEACTIVATE", "DiscountEvent", { eventId: id });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al desactivar el evento de descuento");
    }
  });

  /**
   * Obtiene eventos de descuento activos para un curso específico
   */
  static getActiveDiscountsForCourse = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;
    
    const courseId = this.getNumericParam(req, res, "courseId");
    if (!courseId) return;

    try {
      const { Op } = require("sequelize");
      const Course = require("../../course/models/Course").default;
      
      // Buscar el curso con sus eventos de descuento activos usando la relación M:N
      const courseWithDiscounts = await Course.findByPk(courseId, {
        include: [
          {
            model: CourseDiscountEvent,
            as: "discountEvents",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() }
            },
            required: false // LEFT JOIN para incluir curso sin descuentos
          }
        ]
      });

      if (!courseWithDiscounts) {
        this.notFound(res, req, "Curso");
        return;
      }

      const activeDiscounts = (courseWithDiscounts as any).discountEvents || [];
      
      // Ordenar por valor descendente
      activeDiscounts.sort((a: any, b: any) => b.value - a.value);
      
      this.sendSuccess(res, req, activeDiscounts, "Descuentos activos obtenidos exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener descuentos activos");
    }
  });

  /**
   * Asocia un evento de descuento con uno o múltiples cursos
   */
  static addCoursesToDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    const eventId = this.getNumericParam(req, res, "eventId");
    if (!eventId) return;

    if (!this.handleValidationErrors(req, res)) return;

    const { courseIds } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      this.validationFailed(res, req, { courseIds }, "Se requiere al menos un ID de curso válido");
      return;
    }

    try {
      const event = await CourseDiscountEvent.findByPk(eventId);
      if (!event) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      const Course = require("../../course/models/Course").default;
      
      // Verificar que todos los cursos existen
      const courses = await Course.findAll({
        where: { id: courseIds }
      });

      if (courses.length !== courseIds.length) {
        this.validationFailed(res, req, { courseIds }, "Algunos cursos no fueron encontrados");
        return;
      }

      // Asociar los cursos al evento de descuento
      await (event as any).addCourses(courses);

      this.sendSuccess(res, req, { 
        eventId, 
        associatedCourses: courses.length 
      }, "Cursos asociados al evento de descuento exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al asociar cursos al evento de descuento");
    }
  });

  /**
   * Desasocia cursos de un evento de descuento
   */
  static removeCoursesFromDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    const eventId = this.getNumericParam(req, res, "eventId");
    if (!eventId) return;

    if (!this.handleValidationErrors(req, res)) return;

    const { courseIds } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      this.validationFailed(res, req, { courseIds }, "Se requiere al menos un ID de curso válido");
      return;
    }

    try {
      const event = await CourseDiscountEvent.findByPk(eventId);
      if (!event) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      const Course = require("../../course/models/Course").default;
      
      // Verificar que los cursos existen
      const courses = await Course.findAll({
        where: { id: courseIds }
      });

      // Desasociar los cursos del evento de descuento
      await (event as any).removeCourses(courses);

      this.sendSuccess(res, req, { 
        eventId, 
        removedCourses: courses.length 
      }, "Cursos desasociados del evento de descuento exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al desasociar cursos del evento de descuento");
    }
  });

  /**
   * Actualiza completamente las asociaciones de cursos para un evento de descuento
   * Reemplaza todas las asociaciones existentes con las nuevas
   */
  static updateCoursesForDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    const eventId = this.getNumericParam(req, res, "eventId");
    if (!eventId) return;

    if (!this.handleValidationErrors(req, res)) return;

    const { courseIds } = req.body;

    if (!Array.isArray(courseIds)) {
      this.validationFailed(res, req, { courseIds }, "courseIds debe ser un array");
      return;
    }

    try {
      const event = await CourseDiscountEvent.findByPk(eventId);
      if (!event) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      const Course = require("../../course/models/Course").default;
      
      if (courseIds.length > 0) {
        // Verificar que todos los cursos existen
        const courses = await Course.findAll({
          where: { id: courseIds }
        });

        if (courses.length !== courseIds.length) {
          this.validationFailed(res, req, { courseIds }, "Algunos cursos no fueron encontrados");
          return;
        }

        // Reemplazar todas las asociaciones con las nuevas
        await (event as any).setCourses(courses);

        this.sendSuccess(res, req, { 
          eventId, 
          updatedCourses: courses.length 
        }, "Asociaciones de cursos actualizadas exitosamente");
      } else {
        // Si no hay cursos, remover todas las asociaciones
        await (event as any).setCourses([]);

        this.sendSuccess(res, req, { 
          eventId, 
          updatedCourses: 0 
        }, "Todas las asociaciones de cursos han sido removidas");
      }
    } catch (error) {
      this.handleServerError(res, req, error, "Error al actualizar asociaciones de cursos");
    }
  });

  /**
   * Obtiene todos los cursos asociados a un evento de descuento
   */
  static getCoursesForDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;
    
    const eventId = this.getNumericParam(req, res, "eventId");
    if (!eventId) return;

    try {
      const event = await CourseDiscountEvent.findByPk(eventId, {
        include: [
          {
            model: require("../../course/models/Course").default,
            as: "courses",
            attributes: ["id", "title", "price", "image", "summary", "isActive"]
          }
        ]
      });

      if (!event) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      const courses = (event as any).courses || [];
      
      this.sendSuccess(res, req, {
        event: {
          id: event.id,
          event: event.event,
          description: event.description,
          value: event.value,
          isActive: event.isActive
        },
        courses
      }, "Cursos del evento de descuento obtenidos exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener cursos del evento de descuento");
    }
  });

  /**
   * Obtiene estadísticas de eventos de descuento
   */
  static getDiscountStatistics = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const sequelize = require("sequelize");
      const stats = await CourseDiscountEvent.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalEvents'],
          [sequelize.fn('COUNT', sequelize.literal('CASE WHEN isActive = true THEN 1 END')), 'activeEvents'],
          [sequelize.fn('AVG', sequelize.col('value')), 'averageDiscount'],
          [sequelize.fn('MAX', sequelize.col('value')), 'maxDiscount']
        ],
        raw: true
      });

      this.sendSuccess(res, req, stats[0] || { totalEvents: 0, activeEvents: 0, averageDiscount: 0, maxDiscount: 0 }, "Estadísticas de descuentos obtenidas exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener estadísticas");
    }
  });
}

export default CourseDiscountEventController;
