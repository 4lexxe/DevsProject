import { Request, Response, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import Role, { IRoleAttributes, IRoleInstance } from '../models/Role';
import Permission from '../models/Permission';
import User from '../../user/User';

interface RoleRequestBody {
  name: string;
  description: string;
  permissionIds?: number[];
}

interface RoleResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: unknown;
  errors?: unknown[];
}

// Utilidad para manejar errores
const handleError = (res: Response, status: number, message: string, error?: unknown): void => {
  console.error(message, error);
  const response: RoleResponse = { status, message };
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }
  res.status(status).json(response);
};

// CREAR ROL
export const createRole: RequestHandler<unknown, RoleResponse<IRoleAttributes>, RoleRequestBody> = async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req as Request);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 400,
        message: 'Error de validación',
        errors: errors.array()
      });
      return;
    }

    const { name, description, permissionIds } = req.body;

    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      handleError(res, 400, 'El nombre del rol ya está en uso');
      return;
    }

    const newRole = await Role.create({ name, description });
    
    // Asignar permisos si se proporcionaron
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      });
      
      if (permissions.length !== permissionIds.length) {
        await newRole.destroy();
        handleError(res, 400, 'Algunos IDs de permisos no son válidos');
        return;
      }
      
      await newRole.setPermissions(permissions);
    }

    // Obtener el rol con sus permisos para la respuesta
    const roleWithPermissions = await Role.findByPk(newRole.id, {
      include: [{
        model: Permission,
        as: 'Permissions',
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] }
      }]
    });
    
    const response: RoleResponse<IRoleInstance> = {
      status: 201,
      message: 'Rol creado exitosamente',
      data: roleWithPermissions!
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al crear el rol', error);
  }
};

// OBTENER TODOS LOS ROLES
export const getRoles: RequestHandler<unknown, RoleResponse<IRoleInstance[]>> = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'Permissions',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }]
    });

    const response: RoleResponse<IRoleInstance[]> = {
      status: 200,
      message: 'Roles obtenidos exitosamente',
      data: roles
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al obtener los roles', error);
  }
};

// OBTENER ROL POR ID
export const getRoleById: RequestHandler<{ id: string }, RoleResponse<IRoleInstance>> = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{
        model: Permission,
        as: 'Permissions',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }]
    });

    if (!role) {
      handleError(res, 404, 'Rol no encontrado');
      return;
    }

    const response: RoleResponse<IRoleInstance> = {
      status: 200,
      message: 'Rol obtenido exitosamente',
      data: role
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al obtener el rol', error);
  }
};

// ACTUALIZAR ROL
export const updateRole: RequestHandler<{ id: string }, RoleResponse<IRoleAttributes>, RoleRequestBody> = async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req as Request);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 400,
        message: 'Error de validación',
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { name, description, permissionIds } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      handleError(res, 404, 'Rol no encontrado');
      return;
    }

    if (name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole && existingRole.id !== role.id) {
        handleError(res, 400, 'El nombre del rol ya está en uso');
        return;
      }
      role.name = name;
    }

    if (description) {
      role.description = description;
    }

    await role.save();
    
    // Actualizar permisos si se proporcionaron
    if (permissionIds !== undefined) {
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      });
      
      if (permissions.length !== permissionIds.length) {
        handleError(res, 400, 'Algunos IDs de permisos no son válidos');
        return;
      }
      
      await role.setPermissions(permissions);
    }

    // Obtener el rol con sus permisos para la respuesta
    const roleWithPermissions = await Role.findByPk(id, {
      include: [{
        model: Permission,
        as: 'Permissions',
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] }
      }]
    });
    
    const response: RoleResponse<IRoleInstance> = {
      status: 200,
      message: 'Rol actualizado exitosamente',
      data: roleWithPermissions!
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al actualizar el rol', error);
  }
};

// ELIMINAR ROL
export const deleteRole: RequestHandler<{ id: string }, RoleResponse> = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      handleError(res, 404, 'Rol no encontrado');
      return;
    }

    // Prevenir eliminación de roles del sistema
    if (['superadmin', 'admin', 'student', 'instructor', 'moderator'].includes(role.name)) {
      handleError(res, 403, 'No se pueden eliminar roles del sistema');
      return;
    }

    // Verificar si hay usuarios usando este rol
    const usersWithRole = await User.count({ where: { roleId: role.id } });
    if (usersWithRole > 0) {
      handleError(res, 400, `No se puede eliminar el rol. Hay ${usersWithRole} usuario(s) asignado(s) a este rol`);
      return;
    }

    await role.destroy();
    
    const response: RoleResponse = {
      status: 200,
      message: 'Rol eliminado exitosamente'
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al eliminar el rol', error);
  }
};