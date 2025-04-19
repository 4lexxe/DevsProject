// import api from '@/api/axios';
import { ACTION_PERMISSIONS } from '@/dashboard/data/permissions';
// Eliminando importación no utilizada de api
// import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import { ROLES_CRITICOS } from '../constants';

// Interfaces para los tipos de datos
interface ActionRequest {
  actionName: string;
  requiredPermissions: string[];
  userPermissions: string[];
  targetId?: number;
  targetName?: string;
  additionalData?: Record<string, unknown>;
}

interface CambioRol {
  rolAnterior: {
    id?: number;
    nombre: string;
  };
  rolNuevo: {
    id?: number;
    nombre: string;
  };
}

interface UsuarioAfectado {
  id?: number;
  nombre?: string;
  username?: string;
  email?: string;
}

// Lista de roles críticos del sistema que requieren permisos especiales
export const ROLES_CRITICOS = ['superadmin', 'admin', 'moderador'];

// Verifica si el usuario tiene los permisos necesarios para una acción
export async function checkActionPermission({
  actionName,
  requiredPermissions,
  userPermissions,
  targetId,
  targetName,
  additionalData
}: ActionRequest): Promise<boolean> {
  try {
    // Validación inicial de parámetros
    if (!userPermissions || userPermissions.length === 0) {
      console.error('No se proporcionaron permisos de usuario para validar');
      toast.error('Error: No se pueden verificar tus permisos', {
        duration: 5000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B'
        }
      });
      return false;
    }

    // Verificar si es superadmin (tiene acceso total)
    const isSuperAdmin = userPermissions.includes('superadmin:full_access');
    
    // Validaciones específicas para roles críticos
    if (actionName.includes('Cambiar rol') && additionalData) {
      const cambioRol = additionalData.cambioRol as CambioRol | undefined;
      
      // Verificar si se intenta asignar un rol crítico
      if (cambioRol && ROLES_CRITICOS.includes(cambioRol.rolNuevo.nombre.toLowerCase())) {
        // Para roles críticos, verificar que tenga el permiso específico manage:critical_roles
        const tienePermisoRolesCriticos = userPermissions.includes('manage:critical_roles');
        
        if (!tienePermisoRolesCriticos && !isSuperAdmin) {
          toast.error(`No tienes permisos para asignar roles críticos del sistema como "${cambioRol.rolNuevo.nombre}". Se requiere el permiso especial: manage:critical_roles`, {
            duration: 6000,
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              border: '1px solid #F87171',
              padding: '12px'
            }
          });
          
          // Registrar el intento no autorizado
          const logData = {
            fecha: new Date().toISOString(),
            accion: `Intento no autorizado de asignar rol crítico: ${cambioRol.rolNuevo.nombre}`,
            permisosRequeridos: [...requiredPermissions, 'manage:critical_roles'],
            permisosUsuario: userPermissions,
            tienePermiso: false,
            esSuperAdmin: isSuperAdmin,
            objetivo: {
              id: targetId,
              nombre: targetName
            },
            detallesAdicionales: additionalData,
            resultado: 'DENEGADO'
          };
          
          // Guardar el registro localmente
          try {
            const logsHistory = JSON.parse(localStorage.getItem('action_logs') || '[]');
            logsHistory.push({
              ...logData,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('action_logs', JSON.stringify(logsHistory.slice(-50)));
            
            // Imprimir información en consola para debugging, pero no enviar al servidor
            // ya que está generando errores 500
            console.info('[Log de Acción Crítica]', {
              accion: `Intento no autorizado de asignar rol crítico: ${cambioRol.rolNuevo.nombre}`,
              resultado: 'DENEGADO',
              usuario: targetName || 'No especificado',
              timestamp: new Date().toISOString()
            });
            
            /* Comentado temporalmente para evitar errores 500
            // Enviar en segundo plano
            setTimeout(async () => {
              try {
                await api.post('/auth/action-permission-log', logData);
              } catch (e) {
                console.error("Error al enviar log de rol crítico:", e);
              }
            }, 100);
            */
          } catch (e) {
            console.error("Error al registrar acción de rol crítico:", e);
          }
          
          return false;
        }
      }
      
      // Si se está quitando un rol crítico a un usuario, también verificar permisos especiales
      if (cambioRol && ROLES_CRITICOS.includes(cambioRol.rolAnterior.nombre.toLowerCase())) {
        // Para quitar roles críticos, verificar que tenga el permiso específico manage:critical_roles
        const tienePermisoRolesCriticos = userPermissions.includes('manage:critical_roles');
        
        if (!tienePermisoRolesCriticos && !isSuperAdmin) {
          toast.error(`No tienes permisos para quitar roles críticos del sistema como "${cambioRol.rolAnterior.nombre}". Se requiere el permiso especial: manage:critical_roles`, {
            duration: 6000,
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              border: '1px solid #F87171',
              padding: '12px'
            }
          });
          return false;
        }
      }
    }
    
    // Verificamos si tiene al menos uno de los permisos requeridos
    const matchingPermissions = requiredPermissions.filter(perm => userPermissions.includes(perm));
    const hasPermission = matchingPermissions.length > 0 || isSuperAdmin;
    
    // Enriquecer datos para el registro detallado de la acción
    const timestamp = new Date().toISOString();
    
    // Datos para el registro de la acción
    const logData = {
      fecha: timestamp,
      accion: actionName,
      permisosRequeridos: requiredPermissions,
      permisosUsuario: userPermissions,
      tienePermiso: hasPermission,
      esSuperAdmin: isSuperAdmin,
      permisosCoincidentes: matchingPermissions,
      objetivo: {
        id: targetId,
        nombre: targetName
      },
      detallesAdicionales: additionalData,
      resultado: hasPermission ? 'PERMITIDO' : 'DENEGADO'
    };
    
    // Registrar la acción solo localmente sin bloquear el flujo
    try {
      // Guardar siempre en localStorage para tener un respaldo
      const logsHistory = JSON.parse(localStorage.getItem('action_logs') || '[]');
      logsHistory.push({
        ...logData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('action_logs', JSON.stringify(logsHistory.slice(-50))); // Guardar solo los últimos 50
      
      // Imprimir información en consola para debugging, pero no enviar al servidor
      // ya que está generando errores 500
      console.info('[Log de Acción]', {
        accion: actionName,
        permisosRequeridos: requiredPermissions,
        resultado: hasPermission ? 'PERMITIDO' : 'DENEGADO',
        usuario: logData.detallesAdicionales && 
                 typeof logData.detallesAdicionales === 'object' && 
                 'usuarioEjecutor' in logData.detallesAdicionales && 
                 logData.detallesAdicionales.usuarioEjecutor && 
                 typeof logData.detallesAdicionales.usuarioEjecutor === 'object' && 
                 'id' in logData.detallesAdicionales.usuarioEjecutor
                   ? `ID: ${logData.detallesAdicionales.usuarioEjecutor.id}`
                   : 'No especificado',
        timestamp: new Date().toISOString()
      });
      
      /* Comentado temporalmente para evitar errores 500
      setTimeout(async () => {
        try {
          // Intentar con la ruta action-permission-log que es la correcta
          await api.post('/auth/action-permission-log', logData);
        } catch (serverError) {
          console.error("Error al enviar log de acción al servidor:", serverError);
          // Ya está guardado en localStorage, así que no hacemos nada más
        }
      }, 100);
      */
    } catch (logError) {
      // Error al registrar localmente, pero no interrumpir el flujo
      console.error("Error al registrar acción localmente:", logError);
    }
    
    // Si no tiene permisos, mostrar mensaje de error detallado
    if (!hasPermission) {
      // Crear un mensaje detallado con los permisos necesarios
      const permisosRequeridos = requiredPermissions.join(', ');
      
      // Enriquecer el mensaje con información del objetivo si está disponible
      let mensaje = `Acceso denegado: No tienes los permisos necesarios para ${actionName.toLowerCase()}.`;
      
      if (targetName) {
        mensaje += ` No puedes modificar a "${targetName}".`;
      }
      
      mensaje += ` Se requiere uno de los siguientes permisos: ${permisosRequeridos}`;
      
      // Mostrar detalles específicos por tipo de acción
      if (actionName.includes('rol') && additionalData) {
        // Verificamos si additionalData contiene cambioRol y usuarioAfectado
        const cambioRol = additionalData.cambioRol as CambioRol | undefined;
        const usuarioAfectado = additionalData.usuarioAfectado as UsuarioAfectado | undefined;
        
        if (cambioRol && usuarioAfectado && usuarioAfectado.nombre) {
          mensaje += `\nIntentaste cambiar el rol de "${usuarioAfectado.nombre}" de "${cambioRol.rolAnterior.nombre}" a "${cambioRol.rolNuevo.nombre}".`;
        }
      }
      
      toast.error(mensaje, {
        duration: 5000, // Mostrar por más tiempo para que el usuario pueda leerlo
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #F87171',
          padding: '12px'
        }
      });
      
      console.warn(`[Seguridad] Intento de acción sin permisos: ${actionName}`, { 
        userPermissions, 
        requiredPermissions, 
        target: targetName || targetId 
      });
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error al verificar permisos de acción:", error);
    toast.error('Error interno al verificar permisos. Por favor, inténtalo de nuevo.');
    return false;
  }
}

// Definición de permisos requeridos para acciones específicas
export const ACTION_PERMISSIONS = {
  // Acciones de usuario
  CHANGE_USER_ROLE: ['manage:roles', 'manage:all_users', 'assign:roles'],
  CHANGE_USER_STATUS: ['block:users', 'unblock:users', 'suspend:users', 'activate:users', 'manage:all_users'],
  MANAGE_USER_PERMISSIONS: ['manage:permissions', 'manage:all_users'],
  
  // Acciones de roles
  CREATE_ROLE: ['manage:roles', 'create:roles'],
  UPDATE_ROLE: ['manage:roles', 'edit:roles'],
  DELETE_ROLE: ['delete:roles', 'manage:roles'],
  ASSIGN_PERMISSIONS_TO_ROLE: ['manage:permissions', 'manage:roles'],
  
  // Roles críticos del sistema
  MANAGE_CRITICAL_ROLES: ['manage:critical_roles', 'superadmin:full_access'],
}; 