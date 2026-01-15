import { Request, Response, RequestHandler } from 'express';
import Permission from '../models/Permission';

interface PermissionResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: unknown;
}

// Utilidad para manejar errores
const handleError = (res: Response, status: number, message: string, error?: unknown): void => {
  console.error(message, error);
  const response: PermissionResponse = { status, message };
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }
  res.status(status).json(response);
};

// OBTENER TODOS LOS PERMISOS
export const getAllPermissions: RequestHandler<unknown, PermissionResponse<Permission[]>> = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']]
    });

    const response: PermissionResponse<Permission[]> = {
      status: 200,
      message: 'Permisos obtenidos exitosamente',
      data: permissions
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al obtener los permisos', error);
  }
};
