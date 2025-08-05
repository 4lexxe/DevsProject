import { Request, Response } from 'express';
import { BaseController } from '../../purchase/controllers/BaseController';
import Progress from '../models/Progress';
import Course from '../models/Course';
import Content from '../models/Content';
import Section from '../models/Section';
import User from '../../user/User';
import Role from '../../role/Role';
import CourseAccess from '../../purchase/models/CourseAccess';
import { Op } from 'sequelize';
import sequelize from '../../../infrastructure/database/db';

/**
 * Controlador para gestionar el progreso del usuario en los cursos
 */
export class ProgressController extends BaseController {

  /**
   * Registra el acceso a un contenido específico
   */
  public static accessContent = this.asyncHandler(async (req: Request, res: Response) => {
    const { courseId, contentId } = req.params;
    const { timeSpent } = req.body;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return this.unauthorized(res, req, 'Usuario no autenticado');
    }

    // Verificar que el usuario tiene acceso al curso
    const courseAccess = await CourseAccess.findOne({
      where: {
        userId: userId,
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    if (!courseAccess) {
      return this.forbidden(res, req, 'No tienes acceso a este curso');
    }

    // Verificar que el contenido existe y pertenece al curso
    const content = await Content.findOne({
      where: { id: parseInt(contentId) },
      include: [{
        model: Section,
        as: 'section',
        where: { courseId: parseInt(courseId) }
      }]
    });

    if (!content) {
      return this.notFound(res, req, 'Contenido no encontrado');
    }

    // Buscar o crear el registro de progreso
    const [progress] = await Progress.findOrCreate({
      where: {
        userId: userId,
        courseId: parseInt(courseId),
        contentId: parseInt(contentId)
      },
      defaults: {
        userId: userId,
        courseId: parseInt(courseId),
        contentId: parseInt(contentId),
        isCompleted: false,
        timeSpent: timeSpent || 0,
        lastAccessedAt: new Date()
      }
    });

    // Si ya existe, actualizar el tiempo y último acceso
    if (progress) {
      await progress.update({
        timeSpent: (progress.timeSpent || 0) + (timeSpent || 0),
        lastAccessedAt: new Date()
      });
    }

    this.sendSuccess(res, req, {
      contentId: progress.contentId,
      timeSpent: progress.timeSpent,
      lastAccessedAt: progress.lastAccessedAt
    }, 'Acceso al contenido registrado');
  });

  /**
   * Marca un contenido como completado
   */
  public static markContentCompleted = this.asyncHandler(async (req: Request, res: Response) => {
    const { courseId, contentId } = req.params;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return this.unauthorized(res, req, 'Usuario no autenticado');
    }

    // Verificar que el usuario tiene acceso al curso
    const courseAccess = await CourseAccess.findOne({
      where: {
        userId: userId,
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    if (!courseAccess) {
      return this.forbidden(res, req, 'No tienes acceso a este curso');
    }

    // Verificar que el contenido existe y pertenece al curso
    const content = await Content.findOne({
      where: { id: parseInt(contentId) },
      include: [{
        model: Section,
        as: 'section',
        where: { courseId: parseInt(courseId) }
      }]
    });

    if (!content) {
      return this.notFound(res, req, 'Contenido no encontrado');
    }

    // Buscar o crear el registro de progreso
    const [progress] = await Progress.findOrCreate({
      where: {
        userId: userId,
        courseId: parseInt(courseId),
        contentId: parseInt(contentId)
      },
      defaults: {
        userId: userId,
        courseId: parseInt(courseId),
        contentId: parseInt(contentId),
        isCompleted: true,
        completedAt: new Date(),
        timeSpent: 0,
        lastAccessedAt: new Date()
      }
    });

    // Si ya existe, actualizarlo
    if (!progress.isCompleted) {
      await progress.update({
        isCompleted: true,
        completedAt: new Date(),
        lastAccessedAt: new Date()
      });
    }

    // Calcular progreso del curso
    const courseProgress = await this.calculateCourseProgress(userId, parseInt(courseId));

    this.sendSuccess(res, req, {
      contentId: progress.contentId,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt,
      courseProgress
    }, 'Contenido marcado como completado');
  });

  /**
   * Obtiene el progreso completo de un usuario en un curso
   */
  public static getCourseProgress = this.asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return this.unauthorized(res, req, 'Usuario no autenticado');
    }

    // Verificar acceso al curso
    const courseAccess = await CourseAccess.findOne({
      where: {
        userId: userId,
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    if (!courseAccess) {
      return this.forbidden(res, req, 'No tienes acceso a este curso');
    }

    const progressData = await this.getCourseProgressDetails(userId, parseInt(courseId));

    this.sendSuccess(res, req, progressData, 'Progreso del curso obtenido exitosamente');
  });

  /**
   * Obtiene el progreso de todos los cursos de un usuario
   */
  public static getUserProgress = this.asyncHandler(async (req: Request, res: Response) => {
    const userId = (req.user as User)?.id;

    if (!userId) {
      return this.unauthorized(res, req, 'Usuario no autenticado');
    }

    // Obtener todos los cursos a los que tiene acceso
    const courseAccesses = await CourseAccess.findAll({
      where: {
        userId: userId,
        revokedAt: null
      },
      include: [{
        model: Course,
        as: 'course'
      }]
    });

    const coursesProgress = await Promise.all(
      courseAccesses.map(async (access: any) => {
        const courseProgress = await this.calculateCourseProgress(userId, access.courseId);
        return {
          courseId: access.courseId,
          courseName: access.course.title,
          ...courseProgress
        };
      })
    );

    this.sendSuccess(res, req, {
      courses: coursesProgress
    }, 'Progreso del usuario obtenido exitosamente');
  });

  /**
   * Calcula el progreso de un curso para un usuario
   */
  private static async calculateCourseProgress(userId: number, courseId: number): Promise<{
    percentage: number;
    completedContent: number;
    totalContent: number;
    totalTimeSpent: number;
  }> {
    // Obtener todo el contenido del curso
    const totalContent = await Content.count({
      include: [{
        model: Section,
        as: 'section',
        where: { courseId }
      }]
    });

    // Obtener contenido completado por el usuario
    const completedContent = await Progress.count({
      where: {
        userId,
        courseId,
        isCompleted: true
      }
    });

    // Calcular tiempo total gastado
    const progressRecords = await Progress.findAll({
      where: {
        userId,
        courseId
      },
      attributes: ['timeSpent']
    });

    const totalTimeSpent = progressRecords.reduce((total, record) => {
      return total + (record.timeSpent || 0);
    }, 0);

    const percentage = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

    return {
      percentage,
      completedContent,
      totalContent,
      totalTimeSpent
    };
  }

  /**
   * Obtiene detalles completos del progreso de un curso
   */
  private static async getCourseProgressDetails(userId: number, courseId: number) {
    const course = await Course.findByPk(courseId, {
      include: [{
        model: Section,
        as: 'sections',
        include: [{
          model: Content,
          as: 'contents'
        }]
      }]
    });

    if (!course) {
      throw new Error('Curso no encontrado');
    }

    // Obtener progreso del usuario para este curso
    const userProgress = await Progress.findAll({
      where: {
        userId,
        courseId
      }
    });

    // Crear un mapa de progreso por contentId
    const progressMap = new Map();
    userProgress.forEach((progress) => {
      progressMap.set(progress.contentId, progress);
    });

    // Calcular progreso general
    const progressSummary = await this.calculateCourseProgress(userId, courseId);

    // Mapear secciones con su progreso
    const sectionsProgress = (course as any).sections.map((section: any) => {
      const sectionContents = section.contents.map((content: any) => {
        const contentProgress = progressMap.get(content.id);
        return {
          contentId: content.id,
          title: content.title,
          isCompleted: contentProgress?.isCompleted || false,
          completedAt: contentProgress?.completedAt || null,
          timeSpent: contentProgress?.timeSpent || 0,
          lastAccessedAt: contentProgress?.lastAccessedAt || null
        };
      });

      const completedInSection = sectionContents.filter((c: any) => c.isCompleted).length;
      const totalInSection = sectionContents.length;
      const sectionPercentage = totalInSection > 0 ? Math.round((completedInSection / totalInSection) * 100) : 0;

      return {
        sectionId: section.id,
        title: section.title,
        progress: {
          percentage: sectionPercentage,
          completedContent: completedInSection,
          totalContent: totalInSection
        },
        contents: sectionContents
      };
    });

    return {
      courseId,
      courseName: (course as any).title,
      progress: progressSummary,
      sections: sectionsProgress
    };
  }

  /**
   * Reinicia el progreso de un curso (solo para administradores)
   */
  public static resetCourseProgress = this.asyncHandler(async (req: Request, res: Response) => {
    const { courseId, targetUserId } = req.params;
    const userId = (req.user as User)?.id;

    if (!userId) {
      return this.unauthorized(res, req, 'Usuario no autenticado');
    }

    // Solo permitir a administradores o al propio usuario
    const user = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'Role'
      }]
    });
    if (!user || (user.id !== parseInt(targetUserId || userId.toString()) && user.Role?.name !== 'admin')) {
      return this.forbidden(res, req, 'No tienes permisos para realizar esta acción');
    }

    const targetUser = parseInt(targetUserId || userId.toString());

    // Eliminar todo el progreso del curso
    await Progress.destroy({
      where: {
        userId: targetUser,
        courseId: parseInt(courseId)
      }
    });

    this.sendSuccess(res, req, {
      courseId: parseInt(courseId),
      userId: userId
    }, 'Progreso del curso reiniciado exitosamente');
  });
}

export default ProgressController;