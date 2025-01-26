// token.controller.ts

// Descripción: En este archivo se define el controlador para la renovación de tokens de autenticación. Este controlador se utiliza para manejar la renovación de tokens de autenticación de usuario, revocar el token anterior y devolver un nuevo token de autenticación al cliente.

import { Request, Response } from "express";
import User from "../../user/User";
import { revokeToken } from "../../../shared/middleware/authMiddleware";
import { TokenUtils } from "../utils/token.utils";

export class TokenController {
  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      const oldToken = req.headers.authorization?.split(" ")[1];

      if (!userId || !oldToken) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const user = await User.findByPk(userId, { include: ["Role"] });
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      revokeToken(userId, oldToken);
      const authResponse = TokenUtils.getAuthResponse(user, req);

      res.json({
        message: "Token renovado correctamente",
        ...authResponse,
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ error: "Error al renovar token" });
    }
  }
}