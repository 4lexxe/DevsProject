// logout.controller.ts

// Descripción: En este archivo se define el controlador para cerrar la sesión de un usuario. Este controlador se utiliza para manejar la revocación de tokens de autenticación, destruir la sesión del usuario y devolver una respuesta de cierre de sesión al cliente.

import { Request, Response } from "express";
import User from "../../user/User";
import { revokeToken } from "../../../shared/middleware/authMiddleware";

export class LogoutController {
  static async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      const token = req.headers.authorization?.split(" ")[1];

      if (userId && token) {
        revokeToken(userId, token);
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          res.status(500).json({ error: "Error al cerrar sesión" });
          return;
        }

        res.clearCookie("sessionId");
        res.json({
          message: "Sesión cerrada correctamente",
          success: true,
        });
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "Error al cerrar sesión" });
    }
  }
}