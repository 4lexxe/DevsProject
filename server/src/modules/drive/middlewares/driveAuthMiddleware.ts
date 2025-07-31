import { Request, Response, NextFunction } from 'express';
import { FileUploadRequest } from './driveMiddleware';

/**
 * Tipos de permisos para operaciones de Google Drive
 */
export enum DrivePermission {
  READ = 'drive:read',           // Ver archivos y enlaces
  UPLOAD = 'drive:upload',       // Subir archivos
  EDIT = 'drive:edit',           // Editar metadatos
  DELETE = 'drive:delete',       // Eliminar archivos
  MANAGE = 'drive:manage',       // Gestión completa (carpetas, permisos)
  ADMIN = 'drive:admin'          // Administración total
}

/**
 * Roles predefinidos con sus permisos
 */
export const DriveRoles = {
  VIEWER: [DrivePermission.READ],
  CONTRIBUTOR: [DrivePermission.READ, DrivePermission.UPLOAD],
  EDITOR: [DrivePermission.READ, DrivePermission.UPLOAD, DrivePermission.EDIT],
  MODERATOR: [DrivePermission.READ, DrivePermission.UPLOAD, DrivePermission.EDIT, DrivePermission.DELETE],
  ADMIN: [DrivePermission.READ, DrivePermission.UPLOAD, DrivePermission.EDIT, DrivePermission.DELETE, DrivePermission.MANAGE, DrivePermission.ADMIN]
};

/**
 * Interface para extender el usuario con permisos de Drive
 */
export interface UserWithDrivePermissions {
  id: string | number;
  role?: string;
  permissions?: string[];
  drivePermissions?: DrivePermission[];
  isDriveAdmin?: boolean;
}

/**
 * Obtiene los permisos de Drive de un usuario basado en su rol
 */
export function getUserDrivePermissions(user: any): DrivePermission[] {
  if (!user) return [];

  // Si el usuario tiene permisos específicos de Drive definidos
  if (user.drivePermissions && Array.isArray(user.drivePermissions)) {
    return user.drivePermissions;
  }

  // Si el usuario tiene un flag de admin de Drive
  if (user.isDriveAdmin === true) {
    return DriveRoles.ADMIN;
  }

  // Mapeo basado en el rol del usuario
  switch (user.role?.toLowerCase()) {
    case 'superadmin':
    case 'admin':
      return DriveRoles.ADMIN;
    
    case 'moderator':
    case 'content_manager':
      return DriveRoles.MODERATOR;
    
    case 'editor':
    case 'teacher':
    case 'instructor':
      return DriveRoles.EDITOR;
    
    case 'contributor':
    case 'premium':
      return DriveRoles.CONTRIBUTOR;
    
    case 'user':
    case 'student':
    case 'basic':
    default:
      return DriveRoles.VIEWER;
  }
}

/**
 * Verifica si un usuario tiene un permiso específico de Drive
 */
export function hasPermission(user: any, permission: DrivePermission): boolean {
  const userPermissions = getUserDrivePermissions(user);
  return userPermissions.includes(permission);
}

/**
 * Verifica si un usuario tiene alguno de los permisos especificados
 */
export function hasAnyPermission(user: any, permissions: DrivePermission[]): boolean {
  const userPermissions = getUserDrivePermissions(user);
  return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * Middleware para verificar autenticación
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Acceso denegado. Debe estar autenticado.',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  next();
};

/**
 * Middleware para verificar permisos específicos de Drive
 */
export const requireDrivePermission = (permission: DrivePermission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Acceso denegado. Debe estar autenticado.',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!hasPermission(user, permission)) {
      res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere el permiso: ${permission}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permission,
        userPermissions: getUserDrivePermissions(user)
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para verificar múltiples permisos (requiere TODOS)
 */
export const requireAllDrivePermissions = (permissions: DrivePermission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Acceso denegado. Debe estar autenticado.',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const userPermissions = getUserDrivePermissions(user);
    const missingPermissions = permissions.filter(permission => 
      !userPermissions.includes(permission)
    );

    if (missingPermissions.length > 0) {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado. Permisos insuficientes.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permissions,
        missing: missingPermissions,
        userPermissions
      });
      return;
    }

    next();
  };
};

/**
 * Middleware para verificar al menos uno de los permisos especificados
 */
export const requireAnyDrivePermission = (permissions: DrivePermission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Acceso denegado. Debe estar autenticado.',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!hasAnyPermission(user, permissions)) {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere al menos uno de los permisos especificados.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permissions,
        userPermissions: getUserDrivePermissions(user)
      });
      return;
    }

    next();
  };
};

/**
 * Middleware específico para operaciones de administración
 */
export const requireDriveAdmin = requireDrivePermission(DrivePermission.ADMIN);

/**
 * Middleware específico para operaciones de gestión
 */
export const requireDriveManager = requireAnyDrivePermission([
  DrivePermission.MANAGE, 
  DrivePermission.ADMIN
]);

/**
 * Middleware específico para operaciones de escritura
 */
export const requireDriveWrite = requireAnyDrivePermission([
  DrivePermission.UPLOAD,
  DrivePermission.EDIT,
  DrivePermission.DELETE,
  DrivePermission.MANAGE,
  DrivePermission.ADMIN
]);

/**
 * Middleware específico para operaciones de eliminación
 */
