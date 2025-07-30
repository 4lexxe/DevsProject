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
  isActiveSession?: boolean;
  lastActiveAt?: Date;
}

// Función para generar metadata
const metadata = (req: Request, res: Response) => {
  return {
    statusCode: res.statusCode,
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
    method: req.method,
  };
};

// Función para manejar errores internos del servidor
const handleServerError = (res: Response, req: Request, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({
    ...metadata(req, res),
    status: "error",
    message,
    error: error.message,
  });
};

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

  // Obtener datos públicos básicos de todos los usuarios (público)
  static async getPublicUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'username', 'displayName', 'avatar'], // Agregamos avatar
        where: {
          // Opcional: agregar filtros adicionales como usuarios activos
          // isActive: true
        }
      });
      
      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Usuarios públicos obtenidos correctamente",
        data: users
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener usuarios públicos");
    }
  }

  // Obtener datos públicos básicos de un usuario por ID (público)
  static async getPublicUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'username', 'displayName', 'avatar'] // Agregamos avatar
      });

      if (!user) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Usuario público obtenido correctamente",
        data: user
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener usuario público");
    }
  }

  // Obtener todos los usuarios (solo para roles importantes)
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;

      // Verificar permisos adicionales
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      const canViewAllUsers = userPermissions.includes('read:users') || 
                             userPermissions.includes('manage:all_users') || 
                             user.Role?.name === 'superadmin';

      if (!canViewAllUsers) {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: 'No tienes permisos para ver información completa de usuarios'
        });
        return;
      }

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
      handleServerError(res, req, error, "Error al obtener usuarios");
    }
  }

  // Obtener un usuario por ID (solo para roles importantes)
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as User;

      // Verificar permisos adicionales
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      const canViewUserDetails = userPermissions.includes('read:users') || 
                                userPermissions.includes('manage:all_users') || 
                                user.Role?.name === 'superadmin';

      if (!canViewUserDetails) {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: 'No tienes permisos para ver información completa de usuarios'
        });
        return;
      }

      const targetUser = await User.findByPk(id, {
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

      if (!targetUser) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: 'Usuario no encontrado'
        });
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
      handleServerError(res, req, error, "Error al obtener usuario");
    }
  }

  // Obtener detalles de seguridad de un usuario (requiere autenticación y permisos)
  static async getUserSecurityDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user as User;

      // Verificar permisos adicionales
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      const canViewSecurityDetails = userPermissions.includes('read:users') || 
                                   userPermissions.includes('manage:all_users') || 
                                   user.Role?.name === 'superadmin';

      if (!canViewSecurityDetails) {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: 'No tienes permisos para ver detalles de seguridad'
        });
        return;
      }

      const targetUser = await User.findByPk(id, {
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
          attributes: ['name']
        }]
      });

      if (!targetUser) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Detalles de seguridad obtenidos correctamente",
        data: {
          id: targetUser.id,
          role: targetUser.Role?.name,
          registrationGeo: targetUser.registrationGeo,
          lastLoginIp: targetUser.lastLoginIp,
          registrationLocation: targetUser.registrationGeo ? {
            city: targetUser.registrationGeo.city,
            country: targetUser.registrationGeo.country,
            coordinates: targetUser.registrationGeo.loc
          } : null,
          lastLoginLocation: targetUser.lastLoginGeo ? {
            city: targetUser.lastLoginGeo.city,
            country: targetUser.lastLoginGeo.country,
            coordinates: targetUser.lastLoginGeo.loc
          } : null,
          suspiciousActivities: targetUser.suspiciousActivities.length,
          isActiveSession: targetUser.isActiveSession,
          lastActiveAt: targetUser.lastActiveAt,
        }
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al obtener detalles de seguridad");
    }
  }

  // Actualizar un usuario (requiere autenticación y permisos)
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          ...metadata(req, res),
          status: "error",
          message: "Errores de validación",
          errors: errors.array()
        });
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
        isActiveSession, 
      } = req.body;

      const user = req.user as User;

      // Verificar permisos adicionales
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      const canUpdateUsers = userPermissions.includes('write:users') || 
                           userPermissions.includes('manage:all_users') || 
                           user.Role?.name === 'superadmin';

      if (!canUpdateUsers) {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: 'No tienes permisos para actualizar usuarios'
        });
        return;
      }

      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: 'Usuario no encontrado'
        });
        return;
      }

      const updatableFields: UpdatableUserFields = {
        name,
        email,
        phone,
        roleId,
        username,
        displayName,
        isActiveSession,
      };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatableFields.password = await bcrypt.hash(password, salt);
      }

      // Si se proporciona isActiveSession, actualizar lastActiveAt también
      if (isActiveSession !== undefined) {
        updatableFields.lastActiveAt = new Date();
      }

      await targetUser.update(updatableFields);

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
          as: 'Role',
          attributes: ['id', 'name', 'description']
        }]
      });

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: "Usuario actualizado correctamente",
        data: updatedUser
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al actualizar usuario");
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
      const user = req.user as User;

      // Verificar permisos adicionales
      const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
      if (!userPermissions.includes('delete:users') && user.Role?.name !== 'superadmin') {
        res.status(403).json({
          ...metadata(req, res),
          status: "error",
          message: 'No tienes permisos para eliminar usuarios'
        });
        return;
      }

      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        res.status(404).json({
          ...metadata(req, res),
          status: "error",
          message: 'Usuario no encontrado'
        });
        return;
      }

      // Prevenir eliminación del propio usuario
      if (user.id === targetUser.id) {
        res.status(400).json({
          ...metadata(req, res),
          status: "error",
          message: 'No puedes eliminar tu propia cuenta'
        });
        return;
      }

      // Marcar la sesión como inactiva antes de eliminar el usuario
      targetUser.isActiveSession = false;
      targetUser.lastActiveAt = new Date();
      await targetUser.save();

      await targetUser.update({
        suspiciousActivities: [
          ...targetUser.suspiciousActivities,
          {
            type: 'ACCOUNT_DELETED',
            ip: req.ip || 'unknown',
            geo: req.geoLocation || {},
            timestamp: new Date()
          }
        ]
      });

      await targetUser.destroy();

      res.status(200).json({
        ...metadata(req, res),
        status: "success",
        message: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      handleServerError(res, req, error, "Error al eliminar usuario");
    }
  }
}