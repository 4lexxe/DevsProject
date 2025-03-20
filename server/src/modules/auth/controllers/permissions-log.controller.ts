import { Request, Response } from 'express';
import { Logger } from '../../../utils/logger';

interface PermissionLogData {
  username: string;
  userId: number;
  route: string;
  requiredPermissions: string[];
  userPermissions: string[];
  matchingPermissions: string[];
  isSuperAdmin: boolean;
  accessGranted: boolean;
  userRoles?: string[];
}

class PermissionsLogController {
  /**
   * Registra información de evaluación de permisos en el backend
   */
  async logPermissionCheck(req: Request, res: Response) {
    try {
      const logData: PermissionLogData = req.body;
      
      const { 
        username, 
        userId, 
        route, 
        requiredPermissions, 
        userPermissions, 
        matchingPermissions, 
        isSuperAdmin, 
        accessGranted,
        userRoles = [] // Valor por defecto vacío
      } = logData;
      
      // Aplicar colores para la consola
      const RESET = "\x1b[0m";
      const BRIGHT = "\x1b[1m";
      const GREEN = "\x1b[32m";
      const RED = "\x1b[31m";
      const YELLOW = "\x1b[33m";
      const BLUE = "\x1b[34m";
      const CYAN = "\x1b[36m";
      const MAGENTA = "\x1b[35m";
      
      // Crear mensaje de log estructurado con colores
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      console.log('\n' + BRIGHT + BLUE + '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀' + RESET);
      console.log(BRIGHT + MAGENTA + '      🔒 EVALUACIÓN DE PERMISOS 🔒      ' + BRIGHT + YELLOW + timestamp + RESET);
      console.log(BRIGHT + BLUE + '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄' + RESET);
      console.log(BRIGHT + `Usuario: ${YELLOW}${username}${RESET}${BRIGHT} (ID: ${userId})` + RESET);
      console.log(`Ruta: ${CYAN}${route}${RESET}`);
      
      // Mostrar roles del usuario
      console.log('\n' + BRIGHT + '👑 Roles del Usuario:' + RESET);
      if (userRoles.length === 0) {
        console.log(`   ${YELLOW}No tiene roles asignados${RESET}`);
      } else {
        userRoles.forEach(role => {
          if (role.toLowerCase().includes('superadmin')) {
            console.log(`   ${MAGENTA}★ ${role}${RESET}`);
          } else {
            console.log(`   ${CYAN}➤ ${role}${RESET}`);
          }
        });
      }
      
      // Mostrar permisos requeridos
      console.log('\n' + BRIGHT + '📋 Permisos Requeridos:' + RESET);
      if (requiredPermissions.length === 0) {
        console.log(`   ${YELLOW}No se requieren permisos específicos${RESET}`);
      } else {
        requiredPermissions.forEach(perm => {
          console.log(`   ${YELLOW}➤ ${perm}${RESET}`);
        });
      }
      
      // Mostrar permisos del usuario
      console.log('\n' + BRIGHT + '👤 Permisos del Usuario:' + RESET);
      if (userPermissions.length === 0) {
        console.log(`   ${RED}El usuario no tiene permisos asignados${RESET}`);
      } else {
        userPermissions.forEach(perm => {
          const isMatch = requiredPermissions.includes(perm);
          if (isMatch) {
            console.log(`   ${GREEN}✓ ${perm}${RESET} ${BRIGHT}(coincide)${RESET}`);
          } else {
            console.log(`   ${BLUE}➤ ${perm}${RESET}`);
          }
        });
      }
      
      // Mostrar resultado de la evaluación
      console.log('\n' + BRIGHT + '🔍 Resultado:' + RESET);
      if (isSuperAdmin) {
        console.log(`   ${GREEN}✓ Acceso CONCEDIDO${RESET} ${BRIGHT}(Usuario es SuperAdmin)${RESET}`);
      } else if (accessGranted) {
        console.log(`   ${GREEN}✓ Acceso CONCEDIDO${RESET} ${BRIGHT}(Permisos coincidentes: ${matchingPermissions.length})${RESET}`);
      } else {
        console.log(`   ${RED}✗ Acceso DENEGADO${RESET} ${BRIGHT}(Permisos faltantes: ${requiredPermissions.filter(p => !userPermissions.includes(p)).join(', ')})${RESET}`);
      }
      
      // Añadir evento descriptivo
      const eventDescription = accessGranted 
        ? `${GREEN}EVENTO: Usuario ha accedido a la ruta ${route}${RESET}`
        : `${RED}EVENTO: Se ha denegado el acceso a la ruta ${route} para el usuario ${username}${RESET}`;
      console.log('\n' + eventDescription);
      
      console.log(BRIGHT + BLUE + '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀' + RESET + '\n');
      
      // Responder al cliente
      return res.status(200).json({ success: true });
    } catch (error) {
      Logger.error('Error al registrar log de permisos:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al registrar log de permisos' 
      });
    }
  }
}

export default new PermissionsLogController();