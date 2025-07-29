import { Request, Response } from 'express';
import User from '../user/User';
import Role from '../role/Role';
import Permission from '../role/Permission';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';


// Interface para los campos actualizables
interface UpdatableUserFields {
  name?: string;
  email?: string;
  surname?: string;
  phone?: string | null;
  roleId?: number;
  username?: string | null;
  displayName?: string | null;
  identificationNumber?: string | null;
  identificationType?: string | null;
  password?: string;
  isActiveSession?: boolean; // Nuevo campo para actualizar sesión activa
  lastActiveAt?: Date; // Campo para la última actividad
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

  // Obtener todos los usuarios (público)
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
          as: 'Role', // Usa el alias definido en la relación
          attributes: ['id', 'name', 'description'],
          include: [{
            model: Permission,
            through: { attributes: [] }, // Excluir datos de la tabla intermedia
            attributes: ['id', 'name', 'description']
          }]
        }] 
      });
      
      // Transformar los datos para incluir permisos en el formato esperado
      const usersData = users.map(user => {
        const userData = user.toJSON();
        if (userData.Role && userData.Role.Permissions) {
          userData.Role.permissions = userData.Role.Permissions.map((permission: any) => permission.name);
          delete userData.Role.Permissions; // Eliminar la propiedad original
        }
        return userData;
      });
      
      res.json(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  // Obtener un usuario por ID (público)
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
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
          as: 'Role', // Usa el alias definido en la relación
          attributes: ['id', 'name', 'description'],
          include: [{
            model: Permission,
            through: { attributes: [] }, // Excluir datos de la tabla intermedia
            attributes: ['id', 'name', 'description']
          }]
        }]
      });
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      // Transformar los datos para incluir permisos en el formato esperado
      const userData = user.toJSON();
      if (userData.Role && userData.Role.Permissions) {
        userData.Role.permissions = userData.Role.Permissions.map((permission: any) => permission.name);
        delete userData.Role.Permissions; // Eliminar la propiedad original
      }

      res.json(userData);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  }

  // Obtener detalles de seguridad de un usuario (requiere autenticación y permisos)
  static async getUserSecurityDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!(req.user as User)?.hasPermission('VIEW_SECURITY_DETAILS')) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      const user = await User.findByPk(id, {
        attributes: [
          'id',
          'registrationIp',
          'lastLoginIp',
          'registrationGeo',
          'lastLoginGeo',
          'suspiciousActivities',
          'isActiveSession',
          'lastActiveAt',
        ],
        include: [{
          model: Role,
          as: 'Role', // Usa el alias definido en la relación
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
        suspiciousActivities: user.suspiciousActivities.length,
        isActiveSession: user.isActiveSession, // Incluir isActiveSession
        lastActiveAt: user.lastActiveAt,       // Incluir lastActiveAt
      });
    } catch (error) {
      console.error('Error fetching security details:', error);
      res.status(500).json({ error: 'Error al obtener detalles de seguridad' });
    }
  }

  // Actualizar un usuario (requiere autenticación y permisos)
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
        displayName,
        isActiveSession, // Permitir actualizar isActiveSession
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
        displayName,
        isActiveSession, // Actualizar isActiveSession si está presente
      };
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatableFields.password = await bcrypt.hash(password, salt);
      }
      // Si se proporciona isActiveSession, actualizar lastActiveAt también
      if (isActiveSession !== undefined) {
        updatableFields.lastActiveAt = new Date();
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
          as: 'Role', // Usa el alias definido en la relación
          attributes: ['id', 'name', 'description']
        }]
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  static async updateForSubscription(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const { id } = req.params;
      const { 
        name, 
        surname,
        email,
        phone,
        identificationNumber,
        identificationType,
      } = req.body;
      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      const updatableFields: UpdatableUserFields = {
        email,
        name,
        surname,
        phone,
        identificationNumber,
        identificationType,
      };
      
      await user.update(updatableFields);
      
      res.status(200).json({
        message: 'Usuario actualizado correctamente',
        status: 'success',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }

  // Eliminar un usuario (requiere autenticación y permisos)
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      // Marcar la sesión como inactiva antes de eliminar el usuario
      user.isActiveSession = false;
      user.lastActiveAt = new Date();
      await user.save();
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