// src/services/reportService.ts

import api from '../../api/axios'; // Importa la instancia de Axios configurada

// Define la interfaz para un reporte del foro
export interface Report {
  id: number;
  targetId: number; // ID del post o reply reportado
  targetType: 'post' | 'reply'; // Tipo de entidad reportada
  userId: number; // Usuario que realiza el reporte
  reason: string; // Razón del reporte
  status: 'pending' | 'resolved' | 'dismissed'; // Estado del reporte
  createdAt?: string;
  updatedAt?: string;
}

// Servicio para manejar las operaciones relacionadas con los reportes del foro
const ReportService = {
  // Crear un nuevo reporte
  async createReport(reportData: Omit<Report, 'id' | 'status'>): Promise<Report> {
    try {
      const response = await api.post('/forum/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el reporte:', error);
      throw new Error('Error al crear el reporte.');
    }
  },

  // Obtener todos los reportes
  async getAllReports(): Promise<Report[]> {
    try {
      const response = await api.get('/forum/reports');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      throw new Error('Error al obtener los reportes.');
    }
  },

  // Actualizar el estado de un reporte
  async updateReportStatus(reportId: number, status: 'pending' | 'resolved' | 'dismissed'): Promise<Report> {
    try {
      const response = await api.put(`/forum/reports/${reportId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado del reporte con id ${reportId}:`, error);
      throw new Error('Error al actualizar el estado del reporte.');
    }
  },

  // Eliminar un reporte
  async deleteReport(reportId: number): Promise<void> {
    try {
      await api.delete(`/forum/reports/${reportId}`);
    } catch (error) {
      console.error(`Error al eliminar el reporte con id ${reportId}:`, error);
      throw new Error('Error al eliminar el reporte.');
    }
  },
};

export default ReportService;