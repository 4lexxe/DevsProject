import { Request, Response, NextFunction } from 'express';
import { EncryptionUtils } from '../utils/encryption.utils';
import User from '../../modules/user/User';
import Course from '../../modules/course/models/Course';
import Section from '../../modules/course/models/Section';
import Content from '../../modules/course/models/Content';
import CourseAccess from '../../modules/purchase/models/CourseAccess';

/**
 * Middleware para validar acceso a contenido de cursos
 * Verifica que el usuario tenga acceso al curso antes de permitir ver el contenido
 */
export const validateCourseAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Acceso denegado',
        details: 'Debe estar autenticado para acceder al contenido'
      });
      return;
    }

    let courseId: number | null = null;

    // Obtener courseId desde diferentes fuentes según el endpoint
    if (req.params.courseId) {
      // Si viene directamente como parámetro
      if (EncryptionUtils.isValidEncryptedId(req.params.courseId)) {
        courseId = EncryptionUtils.decryptId(req.params.courseId);
      } else {
        courseId = parseInt(req.params.courseId, 10);
      }
    } else if (req.params.id || req.params.contentId) {
      // Si necesitamos obtener el courseId desde el contenido o sección
      const contentId = req.params.id || req.params.contentId;
      let numericContentId: number;
      
      if (EncryptionUtils.isValidEncryptedId(contentId)) {
        numericContentId = EncryptionUtils.decryptId(contentId);
      } else {
        numericContentId = parseInt(contentId, 10);
      }

      const content = await Content.findByPk(numericContentId, {
        include: [{
          model: Section,
          as: 'section',
          include: [{
            model: Course,
            as: 'course'
          }]
        }]
      });

      if (!content || !content.section?.course) {
        res.status(404).json({
          status: 'error',
          message: 'Contenido no encontrado'
        });
        return;
      }

      courseId = Number(content.section.course.id);
    } else if (req.params.sectionId) {
      // Si necesitamos obtener el courseId desde la sección
      const sectionId = req.params.sectionId;
      let numericSectionId: number;
      
      if (EncryptionUtils.isValidEncryptedId(sectionId)) {
        numericSectionId = EncryptionUtils.decryptId(sectionId);
      } else {
        numericSectionId = parseInt(sectionId, 10);
      }

      const section = await Section.findByPk(numericSectionId, {
        include: [{
          model: Course,
          as: 'course'
        }]
      });

      if (!section || !section.course) {
        res.status(404).json({
          status: 'error',
          message: 'Sección no encontrada'
        });
        return;
      }

      courseId = Number(section.course.id);
    }

    if (!courseId) {
      res.status(400).json({
        status: 'error',
        message: 'No se pudo determinar el curso'
      });
      return;
    }

    // Verificar si el usuario tiene acceso al curso
    const courseAccess = await CourseAccess.findOne({
      where: {
        userId: user.id,
        courseId: courseId,
        revokedAt: null // Solo accesos activos
      }
    });

    if (!courseAccess) {
      res.status(403).json({
        status: 'error',
        message: 'Acceso denegado al contenido',
        details: 'No tienes acceso a este curso. Debes comprarlo primero.'
      });
      return;
    }

    // Agregar información del acceso al request para uso posterior
    (req as any).courseAccess = courseAccess;
    (req as any).courseId = courseId;
    
    next();
  } catch (error) {
    console.error('Error validando acceso al curso:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
      details: 'Error al validar acceso al curso'
    });
  }
};

/**
 * Middleware para validar acceso administrativo a cursos
 * Permite acceso a administradores y superadmins
 */
export const validateAdminCourseAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as User;
    
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Acceso denegado',
        details: 'Debe estar autenticado'
      });
      return;
    }

    // Verificar si es superadmin
    if (user.Role?.name === 'superadmin') {
      next();
      return;
    }

    // Verificar permisos específicos
    const userPermissions = user.Role?.Permissions?.map(p => p.name) || [];
    const requiredPermissions = ['manage:course_content', 'manage:courses'];
    
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      res.status(403).json({
        status: 'error',
        message: 'Acceso denegado',
        details: 'No tienes permisos para gestionar contenido de cursos'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Error validando acceso administrativo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para rate limiting específico de contenido
 * Previene acceso excesivo a contenido de cursos
 */
export const contentRateLimit = (() => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
  const MAX_REQUESTS = 100; // Máximo 100 requests por ventana

  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const key = user ? `user_${user.id}` : `ip_${req.ip}`;
    const now = Date.now();
    
    const userRequests = requests.get(key);
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(key, { count: 1, resetTime: now + WINDOW_MS });
      next();
      return;
    }
    
    if (userRequests.count >= MAX_REQUESTS) {
      res.status(429).json({
        status: 'error',
        message: 'Demasiadas solicitudes',
        details: 'Has excedido el límite de solicitudes. Intenta más tarde.'
      });
      return;
    }
    
    userRequests.count++;
    next();
  };
})();