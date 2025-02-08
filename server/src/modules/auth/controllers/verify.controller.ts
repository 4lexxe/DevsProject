// verify.controller.ts

// Descripción: En este archivo se define el controlador para verificar la autenticación de un usuario. Este controlador se utiliza para manejar la verificación de la autenticación de un usuario y devolver la información del usuario autenticado, así como detalles de la sesión activa.

import { Request, Response } from "express";
import User from "../../user/User";
import Role from "../../role/Role";
import Permission from "../../role/Permission";

export interface AuthRequest extends Request {
  user?: User & { id: string | number };
}

import { TokenSession } from "../types/auth.types";
import { userTokens } from "../../../shared/middleware/authMiddleware";

export class VerifyController {
  static async handle(req: AuthRequest, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(200).json({
        authenticated: false,
        message: "Usuario no autenticado",
      });
      return;
    }

    try {
      const user = await User.findByPk(req.user?.id, {
        include: [
          {
            model: Role,
            as: 'Role',
            include: [
              {
                model: Permission,
                as: 'Permissions',
                attributes: ['name'],
              },
            ],
          },
        ],
      });

      if (!user) {
        res.status(401).json({ authenticated: false });
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      const sessions = userTokens.get(user.id) || [];
      const currentSession = token 
        ? sessions.find((s: TokenSession) => s.token === token) ?? null 
        : null;

      res.status(200).json({
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          username: user.username,
          displayName: user.displayName,
          roleId: user.roleId,
          role: user.Role ? {
            id: user.Role.id,
            name: user.Role.name,
            description: user.Role.description,
            permissions: user.Role.Permissions?.map((p: Permission) => p.name) || [],
          } : null,
          authProvider: user.authProvider,
          authProviderId: user.authProviderId,
          providerMetadata: (user.providerMetadata as any)?.profile || null,
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