import { Request, Response } from 'express';
import User from '../user/User';
import Role from '../role/Role';
import Permission from '../Permission/Permission';
import UserPermissionException from './UserPermissionExceptions';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

// Interface para los campos actualizables
interface UpdatableUserFields {
  name?: string;
  email?: string;
  phone?: string | null;
  roleId?: number;
  username?: string | null;
  displayName?: string | null;
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
  static userValidations = [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('roleId').optional().isInt().withMessage('El roleId debe ser un número entero'),
    body('registrationIp').optional().isIP().withMessage('IP inválida'),
    body('lastLoginIp').optional().isIP().withMessage('IP inválida')
  ];

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
          attributes: ['id', 'name', 'description']
        }] 
      });
      
      res.json(users);
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
          attributes: ['id', 'name', 'description']
        }]
      });
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  }

  // Obtener detalles de seguridad de un usuario (requiere autenticación y permisos)
  static async getUserSecurityDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Obtener los permisos del usuario
      const userPermissions = (req.user as User)?.Permissions;
      console.log('Permisos del usuario:', userPermissions);
  
      // Obtener los permisos bloqueados
      const blockedPermissions = await UserPermissionException.findAll({
        where: { userId: id },
        include: [{ model: Permission, as: 'Permission' }],
      });
      console.log('Permisos bloqueados:', blockedPermissions);
  
      // Obtener los permisos combinados (rol + personalizados)
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'Role',
            include: [{ model: Permission, as: 'Permissions' }],
          },
          {
            model: Permission,
            as: 'Permissions',
          },
        ],
      });
  
      const combinedPermissions = [
        ...(user?.Role?.Permissions?.map((p) => p.name) || []),
        ...(user?.Permissions?.map((p) => p.name) || []),
      ];
      console.log('Permisos combinados:', combinedPermissions);
  
      // Buscar el usuario en la base de datos
      const userDetails = await User.findByPk(id, {
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
          as: 'Role',
          attributes: ['name'],
        }],
      });
  
      // Si el usuario no existe, devolver un error 404
      if (!userDetails) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
  
      // Devolver los detalles de seguridad del usuario
      res.json({
        id: userDetails.id,
        role: userDetails.Role?.name,
        registrationGeo: userDetails.registrationGeo,
        lastLoginIp: userDetails.lastLoginIp,
        registrationLocation: userDetails.registrationGeo ? {
          city: userDetails.registrationGeo.city,
          country: userDetails.registrationGeo.country,
          coordinates: userDetails.registrationGeo.loc,
        } : null,
        lastLoginLocation: userDetails.lastLoginGeo ? {
          city: userDetails.lastLoginGeo.city,
          country: userDetails.lastLoginGeo.country,
          coordinates: userDetails.lastLoginGeo.loc,
        } : null,
        suspiciousActivities: userDetails.suspiciousActivities.length,
        isActiveSession: userDetails.isActiveSession,
        lastActiveAt: userDetails.lastActiveAt,
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

  // Asignar un permiso personalizado a un usuario
  static async assignCustomPermission(req: Request, res: Response): Promise<void> {
    try {
      const { userId, permissionId } = req.body;
  
      // Validar que userId y permissionId estén presentes
      if (!userId || !permissionId) {
        res.status(400).json({ error: 'userId y permissionId son requeridos' });
        return;
      }
  
      const user = await User.findByPk(userId);
      const permission = await Permission.findByPk(permissionId);
  
      if (!user || !permission) {
        res.status(404).json({ error: 'Usuario o permiso no encontrado' });
        return;
      }
  
      // Asignar el permiso personalizado
      await user.addPermission(permission);
  
      res.json({ message: 'Permiso asignado correctamente' });
    } catch (error) {
      console.error('Error assigning custom permission:', error);
      res.status(500).json({ error: 'Error al asignar permiso personalizado' });
    }
  }

  // Bloquear un permiso para un usuario (excepción de permiso)
  static async blockPermission(req: Request, res: Response): Promise<void> {
    try {
      const { userId, permissionId } = req.body;
  
      // Validar que userId y permissionId estén presentes
      if (!userId || !permissionId) {
        res.status(400).json({ error: 'userId y permissionId son requeridos' });
        return;
      }
  
      const user = await User.findByPk(userId);
      const permission = await Permission.findByPk(permissionId);
  
      if (!user || !permission) {
        res.status(404).json({ error: 'Usuario o permiso no encontrado' });
        return;
      }
  
      // Crear una excepción de permiso
      await UserPermissionException.create({
        userId,
        permissionId,
      });
  
      res.json({ message: 'Permiso bloqueado correctamente' });
    } catch (error) {
      console.error('Error blocking permission:', error);
      res.status(500).json({ error: 'Error al bloquear permiso' });
    }
  }
  // Desbloquear un permiso para un usuario (eliminar excepción de permiso)
  static async unblockPermission(req: Request, res: Response): Promise<void> {
    try {
      const { userId, permissionId } = req.body;

      // Validar que userId y permissionId estén presentes
      if (!userId || !permissionId) {
        res.status(400).json({ error: 'userId y permissionId son requeridos' });
        return;
      }

      const exception = await UserPermissionException.findOne({
        where: {
          userId,
          permissionId,
        },
      });

      if (!exception) {
        res.status(404).json({ error: 'Excepción de permiso no encontrada' });
        return;
      }

      // Eliminar la excepción de permiso
      await exception.destroy();

      res.json({ message: 'Permiso desbloqueado correctamente' });
    } catch (error) {
      console.error('Error unblocking permission:', error);
      res.status(500).json({ error: 'Error al desbloquear permiso' });
    }
  }
}