// verify.controller.ts

// Descripción: En este archivo se define el controlador para verificar la autenticación de un usuario. Este controlador se utiliza para manejar la verificación de la autenticación de un usuario y devolver la información del usuario autenticado, así como detalles de la sesión activa.

import { Request, Response } from "express";
import User from "../../user/User";
import { TokenSession } from "../types/auth.types";
import { userTokens } from "../../../shared/middleware/authMiddleware";

export class VerifyController {
  static async handle(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(200).json({
        authenticated: false,
        message: "Usuario no autenticado",
      });
      return;
    }

    try {
      const user = req.user as User;
      const token = req.headers.authorization?.split(" ")[1];
      const sessions = userTokens.get(user.id) || [];
      const currentSession = token 
        ? sessions.find((s: TokenSession) => s.token === token) ?? null 
        : null;

      // Si el usuario ya está autenticado, no emitir eventos adicionales
      res.status(200).json({
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.dataValues.avatar,
          username: user.username,
          displayName: user.dataValues.displayName,
          roleId: user.roleId,
          role: user.dataValues.Role ? {
            id: user.dataValues.Role.id,
            name: user.dataValues.Role.name,
            description: user.dataValues.Role.description,
          } : null,
          authProvider: user.authProvider,
          authProviderId: user.dataValues.authProviderId,
          providerMetadata: user.dataValues.providerMetadata?.profile || null,
        },
        session: currentSession ? {
          createdAt: currentSession.createdAt,
          lastUsed: currentSession.lastUsed,
          expiresAt: currentSession.expiresAt,
          userAgent: currentSession.userAgent,
        } : null,
        activeSessions: sessions.length,
      });
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      res.status(200).json({
        authenticated: false,
        message: "Error verificando autenticación",
      });
    }
  }
}