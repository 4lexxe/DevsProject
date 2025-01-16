import { Request, Response, RequestHandler } from 'express';
import Role from '../models/Role';

interface RoleRequestBody {
  name: string;
  description: string;
}

// CREAR
export const createRole: RequestHandler = async (req: Request<{}, {}, RoleRequestBody>, res) => {
  try {
    const { name, description } = req.body;
    
    // Verifica si el rol ya existe
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      res.status(400).json({ message: 'El rol ya existe' });
      return;
    }

    const role = await Role.create({ name, description });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el rol', error });
  }
};

// OBTENER todos los roles
export const getRoles: RequestHandler = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los roles', error });
  }
};

// OBTENER un rol por ID
export const getRoleById: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' });
      return;
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el rol', error });
  }
};

// ACTUALIZAR
export const updateRole: RequestHandler<{ id: string }, any, RoleRequestBody> = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' });
      return;
    }

    role.name = name || role.name;
    role.description = description || role.description;

    await role.save();
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el rol', error });
  }
};

// ELIMINAR
export const deleteRole: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' });
      return;
    }

    await role.destroy();
    res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el rol', error });
  }
};