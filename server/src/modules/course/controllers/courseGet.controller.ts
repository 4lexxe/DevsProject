import { Request, Response, RequestHandler } from "express";
import Course, { CourseCategory } from "../models/Course";
import Category from "../models/Category";
import CareerType from "../models/CareerType";
import Section from "../models/Section";
import Content from "../models/Content";
import CourseDiscount from "../../purchase/models/CourseDiscount";
import Admin from "../../admin/Admin";
import User from "../../user/User";
import CourseAccess from "../../purchase/models/CourseAccess";
import { Op } from "sequelize";
import { BaseController } from "./BaseController";
import { generateSlug, generateUniqueSlug } from "../../../shared/utils/slugGenerator";
import { checkCourseAccessAndPermissions, verifyUserPermissions } from "../utils/courseAccessHelper";
// Importar asociaciones para asegurar que están cargadas
import "../../purchase/models/Associations";

export default class CourseGetController extends BaseController {
    // Obtener todos los cursos
  static getAll: RequestHandler = async (req, res) => {
    try {
      const courses = await Course.findAll({
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          {
            model: Admin,
            as: "admin",
            include: [
              {
                model: User,
                as: "adminUser",
                attributes: ["id", "name", "username", "displayName", "avatar"],
              },
            ],
            attributes: ["id", "name", "userId"],
          },
        ],
        order: [["id", "ASC"]],
      });

      // Procesar cursos para incluir información del creador
      const coursesWithCreator = courses.map(course => {
        const courseData = course.toJSON() as any;
        
        // Extraer información del creador (Admin -> User)
        const creator = courseData.admin?.adminUser ? {
          id: courseData.admin.adminUser.id,
          name: courseData.admin.adminUser.displayName || courseData.admin.adminUser.name || courseData.admin.name,
          username: courseData.admin.adminUser.username,
          avatar: courseData.admin.adminUser.avatar,
        } : courseData.admin ? {
          id: courseData.admin.userId,
          name: courseData.admin.name,
          username: undefined,
          avatar: undefined,
        } : null;

        return {
          ...courseData,
          creator,
        };
      });

      CourseGetController.sendSuccess(res, req, coursesWithCreator, "Cursos obtenidos correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos");
    }
  };

  // Obtener cursos activos
  static getActiveCourses: RequestHandler = async (req, res) => {
    try {
      const courses = await Course.findAll({
        where: { isActive: true },
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          {
            model: CourseDiscount,
            as: "courseDiscount",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
            },
            required: false,
          },
          {
            model: Admin,
            as: "admin",
            include: [
              {
                model: User,
                as: "adminUser",
                attributes: ["id", "name", "username", "displayName", "avatar"],
              },
            ],
            attributes: ["id", "name", "userId"],
          },
        ],
        order: [["id", "ASC"]],
      });

      // Procesar precios y descuentos para cada curso (relación uno a uno)
      const coursesWithPricing = courses.map(course => {
        const courseData = course.toJSON() as any;
        const originalPrice = parseFloat(courseData.price.toString());
        let finalPrice = originalPrice;
        let discountValue = 0;
        let savings = 0;

        if (courseData.courseDiscount) {
          discountValue = courseData.courseDiscount.value;
          savings = (originalPrice * discountValue) / 100;
          finalPrice = originalPrice - savings;
          if (finalPrice < 0) {
            finalPrice = 0;
            savings = originalPrice;
          }
        }

        const isFree = originalPrice === 0 || discountValue >= 100 || finalPrice === 0;
        const priceDisplay = isFree ? "GRATIS" : `$${finalPrice.toFixed(2)}`;

        // Extraer información del creador (Admin -> User)
        const creator = courseData.admin?.adminUser ? {
          id: courseData.admin.adminUser.id,
          name: courseData.admin.adminUser.displayName || courseData.admin.adminUser.name || courseData.admin.name,
          username: courseData.admin.adminUser.username,
          avatar: courseData.admin.adminUser.avatar,
        } : courseData.admin ? {
          id: courseData.admin.userId,
          name: courseData.admin.name,
          username: undefined,
          avatar: undefined,
        } : null;

        return {
          ...courseData,
          creator,
          pricing: {
            originalPrice,
            finalPrice: Math.round(finalPrice * 100) / 100,
            hasDiscount: !!courseData.courseDiscount,
            discount: courseData.courseDiscount || null,
            discountValue,
            savings: Math.round(savings * 100) / 100,
            isFree,
            priceDisplay
          },
        };
      });

      CourseGetController.sendSuccess(res, req, coursesWithPricing, "Cursos activos obtenidos correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos activos");
    }
  };

  // Obtener cursos en desarrollo
  static getInDevelopmentCourses: RequestHandler = async (req, res) => {
    try {
      const courses = await Course.findAll({
        where: { isInDevelopment: true },
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
        ],
        order: [["id", "ASC"]],
      });
      CourseGetController.sendSuccess(res, req, courses, "Cursos en desarrollo obtenidos correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos en desarrollo");
    }
  };

  // Obtener cursos por el ID de un admin
  static getByAdminId: RequestHandler = async (req, res) => {
    try {
      const { adminId } = req.params;
      const courses = await Course.findAll({
        where: { adminId },
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          { model: Section, as: "sections" },
        ],
        order: [["id", "ASC"]],
      });
      CourseGetController.sendSuccess(res, req, courses, "Cursos obtenidos correctamente para el admin especificado");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos del admin");
    }
  };

  // Helper para encontrar curso por slug o id
  private static async findCourseByIdentifier(identifier: string) {
    // Intentar primero por slug (más común)
    let course = await Course.findOne({
      where: { slug: identifier },
    });

    // Si no se encuentra por slug, intentar por ID
    if (!course) {
      const id = parseInt(identifier);
      if (!isNaN(id)) {
        course = await Course.findByPk(id);
      }
    }

    return course;
  }

  // Obtener un curso por ID o slug
  static getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseGetController.findCourseByIdentifier(id);
      
      if (!course) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      const courseData = await Course.findByPk(course.id, {
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          { 
            model: Section, 
            as: "sections",
            include: [
              {
                model: Content,
                as: "contents",
                attributes: {
                  exclude: [], // Incluir todos los atributos disponibles
                },
                order: [["position", "ASC"]]
              }
            ],
            order: [["id", "ASC"]]
          },
          {
            model: Admin,
            as: "admin",
            include: [
              {
                model: User,
                as: "adminUser",
                attributes: ["id", "name", "surname", "email", "username", "avatar", "displayName"]
              }
            ],
            attributes: ["id", "name", "isSuperAdmin", "admin_since"]
          },
          {
            model: Course,
            as: "affiliatedCourse",
            attributes: ["id", "title", "slug", "image", "summary"],
            required: false
          }
        ],
      });
      if (!courseData) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      CourseGetController.sendSuccess(res, req, courseData, "Curso obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el curso");
    }
  };

  // Obtener un curso por ID o slug con todos los descuentos aplicados
  static getByIdWithPrices: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseGetController.findCourseByIdentifier(id);
      
      if (!course) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      const courseWithData = await Course.findByPk(course.id, {
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          { model: Section, as: "sections" },
          {
            model: CourseDiscount,
            as: "courseDiscount",
            where: {
              isActive: true,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
            },
            required: false,
          },
        ],
      });
      if (!courseWithData) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      const courseData = courseWithData.toJSON() as any;
      const originalPrice = parseFloat(courseData.price.toString());
      let finalPrice = originalPrice;
      let discountValue = 0;
      let savings = 0;

      if (courseData.courseDiscount) {
        discountValue = courseData.courseDiscount.value;
        savings = (originalPrice * discountValue) / 100;
        finalPrice = originalPrice - savings;
        if (finalPrice < 0) {
          finalPrice = 0;
          savings = originalPrice;
        }
      }

      const isFree = originalPrice === 0 || discountValue >= 100 || finalPrice === 0;
      const priceDisplay = isFree ? "GRATIS" : `$${finalPrice.toFixed(2)}`;

      const responseData = {
        ...courseData,
        pricing: {
          originalPrice,
          finalPrice: Math.round(finalPrice * 100) / 100,
          hasDiscount: !!courseData.courseDiscount,
          discount: courseData.courseDiscount || null,
          discountValue,
          savings: Math.round(savings * 100) / 100,
          isFree,
          priceDisplay
        },
      };

      CourseGetController.sendSuccess(res, req, responseData, "Curso obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el curso");
    }
  };

  // Obtener un curso por ID o slug con secciones y contenidos para navegación
  static getCourseNavigation: RequestHandler = async (req, res) => {
    try {
      const user = req.user as User | undefined;
      const { id } = req.params;
      const course = await CourseGetController.findCourseByIdentifier(id);
      
      if (!course) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      // Obtener el curso completo con información de precio y admin
      const courseWithAccess = await Course.findByPk(course.id, {
        attributes: ['id', 'title', 'slug', 'price', 'adminId'],
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["id", "userId"]
          }
        ]
      });

      if (!courseWithAccess) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      // Verificar permisos básicos
      if (!verifyUserPermissions(user, ["read:course_details", "access:course_content"])) {
        if (!user) {
          res.status(403).json({
            status: "error",
            message: "Debes iniciar sesión para acceder a este recurso",
            requiresAuth: true,
            requiresAccess: false,
          });
          return;
        }
        CourseGetController.forbidden(res, req, "No tienes permisos para acceder a este recurso");
        return;
      }

      // Verificar acceso al curso (pago, etc.)
      const accessCheck = await checkCourseAccessAndPermissions(req, res, courseWithAccess);
      if (!accessCheck.allowed) {
        res.status(403).json(accessCheck.errorResponse);
        return;
      }

      const courseData = await Course.findByPk(course.id, {
        attributes: ['id', 'title', 'slug'],
        include: [
          {
            model: Section,
            as: "sections",
            attributes: ['id', 'title', 'slug'],
            include: [
              {
                model: Content,
                as: "contents",
                attributes: {
                  exclude: [], // Incluir todos los atributos disponibles (slug se incluirá si existe)
                },
              },
            ],
          },
        ],
        order: [
          [{ model: Section, as: "sections" }, 'id', 'ASC'],
          [{ model: Section, as: "sections" }, { model: Content, as: "contents" }, 'id', 'ASC'],
        ],
      });

      if (!courseData) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      //  Devolver los datos completos del curso con secciones y contenidos,
      // no solo el modelo base sin relaciones.
      CourseGetController.sendSuccess(res, req, courseData, "Curso obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el curso para navegación");
    }
  };

  // Obtener cursos por categoría
  static getByCategory: RequestHandler = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const courses = await Course.findAll({
        include: [
          { model: Category, as: "categories", where: { id: categoryId } },
          { model: CareerType, as: "careerType" },
        ],
      });
      CourseGetController.sendSuccess(res, req, courses, "Cursos obtenidos correctamente por categoría");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos por categoría");
    }
  };

  // Obtener cursos por tipo de carrera
  static getByCareerType: RequestHandler = async (req, res) => {
    try {
      const { careerTypeId } = req.body;
      const courses = await Course.findAll({
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType", where: { id: careerTypeId } },
        ],
      });
      CourseGetController.sendSuccess(res, req, courses, "Cursos obtenidos correctamente por tipo de carrera");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los cursos por tipo de carrera");
    }
  };

  // Obtener el conteo total de cursos
  static getTotalCount: RequestHandler = async (req, res) => {
    try {
      const count = await Course.count();
      CourseGetController.sendSuccess(res, req, { total: count }, "Conteo total de cursos obtenido correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener el conteo de cursos");
    }
  };

  // Obtener información completa del curso con creador, instructor, secciones, contenidos y usuarios inscritos
  static getCourseCompleteInfo: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await CourseGetController.findCourseByIdentifier(id);
      
      if (!course) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }
      
      // Obtener el curso con todas sus relaciones
      const courseWithRelations = await Course.findByPk(course.id, {
        include: [
          { model: Category, as: "categories" },
          { model: CareerType, as: "careerType" },
          { 
            model: Section, 
            as: "sections",
            include: [
              {
                model: Content,
                as: "contents",
                separate: true,
                order: [["position", "ASC"]]
              }
            ],
            order: [["id", "ASC"]]
          },
          {
            model: Admin,
            as: "admin",
            include: [
              {
                model: User,
                as: "adminUser",
                attributes: ["id", "name", "surname", "email", "username", "avatar", "displayName"]
              }
            ],
            attributes: ["id", "name", "isSuperAdmin", "admin_since"]
          }
        ],
      });

      if (!courseWithRelations) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      // Obtener usuarios inscritos (con acceso activo y no expirado)
      const enrolledUsers = await CourseAccess.findAll({
        where: {
          courseId: parseInt(course.id.toString()),
          revokedAt: null, // Solo usuarios con acceso activo
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "surname", "email", "username", "avatar", "displayName", "createdAt"]
          }
        ],
        attributes: ["id", "userId", "grantedAt", "expiresAt", "createdAt"],
        order: [["grantedAt", "DESC"]]
      });

      // Contar total de inscripciones (incluyendo revocadas)
      const totalEnrollments = await CourseAccess.count({
        where: {
          courseId: parseInt(course.id.toString())
        }
      });

      // Contar inscripciones activas
      const activeEnrollments = enrolledUsers.length;

      const courseData = courseWithRelations.toJSON() as any;
      
      const responseData = {
        ...courseData,
        creator: courseData.admin ? {
          id: courseData.admin.id,
          name: courseData.admin.name,
          isSuperAdmin: courseData.admin.isSuperAdmin,
          adminSince: courseData.admin.admin_since,
          user: courseData.admin.adminUser
        } : null,
        instructor: courseData.admin ? {
          id: courseData.admin.id,
          name: courseData.admin.name,
          user: courseData.admin.adminUser
        } : null,
        sections: courseData.sections || [],
        contentsCount: courseData.sections?.reduce((total: number, section: any) => {
          return total + (section.contents?.length || 0);
        }, 0) || 0,
        enrolledUsers: enrolledUsers.map((access: any) => ({
          id: access.user.id,
          name: access.user.name,
          surname: access.user.surname,
          email: access.user.email,
          username: access.user.username,
          avatar: access.user.avatar,
          displayName: access.user.displayName,
          enrolledAt: access.grantedAt,
          expiresAt: access.expiresAt,
          isPermanent: !access.expiresAt,
          isExpired: access.expiresAt ? new Date(access.expiresAt) <= new Date() : false,
          accessId: access.id,
          courseId: parseInt(course.id.toString())
        })),
        enrollmentStats: {
          total: totalEnrollments,
          active: activeEnrollments,
          revoked: totalEnrollments - activeEnrollments
        }
      };

      CourseGetController.sendSuccess(res, req, responseData, "Información completa del curso obtenida correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener la información completa del curso");
    }
  };

  // Obtener usuarios inscritos en un curso por ID o slug
  static getCourseEnrolledUsers: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { includeRevoked } = req.query;

      const course = await CourseGetController.findCourseByIdentifier(id);
      
      if (!course) {
        CourseGetController.notFound(res, req, "Curso");
        return;
      }

      const whereClause: any = {
        courseId: parseInt(course.id.toString())
      };

      if (includeRevoked !== 'true') {
        whereClause.revokedAt = null;
      }

      const enrolledUsers = await CourseAccess.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "surname", "email", "username", "avatar", "displayName", "createdAt"]
          }
        ],
        attributes: ["id", "userId", "grantedAt", "revokedAt", "revokeReason", "expiresAt", "createdAt"],
        order: [["grantedAt", "DESC"]]
      });

      const usersData = enrolledUsers.map((access: any) => ({
        id: access.user.id,
        name: access.user.name,
        surname: access.user.surname,
        email: access.user.email,
        username: access.user.username,
        avatar: access.user.avatar,
        displayName: access.user.displayName,
        enrolledAt: access.grantedAt,
        revokedAt: access.revokedAt,
        expiresAt: access.expiresAt,
        isPermanent: !access.expiresAt,
        isExpired: access.expiresAt ? new Date(access.expiresAt) <= new Date() : false,
        revokeReason: access.revokeReason,
        accessId: access.id,
        isActive: access.revokedAt === null
      }));

      CourseGetController.sendSuccess(res, req, usersData, "Usuarios inscritos obtenidos correctamente");
    } catch (error) {
      CourseGetController.handleServerError(res, req, error, "Error al obtener los usuarios inscritos");
    }
  };
}