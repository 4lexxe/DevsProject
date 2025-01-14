import { Request, Response, NextFunction } from "express";
import { createAdmin, getAllAdmins } from "../services/adminService";

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