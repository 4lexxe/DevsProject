import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Invoice from "../models/Invoice";
import Subscription from "../models/Subscription";

class InvoiceController {
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

  // Obtener todas las facturas con filtros opcionales
  static getAll: RequestHandler = async (req, res) => {
    try {
      const {
        subscriptionId,
        startDate,
        endDate,
        dueStartDate,
        dueEndDate,
        page = 1,
        limit = 10,
        sortBy = "issueDate",
        sortOrder = "DESC",
      } = req.query;

      // Preparar las opciones de consulta
      const queryOptions: any = {
        include: [
          {
            model: Subscription,
            as: "Subscription",
          },
        ],
        order: [[sortBy as string, sortOrder as string]],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
      };

      // Construir filtros
      const whereClause: any = {};

      if (subscriptionId) {
        whereClause.SubscriptionId = subscriptionId;
      }

      // Filtro por fecha de emisión
      if (startDate || endDate) {
        whereClause.issueDate = {};
        if (startDate) {
          whereClause.issueDate[Op.gte] = new Date(startDate as string);
        }
        if (endDate) {
          whereClause.issueDate[Op.lte] = new Date(endDate as string);
        }
      }

      // Filtro por fecha de vencimiento
      if (dueStartDate || dueEndDate) {
        whereClause.dueDate = {};
        if (dueStartDate) {
          whereClause.dueDate[Op.gte] = new Date(dueStartDate as string);
        }
        if (dueEndDate) {
          whereClause.dueDate[Op.lte] = new Date(dueEndDate as string);
        }
      }

      // Si hay filtros, agregarlos a la consulta
      if (Object.keys(whereClause).length > 0) {
        queryOptions.where = whereClause;
      }

      // Ejecutar la consulta
      const { count, rows } = await Invoice.findAndCountAll(queryOptions);

      // Calcular información de paginación
      const totalPages = Math.ceil(count / Number(limit));

      // Enviar respuesta exitosa
      res.status(200).json({
        status: "success",
        message: "Facturas obtenidas exitosamente",
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
      this.handleServerError(res, req, error, "Error al obtener las facturas");
    }
  };

  // Obtener una factura por ID
  static getById: RequestHandler = async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id, {
        include: [
          {
            model: Subscription,
            as: "Subscription",
          },
        ],
      });

      if (!invoice) {
        res.status(404).json({
          status: "error",
          message: "Factura no encontrada",
          metadata: this.metadata(req, res),
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Factura obtenida exitosamente",
        data: invoice,
        metadata: this.metadata(req, res),
      });
    } catch (error) {
      this.handleServerError(res, req, error, "Error al obtener la factura");
    }
  };

  // Obtener facturas por ID de suscripción
  static getBySubscriptionId: RequestHandler = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const subscriptionId = req.params.subscriptionId;

      const { count, rows } = await Invoice.findAndCountAll({
        where: {
          SubscriptionId: subscriptionId,
        },
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
        order: [["issueDate", "DESC"]],
      });

      // Calcular información de paginación
      const totalPages = Math.ceil(count / Number(limit));

      res.status(200).json({
        status: "success",
        message: "Facturas obtenidas exitosamente",
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
        "Error al obtener las facturas por suscripción"
      );
    }
  };











  /**
 * Crea una factura en la base de datos
 * @param invoiceData Datos de la factura
 * @param subscriptionId ID de la suscripción asociada
 * @returns La factura creada o null si hubo un error
 */
static async createInvoiceInDB(invoiceData: any) {
    try {
      // Definir las fechas de emisión y vencimiento
      const issueDate = new Date();
      // Fecha de vencimiento (30 días desde la emisión por defecto)
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
  
      // Verificar si hay fechas específicas en invoiceData
      if (invoiceData.date_created) {
        issueDate.setTime(new Date(invoiceData.date_created).getTime());
      }
  
      if (invoiceData.date_approved) {
        dueDate.setTime(new Date(invoiceData.date_approved).getTime());
        // Agregar 30 días a la fecha de aprobación para el vencimiento
        dueDate.setDate(dueDate.getDate() + 30);
      }
  
      const newInvoice = await Invoice.create({
        paymentId: invoiceData.payment.id,
        data: invoiceData,
        issueDate,
        dueDate,
      });
  
      console.log(`Factura creada exitosamente: ID ${newInvoice.id}`);
      return newInvoice;
    } catch (error: unknown) {
      console.error(`Error al crear la factura para la suscripción :`, error);
      
      if (error instanceof Error) {
        throw new Error(`Error al crear factura: ${error.message}`);
      } else {
        throw new Error(`Error al crear factura: ${String(error)}`);
      }
    }
  }
  
  /**
   * Actualiza una factura existente en la base de datos
   * @param invoiceData Nuevos datos de la factura
   * @param invoiceId ID de la factura a actualizar
   * @returns La factura actualizada o null si no se encontró
   */
  static async updateInvoiceInDB(invoiceData: any, invoiceId: number | string) {
    try {
      // Buscar la factura existente
      const invoice = await Invoice.findByPk(invoiceId);
      
      if (!invoice) {
        console.error(`No se encontró la factura para actualizar: ID ${invoiceId}`);
        return null;
      }
      
      // Definir las fechas de emisión y vencimiento
      const issueDate = new Date();
      // Fecha de vencimiento (30 días desde la emisión por defecto)
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
  
      // Verificar si hay fechas específicas en invoiceData
      if (invoiceData.date_created) {
        issueDate.setTime(new Date(invoiceData.date_created).getTime());
      }
  
      if (invoiceData.date_approved) {
        dueDate.setTime(new Date(invoiceData.date_approved).getTime());
        // Agregar 30 días a la fecha de aprobación para el vencimiento
        dueDate.setDate(dueDate.getDate() + 30);
      }
  
      // Actualizar los campos
      invoice.data = invoiceData;
      invoice.issueDate = issueDate;
      invoice.dueDate = dueDate;
      
      // Guardar los cambios
      await invoice.save();
  
      console.log(`Factura actualizada exitosamente: ID ${invoiceId}`);
      return invoice;
    } catch (error: unknown) {
      console.error(`Error al actualizar la factura ${invoiceId}:`, error);
      
      if (error instanceof Error) {
        throw new Error(`Error al actualizar factura: ${error.message}`);
      } else {
        throw new Error(`Error al actualizar factura: ${String(error)}`);
      }
    }
  }
}

export default InvoiceController;
