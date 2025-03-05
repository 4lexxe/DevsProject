import { Request, Response } from 'express';
import Role from '../modules/role/Role';

/**
 * Controlador para gestionar operaciones relacionadas con roles
 */
export default class RoleController {
  /**
   * Obtiene todos los roles con sus permisos asociados
   * 
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   */
  public static async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await Role.getAllRolesWithPermissions();
      
      return res.status(200).json({
        success: true,
        data: roles,
        message: 'Roles recuperados exitosamente'
      });
    } catch (error: any) {
      console.error('Error al recuperar roles:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al recuperar los roles',
        error: error.message
      });
    }
  }
}
