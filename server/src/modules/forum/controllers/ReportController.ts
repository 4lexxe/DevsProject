// server/src/modules/forum/controllers/ReportController.ts

import { Request, Response } from 'express';
import Report, { ReportStatus, ReportTargetType } from '../models/Report';
import { AuthRequest } from "../../auth/controllers/verify.controller";
import User from "../../user/User";
import { reportValidations } from '../validators/report.validator';

export class ReportController {
  // Static property for report validations
  static reportValidations = reportValidations.submitReport;

  /**
   * @function submitReport
   * @description Submits a new report
   */
  static async submitReport(req: AuthRequest, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    try {
      const userId = req.user?.id;
      const { targetId, targetType, reason } = req.body;

      if (!targetId || !targetType || !reason) {
        res.status(400).json({ error: 'Faltan parámetros requeridos.' });
        return;
      }

      const report = await Report.create({
        userId,
        targetId,
        targetType,
        reason,
        status: ReportStatus.PENDING,
      });

      res.status(201).json({ message: 'Reporte enviado correctamente.', report });
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      res.status(500).json({ error: 'Error al enviar el reporte.' });
    }
  }

  /**
   * @function reviewReport
   * @description Reviews a specific report
   */
  static async reviewReport(req: AuthRequest, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    try {
      const { reportId } = req.params;
      const report = await Report.findByPk(reportId);

      if (!report) {
        res.status(404).json({ error: 'Reporte no encontrado.' });
        return;
      }

      res.status(200).json({ report });
    } catch (error) {
      console.error('Error al revisar el reporte:', error);
      res.status(500).json({ error: 'Error al revisar el reporte.' });
    }
  }

  /**
   * @function getReports
   * @description Retrieves all reports with optional filters
   */
  static async getReports(req: Request, res: Response): Promise<void> {
    try {
      const { status, targetType } = req.query;
      const whereClause: any = {};

      if (status) whereClause.status = status;
      if (targetType) whereClause.targetType = targetType;

      const reports = await Report.findAll({ where: whereClause });
      res.status(200).json({ reports });
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      res.status(500).json({ error: 'Error al obtener los reportes.' });
    }
  }

  /**
   * @function takeActionOnReport
   * @description Takes action on a specific report
   */
  static async takeActionOnReport(req: AuthRequest, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: 'No autorizado.' });
      return;
    }
    try {
      const { reportId, action } = req.body;
      const report = await Report.findByPk(reportId);

      if (!report) {
        res.status(404).json({ error: 'Reporte no encontrado.' });
        return;
      }

      // Example action: update report status
      if (action === 'resolve') {
        report.status = ReportStatus.REVIEWED;
      } else if (action === 'reject') {
        report.status = ReportStatus.REJECTED;
      }

      await report.save();
      res.status(200).json({ message: 'Acción realizada en el reporte.', report });
    } catch (error) {
      console.error('Error al realizar acción en el reporte:', error);
      res.status(500).json({ error: 'Error al realizar acción en el reporte.' });
    }
  }
}