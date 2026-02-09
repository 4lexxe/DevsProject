// discord.controller.ts

// Descripción: En este archivo se definen los controladores relacionados con la autenticación OAuth mediante Discord. Estos controladores se utilizan para manejar la autenticación y autorización de usuarios mediante Discord, así como para procesar los datos de autenticación y generar respuestas de autenticación.

import { Request, Response } from "express";
import passport from "passport";
import User from "../../user/User";
import { TokenUtils } from "../utils/token.utils";
import { DiscordUtils } from "../utils/discord.utils";

export class DiscordController {
  static auth = (req: Request, res: Response, next: any) => {
    const redirectUrl = req.query.redirect as string;

    if (!redirectUrl) {
      return res.status(400).json({ error: "URL de redirección no proporcionada" });
    }

    passport.authenticate("discord", {
      scope: ["identify", "email"],
      state: redirectUrl,
    })(req, res, next);
  };

  static async callback(req: Request, res: Response): Promise<void> {
    passport.authenticate("discord", async (err: any, user: User | undefined, info: any) => {
      if (err) {
        console.error(" Error de autenticación con Discord:", err);
        
        // Proporcionar información más detallada sobre el error
        if (err.code === 'invalid_client') {
          const clientId = process.env.DISCORD_CLIENT_ID || '';
          const maxSnowflake = BigInt('9223372036854775807');
          const clientIdBigInt = clientId ? BigInt(clientId) : null;
          
          console.error(" Diagnóstico del error 'invalid_client':");
          console.error(`   Client ID actual: ${clientId} (${clientId.length} dígitos)`);
          
          if (clientIdBigInt && clientIdBigInt > maxSnowflake) {
            console.error("    El Client ID es demasiado grande (máximo permitido: 19 dígitos)");
            console.error("    Posibles causas:");
            console.error("      - Estás copiando el Application ID en lugar del Client ID");
            console.error("      - Hay un error al copiar (quizás un dígito extra)");
            console.error("      - Estás copiando dos números juntos");
            console.error("    Solución:");
            console.error("      1. Ve a https://discord.com/developers/applications");
            console.error("      2. Selecciona tu aplicación > OAuth2 > General");
            console.error("      3. Copia SOLO el 'Client ID' (debe tener 17-19 dígitos)");
            console.error("      4. Verifica que no tenga espacios ni caracteres extra");
            console.error("      5. Actualiza DISCORD_CLIENT_ID en tu .env");
          } else {
            console.error("   - Verifica que DISCORD_CLIENT_ID y DISCORD_CLIENT_SECRET sean correctos");
            console.error("   - Verifica que la URL de callback coincida con la configurada en Discord:");
            console.error(`     Configurada en .env: ${process.env.DISCORD_CALLBACK_URL}`);
            console.error("   - Ve a https://discord.com/developers/applications y verifica:");
            console.error("     * Que la aplicación esté activa");
            console.error("     * Que las credenciales coincidan");
            console.error("     * Que la URL de redirect esté en la lista de OAuth2 Redirects");
          }
          
          return res.status(500).json({ 
            error: "Error de autenticación con Discord: credenciales inválidas",
            details: clientIdBigInt && clientIdBigInt > maxSnowflake 
              ? `El Client ID es inválido (${clientId.length} dígitos, máximo permitido: 19). Verifica que estés copiando el Client ID correcto de Discord.`
              : "Verifica que las credenciales de Discord sean correctas y que la URL de callback esté configurada en el panel de Discord"
          });
        }
        
        return res.status(500).json({ 
          error: "Error en la autenticación con Discord",
          details: err.message || "Error desconocido"
        });
      }
  
      if (!user) {
        console.error(" No se encontró/creó usuario");
        console.error("   Info adicional:", info);
        return res.status(401).json({ 
          error: "No se pudo autenticar el usuario",
          details: info?.message || "El usuario no pudo ser autenticado o creado"
        });
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

        // Actualizar estado de la sesión
        await User.update(
          {
            isActiveSession: true,
            lastActiveAt: new Date()
          },
          {
            where: { id: user.id }
          }
        );

        console.log(`
 Usuario de Discord inició sesión:
 Nombre de usuario: ${user.username}
 Nombre para mostrar: ${user.displayName}
 Hora de inicio de sesión: ${new Date().toLocaleString()}
 Estado de la sesión: Activa
        `);

        const isNewUser = user.createdAt === user.updatedAt;
        const formattedUser = DiscordUtils.formatUserResponse(user, authResponse);
  
        const redirectUrl = req.query.state as string;
  
        if (!redirectUrl) {
          return res.status(400).json({ error: "URL de redirección no proporcionada" });
        }

        // Configurar cookie HttpOnly con el token
        res.cookie('auth_token', authResponse.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
          path: '/'
        });
  
        // Redirigir sin el token en la URL por seguridad
        res.redirect(redirectUrl);
      } catch (error) {
        console.error("Error al procesar datos del usuario:", error);
        return res.status(500).json({ error: "Error procesando datos del usuario" });
      }
    })(req, res);
  }
}