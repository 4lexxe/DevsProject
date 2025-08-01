// register.controller.ts

// Descripción: En este archivo se define el controlador para el registro de usuarios. Este controlador se utiliza para manejar la creación de nuevos usuarios en la base de datos, la validación de datos de registro y la generación de respuestas de registro para los clientes.

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../../user/User";
import { AuthProvider } from "../../user/User";
import { TokenUtils } from "../utils/token.utils";

export class RegisterController {
  static async handle(req: Request, res: Response): Promise<void> {
    try {
      // Verificar si hay errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Obtener los datos del cuerpo de la solicitud
      const { email, password, name, username } = req.body;

      // Verificar si el correo ya está registrado
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

      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        username,
        authProvider: AuthProvider.LOCAL,
        roleId: 1,
      });

      // Generar la respuesta de autenticación con un token
      const authResponse = await TokenUtils.getAuthResponse(user, req);

      // Configurar cookie HttpOnly con el token
      res.cookie('auth_token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        path: '/'
      });

      // Responder con el mensaje de éxito (sin enviar el token en JSON)
      res.status(201).json({
        message: "Usuario registrado correctamente",
        user: authResponse.user,
      });
    } catch (error) {
      console.error("Error de registro:", error);
      res.status(500).json({ error: "Error en el registro" });
    }
  }
}