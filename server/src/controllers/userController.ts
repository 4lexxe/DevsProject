import { Request, Response } from 'express';
import User from '../models/User';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

export class UserController {
  // Validaciones para crear/actualizar usuario
  static userValidations = [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('name').optional().trim().notEmpty().withMessage('El nombre es requerido'),
    body('phone').optional().trim(),
    body('roleId').optional().isInt().withMessage('El roleId debe ser un número entero')
  ];

  // Obtener todos los usuarios
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: ['Role']
      });
      
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  // Obtener un usuario por ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: ['Role']
      });

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  }

  // Actualizar usuario
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { name, email, phone, roleId, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      // Preparar datos de actualización
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (roleId) updateData.roleId = roleId;
      
      // Si se proporciona una nueva contraseña, hashearla
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      // Actualizar usuario
      await user.update(updateData);

      // Obtener usuario actualizado (sin contraseña)
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: ['Role']
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  // Eliminar usuario
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      await user.destroy();
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
}