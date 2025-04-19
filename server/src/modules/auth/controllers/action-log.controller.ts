import { Request, Response } from 'express';
import { Logger } from '../../../utils/logger';

interface ActionLogData {
  action: string;
  requiredPermissions: string[];
  userPermissions: string[];
  hasPermission: boolean;
  isSuperAdmin: boolean;
  matchingPermissions: string[];
  target?: {
    id?: number;
    name?: string;
  };
  additionalData?: Record<string, unknown>;
}

class ActionLogController {
  /**
   * Registra información de evaluación de permisos para acciones en el backend
   */
  async logActionPermission(req: Request, res: Response): Promise<Response> {
    try {
      const logData: ActionLogData = req.body;
      
      const { 
        action, 
        requiredPermissions, 
        userPermissions, 
        hasPermission, 
        isSuperAdmin, 
        matchingPermissions,
        target,
        additionalData
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
      console.log('\n' + BRIGHT + MAGENTA + '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀' + RESET);
      console.log(BRIGHT + CYAN + '      ⚡ EVALUACIÓN DE ACCIÓN USUARIO ⚡      ' + BRIGHT + YELLOW + timestamp + RESET);
      console.log(BRIGHT + MAGENTA + '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄' + RESET);
      
      // Información sobre la acción
      console.log(BRIGHT + '🔍 Acción:' + RESET + ` ${BRIGHT}${BLUE}${action}${RESET}`);
      
      // Información sobre el objetivo si existe
      if (target) {
        const targetInfo = `${target.name ? target.name : ''} ${target.id ? `(ID: ${target.id})` : ''}`.trim();
        if (targetInfo) {
          console.log(BRIGHT + '🎯 Objetivo:' + RESET + ` ${CYAN}${targetInfo}${RESET}`);
        }
      }
      
      // Datos adicionales si existen
      if (additionalData && Object.keys(additionalData).length > 0) {
        console.log(BRIGHT + '📋 Datos adicionales:' + RESET);
        Object.entries(additionalData).forEach(([key, value]) => {
          console.log(`   ${YELLOW}${key}:${RESET} ${JSON.stringify(value)}`);
        });
      }
      
      // Permisos requeridos
      console.log('\n' + BRIGHT + '🔑 Permisos Requeridos:' + RESET);
      if (requiredPermissions.length === 0) {
        console.log(`   ${YELLOW}No se requieren permisos específicos${RESET}`);
      } else {
        requiredPermissions.forEach(perm => {
          console.log(`   ${YELLOW}➤ ${perm}${RESET}`);
        });
      }
      
      // Permisos coincidentes
      console.log('\n' + BRIGHT + '🔐 Permisos Coincidentes:' + RESET);
      if (matchingPermissions.length === 0) {
        console.log(`   ${RED}Ningún permiso coincide${RESET}`);
      } else {
        matchingPermissions.forEach(perm => {
          console.log(`   ${GREEN}✓ ${perm}${RESET}`);
        });
      }
      
      // Resultado de la evaluación
      console.log('\n' + BRIGHT + '📊 Resultado:' + RESET);
      if (isSuperAdmin) {
        console.log(`   ${GREEN}✓ Acción PERMITIDA${RESET} ${BRIGHT}(Usuario es SuperAdmin)${RESET}`);
      } else if (hasPermission) {
        console.log(`   ${GREEN}✓ Acción PERMITIDA${RESET} ${BRIGHT}(Permisos coincidentes: ${matchingPermissions.length})${RESET}`);
      } else {
        console.log(`   ${RED}✗ Acción DENEGADA${RESET} ${BRIGHT}(Permisos insuficientes)${RESET}`);
      }
      
      // Añadir resumen de la acción
      const actionDescription = hasPermission 
        ? `${GREEN}RESULTADO: Acción "${action}" AUTORIZADA${RESET}`
        : `${RED}RESULTADO: Acción "${action}" DENEGADA${RESET}`;
      console.log('\n' + actionDescription);
      
      console.log(BRIGHT + MAGENTA + '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀' + RESET + '\n');
      
      // Responder al cliente
      return res.status(200).json({ success: true });
    } catch (error) {
      Logger.error('Error al registrar log de acción:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al registrar log de acción' 
      });
    }
  }
}

export default new ActionLogController(); 