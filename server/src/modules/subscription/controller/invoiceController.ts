import { Request, Response, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Invoice from "../models/Invoice";
import User from "../../user/User";
import Subscription from "../models/Subscription";
import PDFDocument from 'pdfkit';
import axios from "axios";
import { createInvoicePDF } from "../../../shared/utils/createInvoice";

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


  static downloadInvoicePDF: RequestHandler = async (req, res) => {
    const userId = (req.session as any).passport.user.id;

    try {
      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado',
          metadata: this.metadata(req, res),
        });
        return;
      }

      const user = await User.findByPk(userId, {
        raw: true
      });

      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado',
          metadata: this.metadata(req, res),
        });
        return;
      }

      const paymentId = req.params.id;
      const invoice = await Invoice.findOne({
        where: {
          paymentId: paymentId
        },
        raw: true
      });

      if (!invoice) {
        res.status(404).json({
          status: 'error',
          message: 'Factura no encontrada',
          metadata: this.metadata(req, res),
        });
        return;
      }

      console.log("DATOS DE LA FACTURA:::", invoice)
      console.log("DATOS DEL USUSARIO:::", user);
      
      

      const pdfData = await createInvoicePDF(user, invoice);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=factura_${paymentId}.pdf`);
      res.send(pdfData); // Enviar el PDF como respuesta
    } catch (error) {
      this.handleServerError(res, req, error, 'Error al generar el PDF de la factura');
    }
  }
}

export default InvoiceController;
