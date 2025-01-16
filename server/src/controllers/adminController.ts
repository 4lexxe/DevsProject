import { Request, Response, NextFunction } from 'express';
import * as AdminService from '../services/adminService';
import User from '../models/User';
import Admin from '../models/Admin';

interface AdminData {
  name: string;
  admin_since: string;
  permissions: string[];
  isSuperAdmin: boolean;
  admin_notes?: string;
}

export const createAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(req.body);
  const { userId, admin }: { userId: number; admin: AdminData } = req.body;

  if (!userId || typeof userId !== 'number') {
    res.status(400).json({ error: "El 'userId' debe ser un número válido" });
    return;
  }

  if (!admin || !admin.name || !admin.admin_since || !Array.isArray(admin.permissions) || typeof admin.isSuperAdmin !== "boolean") {
    res.status(400).json({ error: "El 'admin' debe contener los campos 'name', 'admin_since', 'permissions' e 'isSuperAdmin' válidos" });
    return;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const adminCreated = await AdminService.createAdmin(userId, {
      name: admin.name,
      admin_since: new Date(admin.admin_since),
      permissions: admin.permissions,
      isSuperAdmin: admin.isSuperAdmin,
      admin_notes: admin.admin_notes,
    });

    res.status(201).json({
      id: adminCreated.id,
      userId: adminCreated.userId,
      name: adminCreated.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
      createdAt: adminCreated.createdAt,
      updatedAt: adminCreated.updatedAt,
      admin_since: adminCreated.admin_since,
      permissions: adminCreated.permissions,
      isSuperAdmin: adminCreated.isSuperAdmin,
      admin_notes: adminCreated.admin_notes,
    });
  } catch (error) {
    console.error("Error detallado:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Ha ocurrido un problema inesperado" });
    }
  }
};

// GET ALL
export const getAllAdminsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const admins = await AdminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error detallado:", error);
    next(error);
  }
};

// GET ONE
export const getAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { adminId } = req.params;

  if (!adminId || isNaN(Number(adminId))) {
    res.status(400).json({ error: "El 'adminId' debe ser un número válido" });
    return;
  }

  try {
    const admin = await AdminService.getAdminById(Number(adminId));
    if (admin !== null && admin !== undefined) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ error: `Administrador con id ${adminId} no encontrado` });
    }
  } catch (error) {
    console.error("Error detallado:", error);
    next(error);
  }
};

// UPDATE
export const updateAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { adminId } = req.params;
  const { admin_since, permissions, isSuperAdmin, admin_notes }: { admin_since: string; permissions: string[]; isSuperAdmin: boolean; admin_notes?: string } = req.body;

  if (!adminId || isNaN(Number(adminId))) {
    res.status(400).json({ error: "El 'adminId' debe ser un número válido" });
    return;
  }

  try {
    const updatedAdmin = await AdminService.updateAdmin(Number(adminId), {
      admin_since: new Date(admin_since),
      permissions,
      isSuperAdmin,
      admin_notes,
    });

    if (updatedAdmin) {
      res.status(200).json({ message: "Administrador actualizado correctamente", admin: updatedAdmin });
    } else {
      res.status(404).json({ message: `Administrador con id ${adminId} no encontrado` });
    }
  } catch (error) {
    console.error("Error detallado:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Ha ocurrido un problema inesperado al actualizar el administrador" });
    }
  }
};

// DELETE
export const deleteAdminController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { adminId } = req.params;

  if (!adminId || isNaN(Number(adminId))) {
    res.status(400).json({ error: "El 'adminId' debe ser un número válido" });
    return;
  }

  try {
    const deletedAdmin = await AdminService.deleteAdmin(Number(adminId));
    if (deletedAdmin === true) {
      res.status(200).json({ message: `Administrador con id ${adminId} eliminado exitosamente` });
    } else {
      res.status(404).json({ error: `Administrador con id ${adminId} no encontrado` });
    }
  } catch (error) {
    console.error("Error detallado:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Ha ocurrido un error al eliminar el administrador" });
    }
  }
};