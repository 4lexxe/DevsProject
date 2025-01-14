import { Request, Response, NextFunction } from "express";
import { createAdmin, getAllAdmins, deleteAdmin } from "../services/adminService";
import * as AdminService from "../services/adminService";

interface UserData {
  userId: number;
}

interface AdminData {
  admin_since: string;
  permissions: string[];
  isSuperAdmin: boolean;
  admin_notes?: string;
}

export const createAdminController = (req: Request, res: Response, next: NextFunction): void => {
  const { user, admin }: { user: UserData; admin: AdminData } = req.body;

  console.log("userData:", user);
  console.log("adminData:", admin);

  if (!user || typeof user.userId !== 'number') {
    res.status(400).json({ error: "El 'user' debe contener un 'userId' válido" });
    return;
  }

  if (!admin || !admin.admin_since || !Array.isArray(admin.permissions) || typeof admin.isSuperAdmin !== "boolean") {
    res.status(400).json({ error: "El 'admin' debe contener los campos 'admin_since', 'permissions' e 'isSuperAdmin' válidos" });
    return;
  }

  createAdmin(user.userId, {
    ...admin,
    admin_since: new Date(admin.admin_since),
  })
    .then((createdAdmin) => {
      res.status(201).json(createdAdmin);
    })
    .catch((error) => {
      console.error("Error detallado:", error);
      if (error instanceof Error) {
        if (error.message === "Usuario no encontrado") {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: "Ha ocurrido un problema inesperado" });
      }
    });
};

export const getAllAdminsController = (req: Request, res: Response, next: NextFunction): void => {
  getAllAdmins()
    .then((admins) => {
      res.status(200).json(admins);
    })
    .catch((error) => {
      console.error("Error detallado:", error);
      next(error);
    });
};

// Controlador para eliminar un administrador
interface ParamsWithAdminId extends Request {
  params: {
    adminId: string;
  };
}

export const deleteAdminController = (req: ParamsWithAdminId, res: Response, next: NextFunction): void => {
  const { adminId } = req.params; // O puedes usar userId si es necesario

  console.log("Eliminando admin con el id:", adminId);

  if (!adminId || isNaN(Number(adminId))) {
    res.status(400).json({ error: "El 'adminId' debe ser un número válido" });
    return;
  }

  deleteAdmin(Number(adminId))
    .then(() => {
      res.status(200).json({ message: `Administrador con id ${adminId} eliminado exitosamente` });
    })
    .catch((error) => {
      console.error("Error detallado:", error);
      res.status(500).json({ error: "Ha ocurrido un error al eliminar el administrador" });
    });
};

export const updateAdminController = async (req: Request, res: Response) => {
  const adminId = req.params.id;  // ID del administrador
  const { admin_since, permissions, isSuperAdmin, admin_notes } = req.body;

  try {
    const updatedAdmin = await AdminService.updateAdmin(Number(adminId), {
      admin_since,
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
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    res.status(500).json({ message: "Error al actualizar el administrador", error: errorMessage });
  }
};