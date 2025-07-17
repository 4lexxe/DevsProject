import { Request, Response } from "express";
import User from "../../user/User";

export class CheckEmailController {
  static async handle(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email es requerido",
        });
        return;
      }

      // Buscar si el email existe en la base de datos
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() }
      });

      res.status(200).json({
        success: true,
        exists: !!existingUser,
        message: existingUser ? "Email encontrado" : "Email no encontrado"
      });

    } catch (error) {
      console.error("Error al verificar email:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        exists: false
      });
    }
  }
}
