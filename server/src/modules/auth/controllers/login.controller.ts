import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../../user/User";
import { AuthProvider } from "../../user/User";
import { TokenUtils } from "../utils/token.utils";

export class LoginController {
  static async handle(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Buscar al usuario por correo electrónico
      const user = await User.findOne({
        where: { email, authProvider: AuthProvider.LOCAL },
        include: ["Role"],
      });

      if (!user || !user.password) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      // Actualizar campos de sesión
      user.isActiveSession = true;
      user.lastActiveAt = new Date();
      await user.save();

      // Generar token JWT
      const authResponse = await TokenUtils.getAuthResponse(user, req);

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          res.status(500).json({ error: "Error al iniciar sesión" });
          return;
        }

        res.json({
          message: "Inicio de sesión exitoso",
          ...authResponse,
          user: {
            ...authResponse.user,
            role: user.dataValues.Role
              ? {
                  id: user.dataValues.Role.id,
                  name: user.dataValues.Role.name,
                  description: user.dataValues.Role.description,
                }
              : null,
            isActiveSession: user.isActiveSession,
            lastActiveAt: user.lastActiveAt,
          },
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Error en el inicio de sesión" });
    }
  }
}