export const requireDriveDelete = requireAnyDrivePermission([
  DrivePermission.DELETE,
  DrivePermission.ADMIN
]);

/**
 * Middleware para logging de actividades con permisos
 */
export const logDriveActivity = (action: string) => {
  return (req: FileUploadRequest, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const timestamp = new Date().toISOString();
    const userPermissions = getUserDrivePermissions(user);
    
    console.log(`[DRIVE_ACTIVITY] ${timestamp} - Usuario: ${user?.id} - Acción: ${action} - Permisos: [${userPermissions.join(', ')}] - IP: ${req.ip}`);
    
    // Agregar información de permisos al request para uso posterior
    (req as any).userDrivePermissions = userPermissions;
    
    next();
  };
};

/**
 * Middleware para verificar límites basados en rol
 */
export const checkRoleBasedLimits = (req: FileUploadRequest, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const permissions = getUserDrivePermissions(user);
  
  // Límites específicos por nivel de permiso
  const getMaxLimits = (userPermissions: DrivePermission[]) => {
    // Administradores tienen límites máximos
    if (userPermissions.includes(DrivePermission.ADMIN)) {
      return {
        maxFileSize: 500 * 1024 * 1024, // 500MB
        maxFilesPerUpload: 50,
        dailyUploadLimit: 1000
      };
    }
    
    // Gestores tienen límites altos
    if (userPermissions.includes(DrivePermission.MANAGE)) {
      return {
        maxFileSize: 200 * 1024 * 1024, // 200MB
        maxFilesPerUpload: 20,
        dailyUploadLimit: 500
      };
    }
    
    // Editores y con permisos de eliminación
    if (userPermissions.includes(DrivePermission.DELETE) || userPermissions.includes(DrivePermission.EDIT)) {
      return {
        maxFileSize: 150 * 1024 * 1024, // 150MB
        maxFilesPerUpload: 15,
        dailyUploadLimit: 300
      };
    }
    
    // Solo subida
    if (userPermissions.includes(DrivePermission.UPLOAD)) {
      return {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        maxFilesPerUpload: 10,
        dailyUploadLimit: 100
      };
    }
    
    // Solo lectura - no puede subir
    return {
      maxFileSize: 0,
      maxFilesPerUpload: 0,
      dailyUploadLimit: 0
    };
  };

  const limits = getMaxLimits(permissions);

  // Verificar límites de archivo
  if (req.driveFile && req.driveFile.size > limits.maxFileSize) {
    res.status(413).json({
      success: false,
      message: `Archivo demasiado grande para su rol. Máximo permitido: ${(limits.maxFileSize / (1024 * 1024)).toFixed(0)}MB`,
      code: 'FILE_SIZE_EXCEEDED',
      limits: {
        maxFileSize: `${(limits.maxFileSize / (1024 * 1024)).toFixed(0)}MB`,
        userRole: user?.role,
        userPermissions: permissions
      }
    });
    return;
  }

  // Verificar límites de archivos múltiples
  if (req.driveFiles && req.driveFiles.length > limits.maxFilesPerUpload) {
    res.status(413).json({
      success: false,
      message: `Demasiados archivos para su rol. Máximo permitido: ${limits.maxFilesPerUpload}`,
      code: 'FILE_COUNT_EXCEEDED',
      limits: {
        maxFilesPerUpload: limits.maxFilesPerUpload,
        userRole: user?.role,
        userPermissions: permissions
      }
    });
    return;
  }

  // Agregar límites al request para referencia posterior
  (req as any).roleLimits = limits;

  next();
};

/**
 * Función helper para verificar si el usuario puede acceder a un archivo específico
 */
export function canAccessFile(user: any, fileOwnerId?: string | number): boolean {
  // Los administradores pueden acceder a todo
  if (hasPermission(user, DrivePermission.ADMIN)) {
    return true;
  }

  // Si no hay propietario específico, verificar permisos de lectura
  if (!fileOwnerId) {
    return hasPermission(user, DrivePermission.READ);
  }

  // El propietario siempre puede acceder
  if (user?.id && user.id.toString() === fileOwnerId.toString()) {
    return true;
  }

  // Verificar permisos de lectura para archivos de otros
  return hasPermission(user, DrivePermission.READ);
}

/**
 * Función helper para verificar si el usuario puede modificar un archivo específico
 */
export function canModifyFile(user: any, fileOwnerId?: string | number): boolean {
  // Los administradores pueden modificar todo
  if (hasPermission(user, DrivePermission.ADMIN)) {
    return true;
  }

  // El propietario puede modificar sus archivos si tiene permisos de edición
  if (fileOwnerId && user?.id && user.id.toString() === fileOwnerId.toString()) {
    return hasPermission(user, DrivePermission.EDIT);
  }

  // Los usuarios con permisos de gestión pueden modificar archivos de otros
  return hasPermission(user, DrivePermission.MANAGE);
}

export default {
  DrivePermission,
  DriveRoles,
  getUserDrivePermissions,
  hasPermission,
  hasAnyPermission,
  requireAuth,
  requireDrivePermission,
  requireAllDrivePermissions,
  requireAnyDrivePermission,
  requireDriveAdmin,
  requireDriveManager,
  requireDriveWrite,
  requireDriveDelete,
  logDriveActivity,
  checkRoleBasedLimits,
  canAccessFile,
  canModifyFile
};
