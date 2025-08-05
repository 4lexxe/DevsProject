import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import CourseAccess from "../models/CourseAccess";
import Course from "../../course/models/Course";
import Progress from "../../course/models/Progress";
import Content from "../../course/models/Content";
import Section from "../../course/models/Section";
import { Op } from "sequelize";
// Importar asociaciones para asegurar que están cargadas
import "../models/Associations";

/**
 * Controlador para gestionar el acceso a cursos pagados
 * Permite a los usuarios ver y acceder a los cursos que han comprado
 */
export class CourseAccessController extends BaseController {

  /**
   * Obtiene todos los cursos a los que el usuario tiene acceso
   */
  public static getUserCourses = this.asyncHandler(async (req: Request, res: Response) => {
    // Verificar errores de validación
    if (!this.handleValidationErrors(req, res)) return;

    const { userId } = req.params;

    const userCourses = await CourseAccess.findAll({
      where: {
        userId: parseInt(userId),
        revokedAt: null // Solo cursos con acceso activo
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: [
            'id', 'title', 'summary', 'image', 'price',
            'isActive', 'careerTypeId', 'createdAt'
          ],
          where: {
            isActive: true // Solo cursos activos
          }
        }
      ],
      order: [['grantedAt', 'DESC']]
    });

    // Transformar datos para el frontend
    const coursesData = await Promise.all(
      userCourses.map(async (access: any) => ({
        id: access.course.id,
        title: access.course.title,
        description: access.course.summary,
        imageUrl: access.course.image,
        price: access.course.price,
        progress: await this.calculateCourseProgress(parseInt(userId), access.course.id),
        accessToken: access.accessToken,
        grantedAt: access.grantedAt,
        isActive: access.revokedAt === null,
        courseId: access.courseId
      }))
    );

    this.sendSuccess(res, req, coursesData, "Cursos del usuario obtenidos exitosamente");
  });

  /**
   * Obtiene los detalles de un curso específico al que el usuario tiene acceso
   */
  public static getCourseDetails = this.asyncHandler(async (req: Request, res: Response) => {
    // Verificar errores de validación
    if (!this.handleValidationErrors(req, res)) return;

    const { userId, courseId } = req.params;

    // Verificar que el usuario tiene acceso al curso
    const courseAccess = await CourseAccess.findOne({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        revokedAt: null
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: [
            'id', 'title', 'summary', 'about', 'image', 'price',
            'learningOutcomes', 'prerequisites', 'isActive', 'createdAt'
          ]
        }
      ]
    });

    if (!courseAccess) {
      return this.forbidden(res, req, "No tienes acceso a este curso");
    }

    const courseDetails = {
      id: (courseAccess as any).course.id,
      title: (courseAccess as any).course.title,
      description: (courseAccess as any).course.summary,
      about: (courseAccess as any).course.about,
      imageUrl: (courseAccess as any).course.image,
      price: (courseAccess as any).course.price,
      learningOutcomes: (courseAccess as any).course.learningOutcomes,
      prerequisites: (courseAccess as any).course.prerequisites,
      progress: await this.calculateCourseProgress(parseInt(userId), (courseAccess as any).course.id),
      accessToken: courseAccess.accessToken,
      grantedAt: courseAccess.grantedAt,
      isActive: courseAccess.revokedAt === null
    };

    this.sendSuccess(res, req, courseDetails, "Detalles del curso obtenidos exitosamente");
  });

  /**
   * Verifica si el usuario tiene acceso a un curso específico
   */
  public static checkCourseAccess = this.asyncHandler(async (req: Request, res: Response) => {
    // Verificar errores de validación
    if (!this.handleValidationErrors(req, res)) return;

    const { userId, courseId } = req.params;

    const courseAccess = await CourseAccess.findOne({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    const hasAccess = !!courseAccess;
    const accessData = hasAccess ? {
      hasAccess: true,
      accessToken: courseAccess.accessToken,
      grantedAt: courseAccess.grantedAt,
      courseId: courseAccess.courseId
    } : {
      hasAccess: false
    };

    this.sendSuccess(res, req, accessData, 
      hasAccess ? "El usuario tiene acceso al curso" : "El usuario no tiene acceso al curso");
  });

  /**
   * Obtiene estadísticas de cursos del usuario
   */
  public static getUserCourseStats = this.asyncHandler(async (req: Request, res: Response) => {
    // Verificar errores de validación
    if (!this.handleValidationErrors(req, res)) return;

    const { userId } = req.params;

    const totalCourses = await CourseAccess.count({
      where: {
        userId: parseInt(userId),
        revokedAt: null
      }
    });

    const revokedCourses = await CourseAccess.count({
      where: {
        userId: parseInt(userId),
        revokedAt: { [Op.not]: null }
      }
    });

    const stats = {
      totalCourses,
      activeCourses: totalCourses,
      revokedCourses,
      completedCourses: 0 // TODO: Implementar cuando tengamos sistema de progreso
    };

    this.sendSuccess(res, req, stats, "Estadísticas de cursos obtenidas exitosamente");
  });

  /**
   * Otorga acceso a un curso para un usuario (usado después de una compra exitosa)
   */
  public static grantCourseAccess = this.asyncHandler(async (req: Request, res: Response) => {
    // Verificar errores de validación
    if (!this.handleValidationErrors(req, res)) return;

    const { userId, courseId } = req.body;

    // Verificar si ya existe acceso
    const existingAccess = await CourseAccess.findOne({
      where: {
        userId,
        courseId,
        revokedAt: null
      }
    });

    if (existingAccess) {
      return this.conflict(res, req, "El usuario ya tiene acceso a este curso");
    }

    // Generar token de acceso único
    const accessToken = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Crear nuevo acceso
    const newAccess = await CourseAccess.create({
      userId,
      courseId,
      accessToken,
      grantedAt: new Date()
    });

    this.created(res, req, {
      id: newAccess.id,
      accessToken: newAccess.accessToken,
      grantedAt: newAccess.grantedAt,
      userId: newAccess.userId,
      courseId: newAccess.courseId
    }, "Acceso al curso otorgado exitosamente");
  });

  /**
   * Revoca el acceso a un curso (solo para administradores)
   */
  public static revokeCourseAccess = this.asyncHandler(async (req: Request, res: Response) => {
    // Verificar errores de validación
    if (!this.handleValidationErrors(req, res)) return;

    const { userId, courseId } = req.params;
    const { revokeReason } = req.body;

    const courseAccess = await CourseAccess.findOne({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        revokedAt: null
      }
    });

    if (!courseAccess) {
      return this.notFound(res, req, "Acceso al curso");
    }

    await courseAccess.update({
      revokedAt: new Date(),
      revokeReason: revokeReason || "Revocado por administrador"
    });

    this.updated(res, req, {
      revokedAt: courseAccess.revokedAt,
      revokeReason: courseAccess.revokeReason
    }, "Acceso al curso revocado exitosamente");
  });

  /**
   * Obtiene el historial de accesos de un usuario (incluyendo revocados)
   */
  public static getCourseAccessHistory = this.asyncHandler(async (req: Request, res: Response) => {
    // Verificar errores de validación
    if (!this.handleValidationErrors(req, res)) return;

    const { userId } = req.params;

    const { page: currentPage, limit: pageLimit, offset } = this.getPaginationParams(req, 10);

    const { rows: courseAccesses, count } = await CourseAccess.findAndCountAll({
      where: { userId: parseInt(userId) },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'summary', 'image', 'price']
        }
      ],
      order: [['grantedAt', 'DESC']],
      limit: pageLimit,
      offset
    });

    const accessHistory = courseAccesses.map((access: any) => ({
      id: access.id,
      courseId: access.courseId,
      courseName: access.course.title,
      courseImage: access.course.image,
      coursePrice: access.course.price,
      accessToken: access.accessToken,
      grantedAt: access.grantedAt,
      revokedAt: access.revokedAt,
      revokeReason: access.revokeReason,
      status: access.revokedAt ? 'revoked' : 'active'
    }));

    this.sendPaginated(res, req, accessHistory, count, currentPage, pageLimit, "Historial de accesos obtenido exitosamente");
  });

  /**
   * Calcula el porcentaje de progreso de un usuario en un curso
   */
  private static async calculateCourseProgress(userId: number, courseId: number): Promise<number> {
    try {
      // Obtener total de contenidos del curso
      const totalContent = await Content.count({
        include: [{
          model: Section,
          as: 'section',
          where: { courseId }
        }]
      });

      if (totalContent === 0) {
        return 0;
      }

      // Obtener contenidos completados por el usuario
      const completedContent = await Progress.count({
        where: {
          userId,
          courseId,
          isCompleted: true
        }
      });

      // Calcular porcentaje
      return Math.round((completedContent / totalContent) * 100);
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return 0;
    }
  }
}
