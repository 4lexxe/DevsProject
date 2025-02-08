// github.controller.ts

// Descripción: En este archivo se definen los controladores relacionados con la autenticación OAuth mediante GitHub. Estos controladores se utilizan para manejar la autenticación y autorización de usuarios mediante GitHub, así como para procesar los datos de autenticación y generar respuestas de autenticación.

import { Request, Response } from "express";
import passport from "passport";
import User from "../../user/User";
import { TokenUtils } from "../utils/token.utils";
import { GitHubUtils } from "../utils/github.utils";

export class GitHubController {
  static auth = (req: Request, res: Response, next: any) => {
    const redirectUrl = req.query.redirect as string;

    if (!redirectUrl) {
      return res.status(400).json({ error: "URL de redirección no proporcionada" });
    }

    passport.authenticate("github", {
      scope: ["user:email"],
      state: redirectUrl,
    })(req, res, next);
  };

  static async callback(req: Request, res: Response): Promise<void> {
    passport.authenticate("github", async (err: any, user: User | undefined, info: any) => {
      if (err) {
        console.error("Error de autenticación:", err);
        return res.status(500).json({ error: "Error en la autenticación" });
      }

      if (!user) {
        console.error("No se encontró/creó usuario");
        return res.status(401).json({ error: "No se pudo autenticar el usuario" });
      }

      try {
        const authResponse = await TokenUtils.getAuthResponse(user, req);

        // Asegurar manejo adecuado de la sesión
        await new Promise<void>((resolve, reject) => {
          req.logIn(user, (loginErr) => {
            if (loginErr) {
              console.error("Error al iniciar sesión:", loginErr);
              reject(loginErr);
              return;
            }
            resolve();
          });
        });

        // Actualizar estado de la sesión para usuario de GitHub
        await User.update(
          {
            isActiveSession: true,
            lastActiveAt: new Date()
          },
          {
            where: { 
              id: user.id,
              authProvider: 'github'
            }
          }
        );

        console.log(`
💻 Usuario de GitHub inició sesión:
👤 Nombre de usuario: ${user.username}
📝 Nombre para mostrar: ${user.displayName}
⏰ Hora de inicio de sesión: ${new Date().toLocaleString()}
✅ Estado de la sesión: Activa
        `);

        const isNewUser = user.createdAt === user.updatedAt;
        const formattedUser = GitHubUtils.formatUserResponse(user, authResponse);

        const redirectUrl = req.query.state as string;

        if (!redirectUrl) {
          return res.status(400).json({ error: "URL de redirección no proporcionada" });
        }

        const frontendUrl = `${redirectUrl}?token=${authResponse.token}`;
        res.redirect(frontendUrl);
      } catch (error) {
        console.error("Error al procesar datos del usuario:", error);
        return res.status(500).json({ error: "Error procesando datos del usuario" });
      }
    })(req, res);
  }
}