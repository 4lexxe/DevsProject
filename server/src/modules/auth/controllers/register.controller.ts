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

      const authResponse = TokenUtils.getAuthResponse(user, req);

      res.status(201).json({
        message: "Usuario registrado correctamente",
        ...authResponse,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Error en el registro" });
    }
  }
}