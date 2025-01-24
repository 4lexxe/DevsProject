import { response, type Request, type Response } from "express";
import passport from "passport";
import User from "../user/User";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { AuthProvider } from "../user/User";
import { registerToken, revokeToken, userTokens } from "../../shared/middleware/authMiddleware";

interface TokenSession {
  token: string;
  createdAt: Date;
  lastUsed: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export class AuthController {
  // Validaciones para registro
  static registerValidations = [
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres")
      .matches(/\d/)
      .withMessage("La contraseña debe contener al menos un número")
      .matches(/[A-Z]/)
      .withMessage("La contraseña debe contener al menos una mayúscula"),
    body("name").trim().notEmpty().withMessage("El nombre es requerido"),
    body("username").trim().notEmpty().withMessage("El username es requerido"),
    body("roleId").optional().isInt().withMessage("El roleId debe ser un número entero"),
  ];

  // Validaciones para login
  static loginValidations = [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ];

  // Generar token JWT con información extendida
  private static generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        username: user.username,
        authProvider: user.authProvider,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );
  }

  // Método público para generar respuesta de autenticación
  public static getAuthResponse(user: User, req: Request) {
    const token = this.generateToken(user);
    // Registrar el nuevo token
    registerToken(user.id, token, req);
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        authProvider: user.authProvider,
      },
      sessions: userTokens.get(user.id) || [],
    };
  }

  // Registro con email
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, name, username, roleId } = req.body;

      const existingUser = await User.findOne({
        where: {
          email,
          authProvider: AuthProvider.LOCAL,
        },
      });

      if (existingUser) {
        res.status(400).json({ error: "El email ya está registrado" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        username,
        authProvider: AuthProvider.LOCAL,
        roleId: roleId || 1,
      });

      const authResponse = AuthController.getAuthResponse(user, req);

      res.status(201).json({
        message: "Usuario registrado correctamente",
        ...authResponse,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Error en el registro" });
    }
  }

  // Login con email
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email, authProvider: AuthProvider.LOCAL },
        include: ["Role"],
      });

      if (!user || !user.password) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      const authResponse = AuthController.getAuthResponse(user, req);

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          res.status(500).json({ error: "Error al iniciar sesión" });
          return;
        }

        res.json({
          message: "Inicio de sesión exitoso",
          ...authResponse,
          user: {
            ...authResponse.user,
            role: user.dataValues.Role ? {
              id: user.dataValues.Role.id,
              name: user.dataValues.Role.name,
              description: user.dataValues.Role.description,
            } : null,
          },
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Error en el inicio de sesión" });
    }
  }

  // Iniciar autenticación con Discord
  static discordAuth = passport.authenticate("discord", {
    scope: ["identify", "email"],
  });

  // Callback después de la autenticación con Discord
  static discordCallback = (req: Request, res: Response) => {
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
        const authResponse = AuthController.getAuthResponse(user, req);

        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }

          const safeProviderMetadata = user.dataValues.providerMetadata?.profile
            ? {
                id: user.dataValues.providerMetadata.profile.id,
                username: user.dataValues.providerMetadata.profile.username,
                global_name: user.dataValues.providerMetadata.profile.global_name,
                avatar: user.dataValues.providerMetadata.profile.avatar,
                locale: user.dataValues.providerMetadata.profile.locale,
                verified: user.dataValues.providerMetadata.profile.verified,
              }
            : null;

          const isNewUser = user.dataValues.createdAt === user.dataValues.updatedAt;

          res.json({
            ...authResponse,
            user: {
              ...authResponse.user,
              name: user.dataValues.name,
              email: user.dataValues.email,
              avatar: user.dataValues.avatar,
              username: user.dataValues.username,
              displayName: user.dataValues.displayName,
              roleId: user.dataValues.roleId,
              role: user.dataValues.Role ? {
                id: user.dataValues.Role.id,
                name: user.dataValues.Role.name,
                description: user.dataValues.Role.description,
              } : null,
              authProvider: user.dataValues.authProvider,
              authProviderId: user.dataValues.authProviderId,
              providerMetadata: safeProviderMetadata,
              createdAt: user.dataValues.createdAt,
              updatedAt: user.dataValues.updatedAt,
            },
            isNewUser,
          });
        });
      } catch (error) {
        console.error("Error processing user data:", error);
        return res.status(500).json({ error: "Error procesando datos del usuario" });
      }
    })(req, res);
  };

  // Métodos de autenticación con GitHub
  static githubAuth = passport.authenticate("github", {
    scope: ["user:email"],
  });

  static githubCallback = (req: Request, res: Response) => {
    passport.authenticate("github", (err: any, user: User | undefined) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ error: "Error en la autenticación" });
      }

      if (!user) {
        console.error("No user found/created");
        return res.status(401).json({ error: "No se pudo autenticar el usuario" });
      }

      try {
        const authResponse = AuthController.getAuthResponse(user, req);

        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            return res.status(500).json({ error: "Error al iniciar sesión" });
          }

          const safeProviderMetadata = user.dataValues.providerMetadata?.profile
            ? {
                id: user.dataValues.providerMetadata.profile.id,
                username: user.dataValues.providerMetadata.profile.username,
                displayName: user.dataValues.providerMetadata.profile.displayName,
                avatar: user.dataValues.providerMetadata.profile.photos?.[0]?.value,
              }
            : null;

          const isNewUser = user.dataValues.createdAt === user.dataValues.updatedAt;

          res.json({
            ...authResponse,
            user: {
              ...authResponse.user,
              name: user.dataValues.name,
              email: user.dataValues.email,
              avatar: user.dataValues.avatar,
              username: user.dataValues.username,
              displayName: user.dataValues.displayName,
              roleId: user.dataValues.roleId,
              role: user.dataValues.Role ? {
                id: user.dataValues.Role.id,
                name: user.dataValues.Role.name,
                description: user.dataValues.Role.description,
              } : null,
              authProvider: user.dataValues.authProvider,
              authProviderId: user.dataValues.authProviderId,
              providerMetadata: safeProviderMetadata,
              createdAt: user.dataValues.createdAt,
              updatedAt: user.dataValues.updatedAt,
            },
            isNewUser,
          });
        });
      } catch (error) {
        console.error("Error processing user data:", error);
        return res.status(500).json({ error: "Error procesando datos del usuario" });
      }
    })(req, res);
  };

  // Verificar autenticación con información de sesión
  static async verifyAuth(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        authenticated: false,
        error: "No autenticado",
      });
      return;
    }

    try {
      const user = req.user as User;
      const token = req.headers.authorization?.split(" ")[1];
      const sessions = userTokens.get(user.id) || [];
      interface CurrentSession extends TokenSession {
        token: string;
        createdAt: Date;
        lastUsed: Date;
        expiresAt: Date;
        userAgent?: string;
        ipAddress?: string;
      }

      // Then in the code selection:
      const currentSession: CurrentSession | null = token ? (sessions.find((s: TokenSession): boolean => s.token === token) as CurrentSession) ?? null : null;

      const safeProviderMetadata = user.dataValues.providerMetadata?.profile
        ? {
            id: user.dataValues.providerMetadata.profile.id,
            username: user.dataValues.providerMetadata.profile.username,
            global_name: user.dataValues.providerMetadata.profile.global_name,
            avatar: user.dataValues.providerMetadata.profile.avatar,
            locale: user.dataValues.providerMetadata.profile.locale,
            verified: user.dataValues.providerMetadata.profile.verified,
          }
        : null;

      res.json({
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
          providerMetadata: safeProviderMetadata,
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
      console.error("Error verifying authentication:", error);
      res.status(500).json({
        authenticated: false,
        error: "Error verificando autenticación",
      });
    }
  }

  // Obtener sesiones activas
  static async getActiveSessions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      if (!userId) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const sessions = userTokens.get(userId) || [];
      interface SessionResponse {
        token: string;
        createdAt: Date;
        lastUsed: Date;
        expiresAt: Date;
        userAgent?: string;
        ipAddress?: string;
      }

            res.json({ 
              sessions: sessions.map((session: TokenSession): SessionResponse => ({
                ...session,
                token: session.token.substring(0, 10) + '...' // Ocultar token completo
              }))
            });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Error al obtener sesiones activas" });
    }
  }

  // Revocar una sesión específica
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
      res.json({ 
        message: "Sesión revocada correctamente",
        remainingSessions: userTokens.get(userId) || []
      });
    } catch (error) {
      console.error("Error revoking session:", error);
      res.status(500).json({ error: "Error al revocar sesión" });
    }
  }

  // Revocar todas las sesiones excepto la actual
  static async revokeOtherSessions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      const currentToken = req.headers.authorization?.split(" ")[1];

      if (!userId || !currentToken) {
        res.status(401).json({ error: "Usuario no autenticado" });
        return;
      }

      const sessions = userTokens.get(userId) || [];
      const updatedSessions: TokenSession[] = sessions.filter((session: TokenSession) => session.token === currentToken);
      userTokens.set(userId, updatedSessions);

      res.json({ 
        message: "Otras sesiones revocadas correctamente",
        currentSession: {
          ...updatedSessions[0],
          token: updatedSessions[0].token.substring(0, 10) + '...'
        }
      });
    } catch (error) {
      console.error("Error revoking other sessions:", error);
      res.status(500).json({ error: "Error al revocar otras sesiones" });
    }
  }

  // Cerrar sesión
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as User)?.id;
      const token = req.headers.authorization?.split(" ")[1];

      if (userId && token) {
        // Revocar el token actual
        revokeToken(userId, token);
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          res.status(500).json({ error: "Error al cerrar sesión" });
          return;
        }

        res.clearCookie("sessionId");
        res.json({
          message: "Sesión cerrada correctamente",
          success: true,
        });
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ error: "Error al cerrar sesión" });
    }
  }

  // Renovar token
  static async refreshToken(req: Request, res: Response): Promise<void> {
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

      // Revocar token anterior
      revokeToken(userId, oldToken);

      // Generar nuevo token
      const authResponse = AuthController.getAuthResponse(user, req);

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