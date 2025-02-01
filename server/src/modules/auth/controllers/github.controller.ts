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
      state: redirectUrl, // Pasar la URL de origen como estado
    })(req, res, next);
  };

  static async callback(req: Request, res: Response): Promise<void> {
    passport.authenticate("github", async (err: any, user: User | undefined, info: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Error en la autenticación" });
      }

      if (!user) {
        console.error("No user found/created");
        return res.status(401).json({ error: "No se pudo autenticar el usuario" });
      }

      try {
        const authResponse = await TokenUtils.getAuthResponse(user, req);

        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }

          const isNewUser = user.dataValues.createdAt === user.dataValues.updatedAt;
          const formattedUser = GitHubUtils.formatUserResponse(user, authResponse);

          // Obtener la URL de origen desde el estado
          const redirectUrl = req.query.state as string;

          if (!redirectUrl) {
            return res.status(400).json({ error: "URL de redirección no proporcionada" });
          }

          // Redirigir al frontend con el token en la URL
          const frontendUrl = `${redirectUrl}?token=${authResponse.token}`;
          res.redirect(frontendUrl);
        });
      } catch (error) {
        console.error("Error processing user data:", error);
        return res.status(500).json({ error: "Error procesando datos del usuario" });
      }
    })(req, res);
  }
}