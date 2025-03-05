import { Request, Response, RequestHandler } from 'express';
import Role, { IRoleAttributes, IRoleInstance } from '../role/Role';
import Permission from '../Permission/Permission';

interface RoleRequestBody {
  name: string;
  description: string;
}

interface RoleResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: unknown;
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
    const { name, description } = req.body;

    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return handleError(res, 400, 'El nombre del rol ya está en uso');
    }

    const newRole = await Role.create({ name, description });
    
    const response: RoleResponse<IRoleAttributes> = {
      status: 201,
      message: 'Rol creado exitosamente',
      data: {
        id: newRole.id,
        name: newRole.name,
        description: newRole.description,
        createdAt: newRole.createdAt,
        updatedAt: newRole.updatedAt
      }
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(res, 500, 'Error al crear el rol', error);
  }
};

// OBTENER TODOS LOS ROLES
export const getRoles: RequestHandler<unknown, RoleResponse<IRoleInstance[]>> = async (req, res) => {
  try {
    const roles = await Role.getAllRolesWithPermissions();
    
    return res.status(200).json({
      status: 200,
      message: "Roles obtenidos exitosamente",
      data: roles
    });
  } catch (error: any) {
    console.error('Error al obtener roles:', error);
    return res.status(500).json({
      status: 500,
      message: 'Error al obtener los roles',
      error: error.message
    });
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
      return handleError(res, 404, 'Rol no encontrado');
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
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return handleError(res, 404, 'Rol no encontrado');
    }

    if (name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole && existingRole.id !== role.id) {
        return handleError(res, 400, 'El nombre del rol ya está en uso');
      }
      role.name = name;
    }

    if (description) {
      role.description = description;
    }

    const updatedRole = await role.save();
    
    const response: RoleResponse<IRoleAttributes> = {
      status: 200,
      message: 'Rol actualizado exitosamente',
      data: {
        id: updatedRole.id,
        name: updatedRole.name,
        description: updatedRole.description,
        createdAt: updatedRole.createdAt,
        updatedAt: updatedRole.updatedAt
      }
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
      return handleError(res, 404, 'Rol no encontrado');
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