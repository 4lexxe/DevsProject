import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Subscription from "../models/Subscription";
import Plan from "../models/Plan";
import User from "../../user/User";

interface SubscriptionData {
  userId: bigint;
  planId: bigint;
  paymentId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'cancelled';
}

class SubscriptionController {
  // Función para generar metadata
  private static metadata(req: Request, res: Response) {
    return {
      statusCode: res.statusCode,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
      method: req.method,
    };
  }

  // Función para manejar errores de validación
  private static handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        ...this.metadata(req, res),
        status: "error",
        message: "Error de validaciones",
        errors: errors.array(),
      });
      return false; // Indica que hay errores
    }
    return true; // Indica que no hay errores
  }

  // Función para manejar errores internos del servidor
  private static handleServerError(
    res: Response,
    req: Request,
    error: any,
    message: string
  ) {
    console.error(message, error);
    res.status(500).json({
      ...this.metadata(req, res),
      status: "error",
      message,
      error: error.message,
    });
  }

  /**
   * Crear una nueva suscripción en la base de datos
   * @param data Datos de la suscripción a crear
   * @returns La suscripción creada o null si hubo un error
   */
  static async createSubscription(data: SubscriptionData): Promise<Subscription | null> {
    try {
      // Validar que exista el plan
      const plan = await Plan.findByPk(data.planId);
      if (!plan) {
        throw new Error(`El plan con ID ${data.planId} no existe`);
      }

      // Validar que exista el usuario
      const user = await User.findByPk(data.userId);
      if (!user) {
        throw new Error(`El usuario con ID ${data.userId} no existe`);
      }

      // Crear la suscripción
      const subscription = await Subscription.create({
        userId: data.userId,
        planId: data.planId,
        paymentId: data.paymentId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      });

      console.log(`Suscripción creada exitosamente: ID ${subscription.id}`);
      return subscription;
    } catch (error) {
      console.error("Error al crear la suscripción:", error);
      if (error instanceof Error) {
        throw new Error(`Error al crear suscripción: ${error.message}`);
      }
      throw new Error(`Error desconocido al crear suscripción`);
    }
  }

  /**
   * Actualizar una suscripción existente
   * @param id ID de la suscripción a actualizar
   * @param data Datos actualizados
   * @returns La suscripción actualizada o null si no se encontró
   */
  static async updateSubscription(id: bigint, data: Partial<SubscriptionData>): Promise<Subscription | null> {
    try {
      // Buscar la suscripción
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        console.error(`No se encontró la suscripción con ID: ${id}`);
        return null;
      }

      // Validar que exista el plan si se está actualizando
      if (data.planId) {
        const plan = await Plan.findByPk(data.planId);
        if (!plan) {
          throw new Error(`El plan con ID ${data.planId} no existe`);
        }
      }

      // Validar que exista el usuario si se está actualizando
      if (data.userId) {
        const user = await User.findByPk(data.userId);
        if (!user) {
          throw new Error(`El usuario con ID ${data.userId} no existe`);
        }
      }

      // Actualizar la suscripción
      await subscription.update(data);

      console.log(`Suscripción actualizada exitosamente: ID ${id}`);
      return subscription;
    } catch (error) {
      console.error(`Error al actualizar la suscripción ${id}:`, error);
      if (error instanceof Error) {
        throw new Error(`Error al actualizar suscripción: ${error.message}`);
      }
      throw new Error(`Error desconocido al actualizar suscripción`);
    }
  }

  /**
   * Cancelar una suscripción
   * @param id ID de la suscripción a cancelar
   * @returns La suscripción cancelada o null si no se encontró
   */
  static async cancelSubscription(id: number): Promise<Subscription | null> {
    try {
      const subscription = await Subscription.findByPk(id);
      if (!subscription) {
        console.error(`No se encontró la suscripción con ID: ${id}`);
        return null;
      }

      await subscription.update({ status: 'cancelled' });
      
      console.log(`Suscripción cancelada exitosamente: ID ${id}`);
      return subscription;
    } catch (error) {
      console.error(`Error al cancelar la suscripción ${id}:`, error);
      if (error instanceof Error) {
        throw new Error(`Error al cancelar suscripción: ${error.message}`);
      }
      throw new Error(`Error desconocido al cancelar suscripción`);
    }
  }

  // Obtener todas las suscripciones
  static getAll: RequestHandler = async (req, res) => {
    try {
      const {
        userId,
        planId,
        status,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
        page = 1,
        limit = 10,
        sortBy = "startDate",
        sortOrder = "DESC",
      } = req.query;

      // Preparar las opciones de consulta
      const queryOptions: any = {
        include: [
          { model: Plan },
          { model: User },
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
      };

      // Construir filtros
      const whereClause: any = {};

      if (userId) {
        whereClause.userId = userId;
      }

      if (planId) {
        whereClause.planId = planId;
      }

      if (status) {
        whereClause.status = status;
      }

      // Filtro por fecha de inicio
      if (startDateFrom || startDateTo) {
        whereClause.startDate = {};
        if (startDateFrom) {
          whereClause.startDate[Op.gte] = new Date(startDateFrom as string);
        }
        if (startDateTo) {
          whereClause.startDate[Op.lte] = new Date(startDateTo as string);
        }
      }

      // Filtro por fecha de fin
      if (endDateFrom || endDateTo) {
        whereClause.endDate = {};
        if (endDateFrom) {
          whereClause.endDate[Op.gte] = new Date(endDateFrom as string);
        }
        if (endDateTo) {
          whereClause.endDate[Op.lte] = new Date(endDateTo as string);
        }
      }

      // Si hay filtros, agregarlos a la consulta
      if (Object.keys(whereClause).length > 0) {
        queryOptions.where = whereClause;
      }

      // Ejecutar la consulta
      const { count, rows } = await Subscription.findAndCountAll(queryOptions);

      // Calcular información de paginación
      const totalPages = Math.ceil(count / Number(limit));

      res.status(200).json({
        status: "success",
        message: "Suscripciones obtenidas exitosamente",
        data: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener las suscripciones");
    }
  };

  // Obtener una suscripción por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const subscription = await Subscription.findByPk(req.params.id, {
        include: [
          { model: Plan },
          { model: User },
        ],
      });

      if (!subscription) {
        res.status(404).json({
          status: "error",
          message: "Suscripción no encontrada",
          metadata: this.metadata(req, res),
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Suscripción obtenida exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener la suscripción");
    }
  };

  // Obtener suscripciones por ID de usuario
  static getByUserId: RequestHandler = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.params.userId;

      const { count, rows } = await Subscription.findAndCountAll({
        where: {
          userId: userId,
        },
        include: [
          { model: Plan },
        ],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        order: [["startDate", "DESC"]],
      });

      // Calcular información de paginación
      const totalPages = Math.ceil(count / Number(limit));

      res.status(200).json({
        status: "success",
        message: "Suscripciones del usuario obtenidas exitosamente",
        data: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1,
        },
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(
        res,
        req,
        error,
        "Error al obtener las suscripciones del usuario"
      );
    }
  };

  // Crear una suscripción (endpoint HTTP)
  /* static create: RequestHandler = async (req, res) => {
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const subscription = await this.createSubscription(req.body);

      res.status(201).json({
        status: "success",
        message: "Suscripción creada exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al crear la suscripción");
    }
  };

  // Actualizar una suscripción (endpoint HTTP)
  static update: RequestHandler = async (req, res) => {
    if (!this.handleValidationErrors(req, res)) return;

    try {
      const subscription = await this.updateSubscription(
        parseInt(req.params.id),
        req.body
      );

      if (!subscription) {
        res.status(404).json({
          status: "error",
          message: "Suscripción no encontrada",
          metadata: this.metadata(req, res),
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Suscripción actualizada exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al actualizar la suscripción");
    }
  };

  // Cancelar una suscripción (endpoint HTTP)
  static cancel: RequestHandler = async (req, res) => {
    try {
      const subscription = await this.cancelSubscription(parseInt(req.params.id));

      if (!subscription) {
        res.status(404).json({
          status: "error",
          message: "Suscripción no encontrada",
          metadata: this.metadata(req, res),
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Suscripción cancelada exitosamente",
        data: subscription,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al cancelar la suscripción");
    }
  }; */
}

export default SubscriptionController;
