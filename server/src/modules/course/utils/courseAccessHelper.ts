import { Request, Response } from "express";
import User from "../../user/User";
import Course from "../models/Course";
import Admin from "../../admin/Admin";
import CourseAccess from "../../purchase/models/CourseAccess";
import { Op } from "sequelize";

interface AccessCheckResult {
  hasAccess: boolean;
  requiresAuth: boolean;
  requiresAccess: boolean;
  reason?: string;
}

/**
 * Verifica si un usuario tiene acceso a un curso
 * @param user - Usuario autenticado (puede ser undefined)
 * @param course - Curso a verificar
 * @returns Resultado de la verificación de acceso
 */
export async function verifyCourseAccess(
  user: User | undefined,
  course: Course
): Promise<AccessCheckResult> {
  // DEBUG: Verificar estado del usuario
  console.log(`[DEBUG verifyCourseAccess] User ID: ${user?.id || 'undefined'}, User exists: ${!!user}, Course ID: ${course.id}`);
  
  const coursePrice = parseFloat(course.price?.toString() || "0");
  const isPaidCourse = coursePrice > 0;

  // Si el curso es gratuito, aún requiere autenticación y permisos básicos
  // pero no requiere pago
  if (!isPaidCourse) {
    // Para cursos gratuitos, solo verificar que esté autenticado
    if (!user || !user.id) {
      console.log(`[DEBUG verifyCourseAccess] Curso gratuito - Usuario no autenticado, bloqueando acceso`);
      return {
        hasAccess: false,
        requiresAuth: true,
        requiresAccess: false,
        reason: "Debes iniciar sesión para acceder a este contenido",
      };
    }
    console.log(`[DEBUG verifyCourseAccess] Curso gratuito - Usuario autenticado (${user.id}), permitiendo acceso`);
    return {
      hasAccess: true,
      requiresAuth: false,
      requiresAccess: false,
    };
  }

  // Si es un curso de pago, verificar acceso del usuario
  if (isPaidCourse) {
    // PRIMERO: Verificar si el usuario está autenticado
    if (!user || !user.id) {
      return {
        hasAccess: false,
        requiresAuth: true,
        requiresAccess: false,
        reason: "Debes iniciar sesión para acceder a este contenido",
      };
    }

    // Verificar si el usuario es el dueño del curso o tiene permisos especiales
    let hasSpecialAccess = false;

    // 1. Verificar si es el dueño del curso
    const courseWithAdmin = await Course.findByPk(course.id, {
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "userId"],
        },
      ],
    });

    const courseAdmin = (courseWithAdmin as any)?.admin;
    if (courseAdmin && courseAdmin.userId === user.id) {
      hasSpecialAccess = true;
      console.log(`[DEBUG verifyCourseAccess]  Usuario ${user.id} es el dueño del curso ${course.id}`);
    } else {
      console.log(`[DEBUG verifyCourseAccess] Usuario ${user.id} NO es el dueño (admin.userId: ${courseAdmin?.userId || 'undefined'})`);
      
      // 2. Verificar permisos especiales (superadmin o manage:all_courses) solo si no es dueño
      if (user.Role) {
        const userPermissions = user.Role.Permissions?.map((p: any) => p.name) || [];
        const isSuperAdmin = user.Role.name === "superadmin";
        const canManageAllCourses =
          userPermissions.includes("manage:all_courses") ||
          userPermissions.includes("manage:courses");

        if (isSuperAdmin || canManageAllCourses) {
          hasSpecialAccess = true;
          console.log(
            `[DEBUG verifyCourseAccess]  Usuario ${user.id} tiene permisos especiales para acceder al curso ${course.id}`
          );
        } else {
          console.log(`[DEBUG verifyCourseAccess] Usuario ${user.id} NO tiene permisos especiales (isSuperAdmin: ${isSuperAdmin}, canManageAllCourses: ${canManageAllCourses})`);
        }
      } else {
        console.log(`[DEBUG verifyCourseAccess] Usuario ${user.id} NO tiene Role`);
      }
    }

    // Si no tiene acceso especial, verificar CourseAccess
    if (!hasSpecialAccess) {
      const courseAccess = await CourseAccess.findOne({
        where: {
          userId: user.id,
          courseId: course.id,
          revokedAt: null,
          [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
        },
      });

      if (!courseAccess) {
        return {
          hasAccess: false,
          requiresAuth: true,
          requiresAccess: true,
          reason: "No tienes acceso a este curso. Debes comprarlo para ver su contenido.",
        };
      }
    } else {
      console.log(
        `[DEBUG verifyCourseAccess]  Acceso permitido sin pago para usuario ${user.id} al curso ${course.id}`
      );
    }
  }

  return {
    hasAccess: true,
    requiresAuth: false,
    requiresAccess: false,
  };
}

/**
 * Verifica permisos del usuario para acceder a recursos del curso
 * @param user - Usuario autenticado
 * @param requiredPermissions - Permisos requeridos (al menos uno)
 * @returns true si tiene permisos, false si no
 */
export function verifyUserPermissions(
  user: User | undefined,
  requiredPermissions: string[]
): boolean {
  // DEBUG
  console.log(`[DEBUG verifyUserPermissions] User ID: ${user?.id || 'undefined'}, User exists: ${!!user}, Has Role: ${!!user?.Role}`);
  
  // Si no hay usuario, no tiene permisos
  if (!user || !user.Role) {
    console.log(`[DEBUG verifyUserPermissions] Usuario sin permisos - User: ${user?.id || 'undefined'}, Role: ${user?.Role ? 'exists' : 'undefined'}`);
    return false;
  }

  // Los superadmin tienen acceso total
  if (user.Role.name === "superadmin") {
    return true;
  }

  // Verificar si el usuario tiene al menos uno de los permisos necesarios (OR logic)
  const userPermissions = user.Role.Permissions?.map((p: any) => p.name) || [];

  const hasAnyPermission = requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );

  return hasAnyPermission;
}

/**
 * Middleware helper para verificar acceso a curso y permisos
 * Retorna un objeto con información del error si no tiene acceso
 */
export async function checkCourseAccessAndPermissions(
  req: Request,
  res: Response,
  course: Course,
  requiredPermissions: string[] = ["read:course_details", "access:course_content"]
): Promise<{ allowed: boolean; errorResponse?: any }> {
  const user = req.user as User | undefined;

  // Verificar permisos básicos
  if (!verifyUserPermissions(user, requiredPermissions)) {
    if (!user) {
      return {
        allowed: false,
        errorResponse: {
          status: "error",
          message: "Debes iniciar sesión para acceder a este recurso",
          requiresAuth: true,
          requiresAccess: false,
        },
      };
    }

    return {
      allowed: false,
      errorResponse: {
        status: "error",
        message: "No tienes permisos para acceder a este recurso",
        requiresAuth: true,
        requiresAccess: false,
        requiredPermissions,
        userPermissions: user.Role?.Permissions?.map((p: any) => p.name) || [],
      },
    };
  }

  // Verificar acceso al curso (pago, etc.)
  const accessCheck = await verifyCourseAccess(user, course);

  if (!accessCheck.hasAccess) {
    return {
      allowed: false,
      errorResponse: {
        status: "error",
        message: accessCheck.reason || "No tienes acceso a este recurso",
        requiresAuth: accessCheck.requiresAuth,
        requiresAccess: accessCheck.requiresAccess,
        courseId: course.id,
        courseTitle: course.title,
        coursePrice: parseFloat(course.price?.toString() || "0"),
      },
    };
  }

  return { allowed: true };
}
