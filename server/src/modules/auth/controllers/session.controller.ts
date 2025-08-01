// session.controller.ts

// Descripción: En este archivo se define el controlador para la gestión de sesiones de usuario. Este controlador se utiliza para manejar la obtención de sesiones activas, la revocación de sesiones y la revocación de otras sesiones activas de un usuario.

import { Request, Response } from "express";
import User from "../../user/User";
import { revokeToken } from "../../../shared/middleware/authMiddleware";
import { SessionService } from "../services/session.service";
import { SessionUtils } from "../utils/session.utils";
import { TokenUtils } from "../utils/token.utils";

export class SessionController {
  static async getActiveSessions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      if (!userId) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const sessions = await SessionService.getUserSessions(userId);
      res.json({ 
        sessions: SessionUtils.formatSessions(sessions)
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Error al obtener sesiones activas" });
    }
  }

  static async revokeSession(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      const { token } = req.body;
      if (!userId) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }
      if (!token) {
        res.status(400).json({ error: "Token no proporcionado" });
        return;
      }

      await revokeToken(userId, token);
        const remainingSessions = await SessionService.getUserSessions(userId);
      res.json({ 
        message: "Sesión revocada correctamente",
        remainingSessions: SessionUtils.formatSessions(remainingSessions)
      });
    } catch (error) {
      console.error("Error revoking session:", error);
      res.status(500).json({ error: "Error al revocar sesión" });
    }
  }

  static async revokeOtherSessions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      const currentToken = req.headers.authorization?.split(" ")[1];
      if (!userId || !currentToken) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const sessions = await SessionService.getUserSessions(userId);
      const currentSession = sessions.find(session => session.token === currentToken);
      
      // Revocar todas las sesiones excepto la actual
      await SessionService.revokeAllTokens(userId);
      if (currentSession) {
        await SessionService.registerSession(userId, currentSession);
      }

      res.json({ 
        message: "Otras sesiones revocadas correctamente",
        currentSession: currentSession ? SessionUtils.formatSession(currentSession) : null
      });
    } catch (error) {
      console.error("Error revoking other sessions:", error);
      res.status(500).json({ error: "Error al revocar otras sesiones" });
    }
  }
}