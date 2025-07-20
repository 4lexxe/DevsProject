import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../../user/User";
import Admin from "../../admin/Admin";
import { AuthProvider } from "../../user/User";
import { TokenUtils } from "../utils/token.utils";

export class RootLoginController {
  static async handle(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Primero verificar contra las variables de entorno (Opción A)
      const superUserEmail = process.env.SUPER_USER_EMAIL;
      const superUserPassword = process.env.SUPER_USER_PASSWORD;

      if (!superUserEmail || !superUserPassword) {
        console.error("SUPER_USER credentials not configured in environment");
        res.status(500).json({ error: "Error de configuración del servidor" });
        return;
      }

      // Verificar credenciales contra las variables de entorno
      if (email !== superUserEmail || password !== superUserPassword) {
        res.status(401).json({ error: "Credenciales de super administrador inválidas" });
        return;
      }

      // Verificar que el usuario exista en la base de datos y sea super admin (Opción B)
      const user = await User.findOne({
        where: { 
          email: superUserEmail, 
          authProvider: AuthProvider.LOCAL 
        },
        include: [
          {
            model: Admin,
            as: 'admin',
            required: false // LEFT JOIN para que funcione si no tiene registro en Admin
          },
          "Role"
        ],
      });

      if (!user) {
        console.error(`Super user ${superUserEmail} not found in database`);
        res.status(401).json({ error: "Usuario super administrador no encontrado en la base de datos" });
        return;
      }

      // Verificar que tenga rol de superadmin
      const userRole = user.dataValues.Role;
      if (!userRole || userRole.name !== 'superadmin') {
        console.error(`User ${superUserEmail} does not have superadmin role. Current role: ${userRole?.name || 'none'}`);
        res.status(403).json({ error: "El usuario no tiene permisos de super administrador" });
        return;
      }

      // Verificar si tiene registro en la tabla Admin y es super admin
      const adminRecord = user.dataValues.admin;
      if (adminRecord && !adminRecord.isSuperAdmin) {
        console.error(`User ${superUserEmail} exists in Admin table but isSuperAdmin is false`);
        res.status(403).json({ error: "El usuario no está marcado como super administrador" });
        return;
      }

      // Actualizar campos de sesión
      user.isActiveSession = true;
      user.lastActiveAt = new Date();
      await user.save();

      // Generar token JWT con información especial del super admin
      const authResponse = await TokenUtils.getAuthResponse(user, req, true);

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Super admin login error:", loginErr);
          res.status(500).json({ error: "Error al iniciar sesión del super administrador" });
          return;
        }

        res.json({
          message: "Inicio de sesión de super administrador exitoso",
          ...authResponse,
          user: {
            ...authResponse.user,
            role: {
              id: userRole.id,
              name: userRole.name,
              description: userRole.description,
            },
            admin: adminRecord ? {
              id: adminRecord.id,
              name: adminRecord.name,
              isSuperAdmin: adminRecord.isSuperAdmin,
              permissions: adminRecord.permissions,
              admin_since: adminRecord.admin_since,
              admin_notes: adminRecord.admin_notes
            } : null,
            isActiveSession: user.isActiveSession,
            lastActiveAt: user.lastActiveAt,
            isSuperAdmin: true, // Flag especial para el frontend
          },
        });
      });

    } catch (error) {
      console.error("Root login error:", error);
      res.status(500).json({ error: "Error en el inicio de sesión del super administrador" });
    }
  }
}
