import type { Request, Response, NextFunction } from "express"
import * as AdminService from "../services/adminService"
import User from "../models/User"
import Admin from "../models/Admin"
import { body, validationResult } from "express-validator"

export class AdminController {
  static createAdminValidations = [
    body("userId").isInt().withMessage("El userId debe ser un número entero"),
    body("admin.name").trim().notEmpty().withMessage("El nombre es requerido"),
    body("admin.admin_since").isISO8601().toDate().withMessage("La fecha debe ser válida"),
    body("admin.permissions").isArray().withMessage("Los permisos deben ser un array"),
    body("admin.isSuperAdmin").isBoolean().withMessage("isSuperAdmin debe ser un booleano"),
    body("admin.admin_notes").optional().isString().withMessage("Las notas deben ser un string"),
  ]

  static async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const { userId, admin } = req.body

      const user = await User.findByPk(userId)
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" })
        return
      }

      const adminCreated = await AdminService.createAdmin(userId, admin)

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
      })
    } catch (error) {
      next(error)
    }
  }

  static async getAllAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admins = await AdminService.getAllAdmins()
      res.status(200).json(admins)
    } catch (error) {
      next(error)
    }
  }

  static async getAdminById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { adminId } = req.params
      const admin = await AdminService.getAdminById(Number(adminId))
      if (admin) {
        res.status(200).json(admin)
      } else {
        res.status(404).json({ error: `Administrador con id ${adminId} no encontrado` })
      }
    } catch (error) {
      next(error)
    }
  }

  static updateAdminValidations = [
    body("admin_since").optional().isISO8601().toDate().withMessage("La fecha debe ser válida"),
    body("permissions").optional().isArray().withMessage("Los permisos deben ser un array"),
    body("isSuperAdmin").optional().isBoolean().withMessage("isSuperAdmin debe ser un booleano"),
    body("admin_notes").optional().isString().withMessage("Las notas deben ser un string"),
  ]

  static async updateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const { adminId } = req.params
      const updateData = req.body

      const updatedAdmin = await AdminService.updateAdmin(Number(adminId), updateData)

      if (updatedAdmin) {
        res.status(200).json({ message: "Administrador actualizado correctamente", admin: updatedAdmin })
      } else {
        res.status(404).json({ message: `Administrador con id ${adminId} no encontrado` })
      }
    } catch (error) {
      next(error)
    }
  }

  static async deleteAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { adminId } = req.params
      const deletedAdmin = await AdminService.deleteAdmin(Number(adminId))
      if (deletedAdmin) {
        res.status(200).json({ message: `Administrador con id ${adminId} eliminado exitosamente` })
      } else {
        res.status(404).json({ error: `Administrador con id ${adminId} no encontrado` })
      }
    } catch (error) {
      next(error)
    }
  }
}