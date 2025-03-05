import { Request, Response } from 'express';
import User from '../user/User';
import Role from '../role/Role';
import Permission from '../Permission/Permission';
import UserPermissionException from './UserPermissionExceptions';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

/**
 * @interface UpdatableUserFields
 * @description Define los campos actualizables de un usuario
 */
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

/**
 * @module express
 * @description Extensión del tipo Request de Express para incluir información geográfica
 */
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

/**
 * @class UserController
 * @description Controlador para la gestión de usuarios en el sistema
 * Proporciona métodos para crear, leer, actualizar y eliminar usuarios,
 * así como gestionar sus permisos y estado de sesión
 */
export class UserController {
  /**
   * @static userValidations
   * @description Validaciones de express-validator para los datos de usuario
   */
  static userValidations = [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('roleId').optional().isInt().withMessage('El roleId debe ser un número entero'),
    body('registrationIp').optional().isIP().withMessage('IP inválida'),
    body('lastLoginIp').optional().isIP().withMessage('IP inválida')
  ];

  /**
   * @method getUsers
   * @description Obtiene la lista de todos los usuarios registrados
   * @param {Request} _req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un JSON con la lista de usuarios, excluyendo información sensible
   * @throws {Error} Error al obtener usuarios
   */
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

  /**
   * @method getUserById
   * @description Obtiene un usuario específico por su ID
   * @param {Request} req - Objeto de solicitud Express con el ID del usuario en los parámetros
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un JSON con la información del usuario, excluyendo información sensible
   * @throws {Error} Error al obtener usuario o usuario no encontrado
   */
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

  /**
   * @method getUserSecurityDetails
   * @description Obtiene los detalles de seguridad de un usuario
   * @param {Request} req - Objeto de solicitud Express con el ID del usuario en los parámetros
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un JSON con los detalles de seguridad del usuario
   * @throws {Error} Error al obtener detalles de seguridad o usuario no encontrado
   * @requires Autenticación y permisos adecuados
   */
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

  /**
   * @method updateUser
   * @description Actualiza la información de un usuario existente
   * @param {Request} req - Objeto de solicitud Express con el ID del usuario en los parámetros y datos a actualizar en el cuerpo
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un JSON con la información actualizada del usuario
   * @throws {Error} Error de validación, usuario no encontrado o error al actualizar
   * @requires Autenticación y permisos adecuados
   */
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

  /**
   * @method deleteUser
   * @description Elimina un usuario del sistema
   * @param {Request} req - Objeto de solicitud Express con el ID del usuario en los parámetros
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un mensaje de confirmación de eliminación
   * @throws {Error} Usuario no encontrado o error al eliminar
   * @requires Autenticación y permisos adecuados
   */
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

  /**
   * @method assignCustomPermission
   * @description Asigna un permiso personalizado a un usuario específico
   * @param {Request} req - Objeto de solicitud Express con userId y permissionId en el cuerpo
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un mensaje de confirmación
   * @throws {Error} Usuario o permiso no encontrado, o error al asignar permiso
   * @requires Autenticación y permisos adecuados
   */
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

  /**
   * @method blockPermission
   * @description Bloquea un permiso específico para un usuario (crea una excepción de permiso)
   * @param {Request} req - Objeto de solicitud Express con userId y permissionId en el cuerpo
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un mensaje de confirmación
   * @throws {Error} Usuario o permiso no encontrado, o error al bloquear permiso
   * @requires Autenticación y permisos adecuados
   */
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
  
  /**
   * @method unblockPermission
   * @description Desbloquea un permiso para un usuario (elimina una excepción de permiso)
   * @param {Request} req - Objeto de solicitud Express con userId y permissionId en el cuerpo
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un mensaje de confirmación
   * @throws {Error} Excepción de permiso no encontrada o error al desbloquear permiso
   * @requires Autenticación y permisos adecuados
   */
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

  /**
   * @method getUserPermissions
   * @description Obtiene todos los permisos de un usuario (por rol, personalizados y bloqueados)
   * @param {Request} req - Objeto de solicitud Express con el ID del usuario en los parámetros
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>} Retorna un JSON con los permisos del usuario
   * @throws {Error} Error al obtener permisos o usuario no encontrado
   */
  static async getUserPermissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Buscar el usuario con sus relaciones
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: 'Role',
            include: [{ 
              model: Permission, 
              as: 'Permissions',
              attributes: ['id', 'name', 'description'] 
            }],
          },
          {
            model: Permission,
            as: 'Permissions',
            attributes: ['id', 'name', 'description']
          },
        ],
      });
      
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      
      // Obtener los permisos bloqueados
      const blockedPermissionsExceptions = await UserPermissionException.findAll({
        where: { userId: id },
        include: [{ 
          model: Permission, 
          as: 'Permission',
          attributes: ['id', 'name', 'description'] 
        }],
      });
      
      // Extraer los permisos bloqueados
      const blockedPermissions = blockedPermissionsExceptions.map(exception => exception.Permission);
      
      // Extraer permisos del rol
      const rolePermissions = user.Role?.Permissions || [];
      
      // Extraer permisos personalizados
      const customPermissions = user.Permissions || [];
      
      // Determinar permisos efectivos (rol + personalizados - bloqueados)
      const blockedPermissionIds = new Set(blockedPermissions.map(p => p.id));
      
      // Combinar permisos del rol y personalizados
      const allPermissions = [
        ...rolePermissions.map(p => ({ 
          id: p.id, 
          name: p.name, 
          description: p.description,
          source: 'role'
        })),
        ...customPermissions.map(p => ({ 
          id: p.id, 
          name: p.name, 
          description: p.description,
          source: 'custom'
        }))
      ];
      
      // Filtrar permisos bloqueados para obtener los permisos disponibles
      const availablePermissions = allPermissions.filter(p => !blockedPermissionIds.has(p.id));
      
      // Devolver la información de permisos en un formato más claro
      res.json({
        userId: user.id,
        username: user.username || user.email,
        roleName: user.Role?.name,
        availablePermissions: availablePermissions.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          source: p.source
        })),
        blockedPermissions: blockedPermissions.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description
        }))
      });
      
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      res.status(500).json({ error: 'Error al obtener permisos del usuario' });
    }
  }
}