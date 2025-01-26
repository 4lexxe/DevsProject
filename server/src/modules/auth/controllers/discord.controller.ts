// discord.controller.ts

// Descripción: En este archivo se definen los controladores relacionados con la autenticación OAuth mediante Discord. Estos controladores se utilizan para manejar la autenticación y autorización de usuarios mediante Discord, así como para procesar los datos de autenticación y generar respuestas de autenticación.

import { Request, Response } from "express";
import passport from "passport";
import User from "../../user/User";
import { TokenUtils } from "../utils/token.utils";
import { DiscordUtils } from "../utils/discord.utils";

export class DiscordController {
  static auth = passport.authenticate("discord", {
    scope: ["identify", "email"],
  });

  static async callback(req: Request, res: Response): Promise<void> {
    passport.authenticate("discord", (err: any, user: User | undefined) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Error en la autenticación" });
      }

      if (!user) {
        console.error("No user found/created");
        return res.status(401).json({ error: "No se pudo autenticar el usuario" });
      }

      try {
        const authResponse = TokenUtils.getAuthResponse(user, req);

        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }

          const isNewUser = user.dataValues.createdAt === user.dataValues.updatedAt;
          const formattedUser = DiscordUtils.formatUserResponse(user, authResponse);

          res.json({
            ...authResponse,
            user: formattedUser,
            isNewUser,
          });
        });
      } catch (error) {
        console.error("Error processing user data:", error);
        return res.status(500).json({ error: "Error procesando datos del usuario" });
      }
    })(req, res);
  }
}