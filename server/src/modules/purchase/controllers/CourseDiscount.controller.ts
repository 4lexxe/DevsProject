import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import CourseDiscount from "../models/CourseDiscount";
import Course from "../../course/models/Course";

/**
 * Controlador para gestionar descuentos de cursos
 * Extiende BaseController para respuestas consistentes y métodos utilitarios
 */
class CourseDiscountController extends BaseController {

  /**
   * Lista todos los descuentos con paginación
   */
  static getAllDiscounts = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleList(
      req,
      res,
      async (limit, offset) => {
        const discounts = await CourseDiscount.findAll({
          limit,
          offset,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Course,
              as: "courses",
              attributes: ["id", "title"]
            }
          ]
        });
        const total = await CourseDiscount.count();
        
        return { items: discounts, total };
      },
      "Descuentos obtenidos exitosamente"
    );
  });

  /**
   * Obtiene un descuento por ID
   */
  static getDiscountById = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleGetById(
      req,
      res,
      "id",
      async (id) => {
        return await CourseDiscount.findByPk(id, {
          include: [
            {
              model: Course,
              as: "courses",
              attributes: ["id", "title"]
            }
          ]
        });
      },
      "Descuento"
    );
  });

  /**
   * Crea un nuevo descuento
   */
  static createDiscount = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const discountData = req.body;
      console.log("Esta es la data que llega: ", discountData);

      // Si el descuento está activo y se especificaron cursos, validar que no tengan descuentos activos
      if (discountData.isActive && discountData.courseIds && Array.isArray(discountData.courseIds)) {
        const coursesWithActiveDiscounts = await Course.findAll({
          where: {
            id: discountData.courseIds,
            courseDiscountId: { [require("sequelize").Op.not]: null }
          },
          include: [
            {
              model: CourseDiscount,
              as: "courseDiscount",
              where: { isActive: true },
              attributes: ["id", "event", "value"]
            }
          ]
        });

        if (coursesWithActiveDiscounts.length > 0) {
          const coursesWithDiscounts = coursesWithActiveDiscounts.map(course => ({
            id: course.id,
            title: course.title,
            discount: (course as any).courseDiscount
          }));

          return this.sendError(res, req, 
            `Los siguientes cursos ya tienen descuentos activos: ${coursesWithDiscounts.map(c => `${c.title} (${c.discount.event})`).join(', ')}`,
            400,
            { coursesWithActiveDiscounts: coursesWithDiscounts }
          );
        }
      }

      // Crear el descuento
      const newDiscount = await CourseDiscount.create({
        ...discountData,
        startDate: new Date(discountData.startDate.getFullYear(), discountData.startDate.getMonth(), discountData.startDate.getDate()),
        endDate: new Date(discountData.endDate.getFullYear(), discountData.endDate.getMonth(), discountData.endDate.getDate()),
        isActive: discountData.isActive !== undefined ? discountData.isActive : false
      });

      // Si el descuento está activo y se especificaron cursos, actualizar las relaciones
      if (newDiscount.isActive && discountData.courseIds && Array.isArray(discountData.courseIds)) {
        const courses = await Course.findAll({
          where: {
            id: discountData.courseIds
          }
        });

        // Actualizar cada curso para asociarlo con este descuento
        for (const course of courses) {
          await course.update({
            courseDiscountId: newDiscount.id
          });
        }
      }

      // Obtener el descuento con los cursos asociados
      const discountWithCourses = await CourseDiscount.findByPk(newDiscount.id, {
        include: [
          {
            model: Course,
            as: "courses",
            attributes: ["id", "title"]
          }
        ]
      });

      this.created(res, req, discountWithCourses, "Descuento creado exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al crear el descuento");
    }
  });

  /**
   * Actualiza un descuento existente
   */
  static updateDiscount = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;

    const id = this.getNumericParam(req, res, "id");
    if (!id) return;

    try {
      const discountData = req.body;

      // Verificar que el descuento existe
      const existingDiscount = await CourseDiscount.findByPk(id);
      if (!existingDiscount) {
        this.notFound(res, req, "Descuento");
        return;
      }

      // Si el descuento está activo y se especificaron cursos, validar que no tengan descuentos activos
      if (discountData.isActive && discountData.courseIds && Array.isArray(discountData.courseIds)) {
        const coursesWithActiveDiscounts = await Course.findAll({
          where: {
            id: discountData.courseIds,
            courseDiscountId: { 
              [require("sequelize").Op.and]: [
                { [require("sequelize").Op.not]: null },
                { [require("sequelize").Op.ne]: id } // Excluir el descuento actual
              ]
            }
          },
          include: [
            {
              model: CourseDiscount,
              as: "courseDiscount",
              where: { isActive: true },
              attributes: ["id", "event", "value"]
            }
          ]
        });

        if (coursesWithActiveDiscounts.length > 0) {
          const coursesWithDiscounts = coursesWithActiveDiscounts.map(course => ({
            id: course.id,
            title: course.title,
            discount: (course as any).courseDiscount
          }));

          return this.sendError(res, req, 
            `Los siguientes cursos ya tienen descuentos activos: ${coursesWithDiscounts.map(c => `${c.title} (${c.discount.event})`).join(', ')}`,
            400,
            { coursesWithActiveDiscounts: coursesWithDiscounts }
          );
        }
      }

      // Si el descuento se está desactivando, remover la relación de todos los cursos asociados
      if (existingDiscount.isActive && discountData.isActive === false) {
        await Course.update(
          { courseDiscountId: null },
          { where: { courseDiscountId: id } }
        );
      }

      // Actualizar los datos del descuento
      const updateData: any = {
        ...discountData
      };

      // Solo actualizar fechas si se proporcionan, manejando timezone correctamente
      if (discountData.startDate) {
        const startDate = new Date(discountData.startDate);
        updateData.startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      }
      if (discountData.endDate) {
        const endDate = new Date(discountData.endDate);
        updateData.endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      }

      const [updatedRows] = await CourseDiscount.update(
        updateData,
        { where: { id } }
      );

      if (updatedRows === 0) {
        this.notFound(res, req, "Descuento");
        return;
      }

      // Si el descuento está activo y se especificaron cursos, actualizar las relaciones
      if (discountData.isActive && discountData.courseIds && Array.isArray(discountData.courseIds)) {
        // Primero, remover la relación de cursos que ya no están en la lista
        await Course.update(
          { courseDiscountId: null },
          { where: { courseDiscountId: id } }
        );

        // Luego, asociar los nuevos cursos
        const courses = await Course.findAll({
          where: {
            id: discountData.courseIds
          }
        });

        for (const course of courses) {
          await course.update({
            courseDiscountId: id
          });
        }
      }

      // Obtener el descuento actualizado
      const updatedDiscount = await CourseDiscount.findByPk(id, {
        include: [
          {
            model: Course,
            as: "courses",
            attributes: ["id", "title"]
          }
        ]
      });

      this.updated(res, req, updatedDiscount, "Descuento actualizado exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al actualizar el descuento");
    }
  });

  /**
   * Elimina un descuento
   * La eliminación en cascada está configurada para establecer courseDiscountId en NULL automáticamente
   */
  static deleteDiscount = this.asyncHandler(async (req: Request, res: Response) => {
    await this.handleDelete(
      req,
      res,
      "id",
      async (id) => {
        // La base de datos manejará automáticamente SET NULL en Course.courseDiscountId
        const deleted = await CourseDiscount.destroy({
          where: { id }
        });
        return deleted > 0;
      },
      "Descuento"
    );
  });

  /**
   * Obtiene el descuento activo para un curso específico
   */
  static getActiveDiscountForCourse = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;
    
    const courseId = this.getNumericParam(req, res, "courseId");
    if (!courseId) return;

    try {
      const { Op } = require("sequelize");
      
      // Buscar el curso con su descuento activo usando la relación 1:M
      const courseWithDiscount = await Course.findByPk(courseId, {
        include: [
          {
            model: CourseDiscount,
            as: "courseDiscount",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() }
            },
            required: false // LEFT JOIN para incluir curso sin descuento
          }
        ]
      });

      if (!courseWithDiscount) {
        this.notFound(res, req, "Curso");
        return;
      }

      const activeDiscount = (courseWithDiscount as any).courseDiscount || null;
      
      this.sendSuccess(res, req, activeDiscount, "Descuento activo obtenido exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener descuento activo");
    }
  });

  /**
   * Obtiene los cursos asociados a un evento de descuento
   */
  static getCoursesForDiscountEvent = this.asyncHandler(async (req: Request, res: Response) => {
    if (!this.handleValidationErrors(req, res)) return;
    
    const eventId = this.getNumericParam(req, res, "id");
    if (!eventId) return;

    try {
      // Verificar que el evento de descuento existe
      const discountEvent = await CourseDiscount.findByPk(eventId);
      if (!discountEvent) {
        this.notFound(res, req, "Evento de descuento");
        return;
      }

      // Obtener los cursos asociados al evento de descuento
      const courses = await Course.findAll({
        where: {
          courseDiscountId: eventId
        },
        attributes: ["id", "title", "price", "image", "isActive"],
        include: [
          {
            model: CourseDiscount,
            as: "courseDiscount",
            attributes: ["id", "event", "value", "startDate", "endDate", "isActive"]
          }
        ]
      });

      this.sendSuccess(res, req, { courses }, "Cursos del evento de descuento obtenidos exitosamente");
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener cursos del evento de descuento");
    }
  });

}

export default CourseDiscountController;
