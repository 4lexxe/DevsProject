// user.controller.ts
import { Request, Response } from 'express';
import User from '../user/User';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Role from '../role/Role';

// Interface para los campos actualizables
interface UpdatableUserFields {
  name?: string;
  email?: string;
  phone?: string | null;
  roleId?: number;
  username?: string | null;
  displayName?: string | null;
  password?: string;
}

// Extensión del tipo Request de Express
declare module 'express' {
  interface Request {
    geoLocation?: {
      ip?: string;
      city?: string;
      region?: string;
      country?: string;
      loc?: [number, number];
      timezone?: string;
      isProxy?: boolean;
      anonymizedIp?: string;
      org?: string;
      rawIp?: string;
    };
  }
}

export class UserController {
  static userValidations = [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('roleId').optional().isInt().withMessage('El roleId debe ser un número entero'),
    body('registrationIp').optional().isIP().withMessage('IP inválida'),
    body('lastLoginIp').optional().isIP().withMessage('IP inválida')
  ];

  static async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll({
        attributes: { 
          exclude: [
            'password', 
            'registrationIp',
            'lastLoginIp',
            'registrationGeo',
            'lastLoginGeo',
            'suspiciousActivities'
          ]
        },
        include: [{
          model: Role,
          attributes: ['id', 'name', 'description']
        }]
      });
      
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  static async getUserSecurityDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!(req.user as User)?.hasPermission('VIEW_SECURITY_DETAILS')) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }

      const user = await User.findByPk(id, {
        attributes: ['id', 'registrationIp', 'lastLoginIp', 'registrationGeo', 'lastLoginGeo', 'suspiciousActivities'],
        include: [{
          model: Role,
          attributes: ['name']
        }]
      });

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      res.json({
        id: user.id,
        role: user.Role?.name,
        registrationGeo: user.registrationGeo,
        lastLoginIp: user.lastLoginIp,
        registrationLocation: user.registrationGeo ? {
          city: user.registrationGeo.city,
          country: user.registrationGeo.country,
          coordinates: user.registrationGeo.loc
        } : null,
        lastLoginLocation: user.lastLoginGeo ? {
          city: user.lastLoginGeo.city,
          country: user.lastLoginGeo.country,
          coordinates: user.lastLoginGeo.loc
        } : null,
        suspiciousActivities: user.suspiciousActivities.length
      });
    } catch (error) {
      console.error('Error fetching security details:', error);
      res.status(500).json({ error: 'Error al obtener detalles de seguridad' });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { 
        name, 
        email, 
        phone, 
        roleId, 
        password,
        username,
        displayName
      } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const updatableFields: UpdatableUserFields = {
        name,
        email,
        phone,
        roleId,
        username,
        displayName
      };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatableFields.password = await bcrypt.hash(password, salt);
      }

      await user.update(updatableFields);

      const updatedUser = await User.findByPk(id, {
        attributes: { 
          exclude: [
            'password',
            'registrationIp',
            'lastLoginIp',
            'registrationGeo',
            'lastLoginGeo',
            'suspiciousActivities'
          ]
        },
        include: [{
          model: Role,
          attributes: ['id', 'name', 'description']
        }]
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      await user.update({
        suspiciousActivities: [
          ...user.suspiciousActivities,
          {
            type: 'ACCOUNT_DELETED',
            ip: req.ip || 'unknown',
            geo: req.geoLocation || {},
            timestamp: new Date()
          }
        ]
      });

      await user.destroy();
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
}