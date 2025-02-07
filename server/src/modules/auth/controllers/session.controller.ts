// session.controller.ts

// Descripción: En este archivo se define el controlador para la gestión de sesiones de usuario. Este controlador se utiliza para manejar la obtención de sesiones activas, la revocación de sesiones y la revocación de otras sesiones activas de un usuario.

import { Request, Response } from "express";
import User from "../../user/User";
import { userTokens, revokeToken } from "../../../shared/middleware/authMiddleware";
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

      const sessions = userTokens.get(userId) || [];
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

      revokeToken(userId, token);
      const remainingSessions = userTokens.get(userId) || [];
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

      const sessions = userTokens.get(userId) || [];
      const updatedSessions = sessions.filter(session => session.token === currentToken);
      userTokens.set(userId, updatedSessions);

      res.json({ 
        message: "Otras sesiones revocadas correctamente",
        currentSession: SessionUtils.formatSession(updatedSessions[0])
      });
    } catch (error) {
      console.error("Error revoking other sessions:", error);
      res.status(500).json({ error: "Error al revocar otras sesiones" });
    }
  }
}