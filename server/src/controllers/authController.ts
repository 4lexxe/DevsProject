import type { Request, Response } from "express"
import passport from "passport"
import User from "../models/User"
import jwt from "jsonwebtoken"
import { body, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import { AuthProvider } from "../models/User"

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
  ]

  // Validaciones para login
  static loginValidations = [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ]

  // Generar token JWT
  private static generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    )
  }

  // Registro con email
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Verificar errores de validación
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const { email, password, name, username, roleId } = req.body

      // Verificar si el email ya está registrado
      const existingUser = await User.findOne({
        where: {
          email,
          authProvider: AuthProvider.LOCAL,
        },
      })

      if (existingUser) {
        res.status(400).json({ error: "El email ya está registrado" })
        return
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Crear usuario
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        username,
        authProvider: AuthProvider.LOCAL,
        roleId: roleId || 1, // roleId proporcionado o el valor predeterminado es 1 (usuario normal)
      })

      const token = AuthController.generateToken(user) // Generar token JWT

        res.status(201).json({
          message: "Usuario registrado correctamente",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            roleId: user.roleId,
          },
        })
      } catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Error en el registro" })
      }
    }

  // Login con email
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Verificar errores de validación
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
      }

      const { email, password } = req.body
      const user = await User.findOne({
        where: { email, authProvider: AuthProvider.LOCAL },
        include: ["Role"],
      })

      if (!user) {
        res.status(401).json({ error: "Credenciales inválidas" })
        return
      }

      if (!user.password) {
        res.status(401).json({ error: "Credenciales inválidas" })
        return
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        res.status(401).json({ error: "Credenciales inválidas" })
        return
      }

      passport.authenticate("local", (err: any, user: User | undefined, info: any) => {
        if (err) {
          console.error("Authentication error:", err)
          res.status(500).json({ error: "Error en la autenticación" })
          return
        }

        if (!user) {
          res.status(401).json({ error: info.message || "Credenciales inválidas" })
          return
        }

        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr)
            res.status(500).json({ error: "Error al iniciar sesión" })
            return
          }

          const token = AuthController.generateToken(user)

          res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
              roleId: user.roleId,
              role: user.dataValues.Role
                ? {
                    id: user.dataValues.Role.dataValues.id,
                    name: user.dataValues.Role.dataValues.name,
                    description: user.dataValues.Role.dataValues.description,
                  }
                : null,
            },
          })
        })
      })(req, res)
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Error en el inicio de sesión" })
    }
  }

  // Iniciar autenticación con Discord
  static discordAuth = passport.authenticate("discord", {
    scope: ["identify", "email"],
  })

  // Callback después de la autenticación con Discord
  static discordCallback = (req: Request, res: Response) => {
    passport.authenticate("discord", (err: any, user: User | undefined) => {
      if (err) {
        console.error("Authentication error:", err)
        return res.status(500).json({ error: "Error en la autenticación" })
      }

      if (!user) {
        console.error("No user found/created")
        return res.status(401).json({ error: "No se pudo autenticar el usuario" })
      }

      try {
        // Iniciar sesión con Passport
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr)
            return res.status(500).json({ error: "Error al iniciar sesión" })
          }

          // Filtrar los datos sensibles del providerMetadata
          const safeProviderMetadata = user.dataValues.providerMetadata?.profile
            ? {
                id: user.dataValues.providerMetadata.profile.id,
                username: user.dataValues.providerMetadata.profile.username,
                global_name: user.dataValues.providerMetadata.profile.global_name,
                avatar: user.dataValues.providerMetadata.profile.avatar,
                locale: user.dataValues.providerMetadata.profile.locale,
                verified: user.dataValues.providerMetadata.profile.verified,
              }
            : null

          // Determinar si el usuario es nuevo
          const isNewUser = user.dataValues.createdAt === user.dataValues.updatedAt

          // Enviar datos del usuario
          res.json({
            user: {
              id: user.dataValues.id,
              name: user.dataValues.name,
              email: user.dataValues.email,
              avatar: user.dataValues.avatar,
              username: user.dataValues.username,
              displayName: user.dataValues.displayName,
              roleId: user.dataValues.roleId,
              role: user.dataValues.Role
                ? {
                    id: user.dataValues.Role.dataValues.id,
                    name: user.dataValues.Role.dataValues.name,
                    description: user.dataValues.Role.dataValues.description,
                  }
                : null,
              authProvider: user.dataValues.authProvider,
              authProviderId: user.dataValues.authProviderId,
              providerMetadata: safeProviderMetadata,
              createdAt: user.dataValues.createdAt,
              updatedAt: user.dataValues.updatedAt,
            },
            isNewUser,
          })
        })
      } catch (error) {
        console.error("Error processing user data:", error)
        return res.status(500).json({ error: "Error procesando datos del usuario" })
      }
    })(req, res)
  }

  // Verificar si el usuario está autenticado
  static async verifyAuth(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        authenticated: false,
        error: "No autenticado",
      })
      return
    }

    try {
      const user = req.user as User
      const safeProviderMetadata = user.dataValues.providerMetadata?.profile
        ? {
            id: user.dataValues.providerMetadata.profile.id,
            username: user.dataValues.providerMetadata.profile.username,
            global_name: user.dataValues.providerMetadata.profile.global_name,
            avatar: user.dataValues.providerMetadata.profile.avatar,
            locale: user.dataValues.providerMetadata.profile.locale,
            verified: user.dataValues.providerMetadata.profile.verified,
          }
        : null

      res.json({
        authenticated: true,
        user: {
          id: user.dataValues.id,
          name: user.dataValues.name,
          email: user.dataValues.email,
          avatar: user.dataValues.avatar,
          username: user.dataValues.username,
          displayName: user.dataValues.displayName,
          roleId: user.dataValues.roleId,
          role: user.dataValues.Role
            ? {
                id: user.dataValues.Role.dataValues.id,
                name: user.dataValues.Role.dataValues.name,
                description: user.dataValues.Role.dataValues.description,
              }
            : null,
          authProvider: user.dataValues.authProvider,
          authProviderId: user.dataValues.authProviderId,
          providerMetadata: safeProviderMetadata,
          createdAt: user.dataValues.createdAt,
          updatedAt: user.dataValues.updatedAt,
        },
      })
    } catch (error) {
      console.error("Error verifying authentication:", error)
      res.status(500).json({
        authenticated: false,
        error: "Error verificando autenticación",
      })
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "No autenticado" })
      return
    }

    try {
      const user = await User.findByPk((req.user as User).id, {
        include: ["Role"],
      })

      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" })
        return
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
        : null

      res.json({
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        avatar: user.dataValues.avatar,
        username: user.dataValues.username,
        displayName: user.dataValues.displayName,
        roleId: user.dataValues.roleId,
        role: user.dataValues.Role
          ? {
              id: user.dataValues.Role.dataValues.id,
              name: user.dataValues.Role.dataValues.name,
              description: user.dataValues.Role.dataValues.description,
            }
          : null,
        authProvider: user.dataValues.authProvider,
        authProviderId: user.dataValues.authProviderId,
        providerMetadata: safeProviderMetadata,
        createdAt: user.dataValues.createdAt,
        updatedAt: user.dataValues.updatedAt,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
      res.status(500).json({ error: "Error obteniendo datos del usuario" })
    }
  }

  // Cerrar sesión
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ error: "No hay sesión activa" })
        return
      }

      // Destruir la sesión
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err)
          res.status(500).json({ error: "Error al cerrar sesión" })
          return
        }

        // Limpiar la cookie de sesión
        res.clearCookie("sessionId")

        res.json({
          message: "Sesión cerrada correctamente",
          success: true,
        })
      })
    } catch (error) {
      console.error("Error during logout:", error)
      res.status(500).json({ error: "Error al cerrar sesión" })
    }
  }

  // Métodos de autenticación con GitHub
  static githubAuth = passport.authenticate("github", {
    scope: ["user:email"],
  })

  static githubCallback = (req: Request, res: Response) => {
    passport.authenticate("github", (err: any, user: User | undefined) => {
      if (err) {
        console.error("Authentication error:", err)
        return res.status(500).json({ error: "Error en la autenticación" })
      }

      if (!user) {
        console.error("No user found/created")
        return res.status(401).json({ error: "No se pudo autenticar el usuario" })
      }

      try {
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr)
            return res.status(500).json({ error: "Error al iniciar sesión" })
          }

          const safeProviderMetadata = user.dataValues.providerMetadata?.profile
            ? {
                id: user.dataValues.providerMetadata.profile.id,
                username: user.dataValues.providerMetadata.profile.username,
                displayName: user.dataValues.providerMetadata.profile.displayName,
                avatar: user.dataValues.providerMetadata.profile.photos?.[0]?.value,
              }
            : null

          const isNewUser = user.dataValues.createdAt === user.dataValues.updatedAt

          res.json({
            user: {
              id: user.dataValues.id,
              name: user.dataValues.name,
              email: user.dataValues.email,
              avatar: user.dataValues.avatar,
              username: user.dataValues.username,
              displayName: user.dataValues.displayName,
              roleId: user.dataValues.roleId,
              role: user.dataValues.Role
                ? {
                    id: user.dataValues.Role.dataValues.id,
                    name: user.dataValues.Role.dataValues.name,
                    description: user.dataValues.Role.dataValues.description,
                  }
                : null,
              authProvider: user.dataValues.authProvider,
              authProviderId: user.dataValues.authProviderId,
              providerMetadata: safeProviderMetadata,
              createdAt: user.dataValues.createdAt,
              updatedAt: user.dataValues.updatedAt,
            },
            isNewUser,
          })
        })
      } catch (error) {
        console.error("Error processing user data:", error)
        return res.status(500).json({ error: "Error procesando datos del usuario" })
      }
    })(req, res)
  }
}

