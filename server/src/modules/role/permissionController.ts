import { Request, Response, RequestHandler } from 'express';
import Permission from './Permission';
import RolePermission from './RolePermission';
import User from '../user/User';

interface PermissionRequestBody {
  name: string;
  description: string;
}

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

// CREAR PERMISO
export const createPermission: RequestHandler<unknown, PermissionResponse, PermissionRequestBody> = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.user as User;

    // Verificar permisos adicionales
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    if (!userPermissions.includes('manage:permissions') && user.Role?.name !== 'superadmin') {
      return handleError(res, 403, 'No tienes permisos para crear permisos');
    }

    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return handleError(res, 400, 'El nombre del permiso ya está en uso');
    }

    const newPermission = await Permission.create({ name, description });
    const permissionData = newPermission.toJSON();
    
    const response: PermissionResponse = {
      status: 201,
      message: 'Permiso creado exitosamente',
      data: {
        id: permissionData.id,
        name: permissionData.name,
        description: permissionData.description,
        createdAt: permissionData.createdAt,
        updatedAt: permissionData.updatedAt
      }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al crear el permiso', error);
  }
};

// OBTENER TODOS LOS PERMISOS
export const getPermissions: RequestHandler<unknown, PermissionResponse> = async (req, res) => {
  try {
    const user = req.user as User;

    // Verificar permisos adicionales
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    const canViewPermissions = userPermissions.includes('read:users') || 
                              userPermissions.includes('manage:permissions') || 
                              user.Role?.name === 'superadmin';

    if (!canViewPermissions) {
      return handleError(res, 403, 'No tienes permisos para ver permisos');
    }

    const permissions = await Permission.findAll({
      order: [['name', 'ASC']]
    });

    const response: PermissionResponse = {
      status: 200,
      message: 'Permisos obtenidos exitosamente',
      data: permissions
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al obtener los permisos', error);
  }
};

// OBTENER PERMISO POR ID
export const getPermissionById: RequestHandler<{ id: string }, PermissionResponse> = async (req, res) => {
  try {
    const user = req.user as User;

    // Verificar permisos adicionales
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    const canViewPermissions = userPermissions.includes('read:users') || 
                              userPermissions.includes('manage:permissions') || 
                              user.Role?.name === 'superadmin';

    if (!canViewPermissions) {
      return handleError(res, 403, 'No tienes permisos para ver permisos');
    }

    const permission = await Permission.findByPk(req.params.id);

    if (!permission) {
      return handleError(res, 404, 'Permiso no encontrado');
    }

    const response: PermissionResponse = {
      status: 200,
      message: 'Permiso obtenido exitosamente',
      data: permission
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al obtener el permiso', error);
  }
};

// ACTUALIZAR PERMISO
export const updatePermission: RequestHandler<{ id: string }, PermissionResponse, PermissionRequestBody> = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const user = req.user as User;

    // Verificar permisos adicionales
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    if (!userPermissions.includes('manage:permissions') && user.Role?.name !== 'superadmin') {
      return handleError(res, 403, 'No tienes permisos para actualizar permisos');
    }

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return handleError(res, 404, 'Permiso no encontrado');
    }

    if (name) {
      const existingPermission = await Permission.findOne({ where: { name } });
      if (existingPermission && existingPermission.id !== permission.id) {
        return handleError(res, 400, 'El nombre del permiso ya está en uso');
      }
      permission.name = name;
    }

    if (description) {
      permission.description = description;
    }

    const updatedPermission = await permission.save();
    const permissionData = updatedPermission.toJSON();
    
    const response: PermissionResponse = {
      status: 200,
      message: 'Permiso actualizado exitosamente',
      data: {
        id: permissionData.id,
        name: permissionData.name,
        description: permissionData.description,
        createdAt: permissionData.createdAt,
        updatedAt: permissionData.updatedAt
      }
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al actualizar el permiso', error);
  }
};

// ELIMINAR PERMISO
export const deletePermission: RequestHandler<{ id: string }, PermissionResponse> = async (req, res) => {
  try {
    const user = req.user as User;

    // Verificar permisos adicionales
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    if (!userPermissions.includes('delete:permissions') && user.Role?.name !== 'superadmin') {
      return handleError(res, 403, 'No tienes permisos para eliminar permisos');
    }

    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return handleError(res, 404, 'Permiso no encontrado');
    }

    // Verificar si el permiso está siendo usado por algún rol
    const rolesUsingPermission = await RolePermission.count({ 
      where: { permissionId: permission.id } 
    });
    
    if (rolesUsingPermission > 0) {
      return handleError(res, 400, `No se puede eliminar el permiso. Está siendo usado por ${rolesUsingPermission} rol(es)`);
    }

    await permission.destroy();
    
    const response: PermissionResponse = {
      status: 200,
      message: 'Permiso eliminado exitosamente'
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al eliminar el permiso', error);
  }
};
