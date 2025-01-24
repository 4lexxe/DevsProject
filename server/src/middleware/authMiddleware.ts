import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

interface JwtPayload {
  id: number
  email: string
  roleId: number
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      res.status(401).json({ error: "Token no proporcionado" })
      return
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      const user = await User.findByPk(decoded.id, {
        include: ["Role"],
      })

      if (!user) {
        res.status(401).json({ error: "Usuario no encontrado" })
        return
      }

      req.user = user
      next()
    } catch (jwtError) {
      console.error("Error al verificar el token JWT:", jwtError)
      res.status(401).json({ error: "Token inválido o expirado" })
    }
  } catch (error) {
    console.error("Error en el middleware de autenticación:", error)
    res.status(500).json({ error: "Error interno del servidor en la autenticación" })
  }
}

