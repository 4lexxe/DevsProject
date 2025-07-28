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
    await this.handleCreate(
      req,
      res,
      async (data) => {
        // Validar que las fechas sean válidas
        if (new Date(data.startDate) >= new Date(data.endDate)) {
          throw new Error("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        // Validar que el descuento esté en rango válido
        if (data.value < 0 || data.value > 100) {
          throw new Error("El valor del descuento debe estar entre 0 y 100");
        }

        return await CourseDiscountEvent.create({
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isActive: data.isActive !== undefined ? data.isActive : true
        });
      },
      "Evento de descuento",
      ["courseId", "value", "startDate", "endDate", "event", "description"]
    );
  });

  /**
   * Actualiza un evento de descuento existente
   */
  static updateDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleUpdate(
      req,
      res,
      "id",
      async (id, data) => {
        // Validaciones similares a la creación
        if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
          throw new Error("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        if (data.value !== undefined && (data.value < 0 || data.value > 100)) {
          throw new Error("El valor del descuento debe estar entre 0 y 100");
        }

        const [updatedRows] = await CourseDiscountEvent.update(
          {
            ...data,
            ...(data.startDate && { startDate: new Date(data.startDate) }),
            ...(data.endDate && { endDate: new Date(data.endDate) })
          },
          { where: { id } }
        );

        if (updatedRows === 0) {
          return null;
        }

        return await CourseDiscountEvent.findByPk(id);
      },
      "Evento de descuento"
    );
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
    const courseId = this.getNumericParam(req, res, "courseId");
    if (!courseId) return;

    try {
      const { Op } = require("sequelize");
      const activeDiscounts = await CourseDiscountEvent.findAll({
        where: {
          courseId,
          isActive: true,
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() }
        },
        order: [["value", "DESC"]]
      });
      
      this.sendSuccess(res, req, activeDiscounts, "Descuentos activos obtenidos exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener descuentos activos");
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
