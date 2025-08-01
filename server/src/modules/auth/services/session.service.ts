import Session from '../models/Session';
import { TokenSession } from '../../../shared/middleware/authMiddleware';
import { Op } from 'sequelize';

export class SessionService {
  /**
   * Registrar una nueva sesión en la base de datos
   */
  static async registerSession(userId: number, sessionData: TokenSession): Promise<Session> {
    try {
      const session = await Session.create({
        userId,
        token: sessionData.token,
        createdAt: sessionData.createdAt,
        lastUsed: sessionData.lastUsed,
        expiresAt: sessionData.expiresAt,
        userAgent: sessionData.userAgent,
        ipAddress: sessionData.ipAddress,
        geoLocation: sessionData.geoLocation,
        isActive: true,
      });
      
      return session;
    } catch (error) {
      console.error('Error registrando sesión:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las sesiones activas de un usuario
   */
  static async getUserSessions(userId: number): Promise<TokenSession[]> {
    try {
      const sessions = await Session.findAll({
        where: {
          userId,
          isActive: true,
          expiresAt: {
            [Op.gt]: new Date(), // Solo sesiones no expiradas
          },
        },
        order: [['lastUsed', 'DESC']],
      });

      return sessions.map(session => ({
        token: session.token,
        createdAt: session.createdAt,
        lastUsed: session.lastUsed,
        expiresAt: session.expiresAt,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        geoLocation: session.geoLocation,
      }));
    } catch (error) {
      console.error('Error obteniendo sesiones del usuario:', error);
      return [];
    }
  }

  /**
   * Verificar si un token existe y está activo
   */
  static async validateToken(userId: number, token: string): Promise<boolean> {
    try {
      const session = await Session.findOne({
        where: {
          userId,
          token,
          isActive: true,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
      });

      return !!session;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  /**
   * Actualizar el último uso de una sesión
   */
  static async updateTokenUsage(userId: number, token: string): Promise<void> {
    try {
      await Session.update(
        {
          lastUsed: new Date(),
        },
        {
          where: {
            userId,
            token,
            isActive: true,
          },
        }
      );
    } catch (error) {
      console.error('Error actualizando uso del token:', error);
    }
  }

  /**
   * Revocar un token específico
   */
  static async revokeToken(userId: number, token: string): Promise<void> {
    try {
      await Session.update(
        {
          isActive: false,
        },
        {
          where: {
            userId,
            token,
          },
        }
      );
    } catch (error) {
      console.error('Error revocando token:', error);
    }
  }

  /**
   * Revocar todas las sesiones de un usuario
   */
  static async revokeAllTokens(userId: number): Promise<void> {
    try {
      await Session.update(
        {
          isActive: false,
        },
        {
          where: {
            userId,
          },
        }
      );
    } catch (error) {
      console.error('Error revocando todos los tokens:', error);
    }
  }

  /**
   * Limpiar sesiones expiradas (para ejecutar periódicamente)
   */
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      const deletedCount = await Session.destroy({
        where: {
          [Op.or]: [
            {
              expiresAt: {
                [Op.lt]: new Date(),
              },
            } as any,
            {
              isActive: false,
              updatedAt: {
                [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Eliminar sesiones inactivas después de 7 días
              },
            } as any,
          ],
        } as any,
      });

      if (deletedCount > 0) {
        console.log(`🧹 Limpieza de sesiones: ${deletedCount} sesiones eliminadas`);
      }
    } catch (error) {
      console.error('Error limpiando sesiones expiradas:', error);
    }
  }

  /**
   * Obtener estadísticas de sesiones
   */
  static async getSessionStats(): Promise<{
    totalActive: number;
    totalExpired: number;
    totalInactive: number;
  }> {
    try {
      const [totalActive, totalExpired, totalInactive] = await Promise.all([
        Session.count({
          where: {
            isActive: true,
            expiresAt: {
              [Op.gt]: new Date(),
            },
          },
        }),
        Session.count({
          where: {
            expiresAt: {
              [Op.lt]: new Date(),
            },
          },
        }),
        Session.count({
          where: {
            isActive: false,
          },
        }),
      ]);

      return {
        totalActive,
        totalExpired,
        totalInactive,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de sesiones:', error);
      return {
        totalActive: 0,
        totalExpired: 0,
        totalInactive: 0,
      };
    }
  }
}