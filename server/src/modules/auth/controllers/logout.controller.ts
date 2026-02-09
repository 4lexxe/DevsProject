// logout.controller.ts

// Descripción: En este archivo se define el controlador para cerrar la sesión de un usuario. Este controlador se utiliza para manejar la revocación de tokens de autenticación, destruir la sesión del usuario y devolver una respuesta de cierre de sesión al cliente.

import { Request, Response } from "express";
import User from "../../user/User";
import { revokeToken } from "../../../shared/middleware/authMiddleware";

export class LogoutController {
  static async handle(req: Request, res: Response): Promise<void> {
    try {
      // Obtener usuario de la sesión
      const user = req.user as User;
      
      if (!user || !user.id) {
        console.warn(" No se encontró usuario en la sesión durante el cierre de sesión");
        res.status(401).json({ error: "No se encontró sesión" });
        return;
      }

      const cookieToken = req.cookies?.auth_token;
      const authHeader = req.headers.authorization;
      const headerToken = authHeader?.split(" ")[1];
      const token = cookieToken || headerToken;
      
      // Revocar token si está presente
      if (token) {
        await revokeToken(user.id, token);
      }

      // Actualizar estado de la sesión del usuario con manejo especial para usuarios de Discord
      try {
        if (user.authProvider === 'discord') {
          // Actualizar explícitamente para usuarios de Discord
          await User.update(
            {
              isActiveSession: false,
              lastActiveAt: new Date()
            },
            {
              where: { 
                id: user.id,
                authProvider: 'discord'
              }
            }
          );
          console.log(' Sesión de usuario de Discord desactivada explícitamente');
        } else if (user.authProvider === 'github') {
          // Actualizar estado de la sesión del usuario con manejo especial para usuarios de GitHub
          await User.update(
            {
              isActiveSession: false,
              lastActiveAt: new Date()
            },
            {
              where: { 
                id: user.id,
                authProvider: 'github'
              }
            }
          );
          console.log(' Sesión de usuario de GitHub desactivada explícitamente');
        } else {
          // Actualizar regularmente para otros usuarios
          await User.update(
            {
              isActiveSession: false,
              lastActiveAt: new Date()
            },
            {
              where: { id: user.id }
            }
          );
          console.log(' Sesión de usuario local desactivada');
        }

        // Registrar información de cierre de sesión del usuario con emojis
        const providerEmoji = user.authProvider === 'discord' ? ' Discord' : 
                             user.authProvider === 'github' ? ' GitHub' : 
                             ' Local';

        console.log(`
 Usuario cerró sesión:
 Nombre de usuario: ${user.username}
 Nombre para mostrar: ${user.displayName}
 Proveedor de autenticación: ${providerEmoji}
 Última actividad: ${new Date().toLocaleString()}
 Última IP de inicio de sesión: ${user.lastLoginIp}
 Ubicación: ${user.lastLoginGeo?.city}, ${user.lastLoginGeo?.country}
 Estado de la sesión: Desactivada
        `);

      } catch (updateError) {
        console.error(" Error al actualizar el estado de la sesión del usuario:", updateError);
      }

      // Destruir sesión
      req.session.destroy((err) => {
        if (err) {
          console.error(" Error al destruir la sesión:", err);
          return res.status(500).json({ error: "Error al cerrar sesión" });
        }

        // Limpiar cookies de sesión y autenticación
        res.clearCookie("sessionId");
        res.clearCookie("auth_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          path: '/'
        });
        
        res.json({
          message: " Sesión cerrada correctamente",
          success: true,
          userInfo: {
            username: user.username,
            displayName: user.displayName,
            authProvider: user.authProvider,
            lastActiveAt: new Date(),
            isActiveSession: false
          }
        });
      });
    } catch (error) {
      console.error(" Error durante el cierre de sesión:", error);
      res.status(500).json({ error: "Error al cerrar sesión" });
    }
  }
}