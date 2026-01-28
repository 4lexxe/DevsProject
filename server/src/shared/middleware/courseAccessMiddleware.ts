import { Request, Response, NextFunction } from 'express';
import CourseAccess from '../../modules/purchase/models/CourseAccess';
import Course from '../../modules/course/models/Course';
import Content from '../../modules/course/models/Content';
import Section from '../../modules/course/models/Section';
import { hasPermission } from './permissionsMiddleware';
import { Op } from 'sequelize';

export const verifyCourseAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;
    const userId = user.id;
    const courseId = req.params.courseId || req.params.id;

    // Si tiene permiso content:view, puede ver todo
    if (hasPermission(user, 'content:view')) {
      next();
      return;
    }

    if (!courseId) {
      res.status(400).json({
        success: false,
        message: 'ID del curso no proporcionado.',
      });
      return;
    }

    const courseAccess = await CourseAccess.findOne({
      where: {
        userId,
        courseId,
        revokedAt: {
          [Op.is]: null,
        },
      },
    });

    if (!courseAccess) {
      res.status(403).json({
        success: false,
        message: 'No tienes acceso a este curso.',
      });
      return;
    }

    req.courseAccess = {
      id: courseAccess.id,
      courseId: courseAccess.courseId,
      userId: courseAccess.userId,
      grantedAt: courseAccess.grantedAt,
      accessToken: courseAccess.accessToken,
    };

    next();
  } catch (error) {
    console.error('Error al verificar acceso al curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el acceso al curso.',
    });
  }
};

export const verifyCourseAccessFromContent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;
    const userId = user.id;
    const contentId = req.params.id;

    // Si tiene permiso content:view, puede ver todo
    if (hasPermission(user, 'content:view')) {
      next();
      return;
    }

    if (!contentId) {
      res.status(400).json({
        success: false,
        message: 'ID del contenido no proporcionado.',
      });
      return;
    }

    const content = await Content.findByPk(contentId, {
      include: [{ model: Section, as: 'section', attributes: ['courseId', 'moduleType'] }],
    });

    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Contenido no encontrado.',
      });
      return;
    }

    // Si la sección es de tipo Introductorio, acceso libre
    const moduleType = content.section?.getDataValue('moduleType');
    if (moduleType === 'Introductorio') {
      next();
      return;
    }

    const courseId = content.section?.getDataValue('courseId');
    if (!courseId) {
      res.status(404).json({
        success: false,
        message: 'Curso no encontrado.',
      });
      return;
    }

    const courseAccess = await CourseAccess.findOne({
      where: {
        userId,
        courseId,
        revokedAt: {
          [Op.is]: null,
        },
      },
    });

    if (!courseAccess) {
      res.status(403).json({
        success: false,
        message: 'No tienes acceso a este curso.',
      });
      return;
    }

    req.courseAccess = {
      id: courseAccess.id,
      courseId: courseAccess.courseId,
      userId: courseAccess.userId,
      grantedAt: courseAccess.grantedAt,
      accessToken: courseAccess.accessToken,
    };

    next();
  } catch (error) {
    console.error('Error al verificar acceso al curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el acceso al curso.',
    });
  }
};

// Extender el tipo Request
declare global {
  namespace Express {
    interface Request {
      courseAccess?: {
        id: bigint;
        courseId: bigint;
        userId: number;
        grantedAt: Date;
        accessToken: string;
      };
    }
  }
}
