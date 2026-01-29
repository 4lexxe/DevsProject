import api from '../../shared/api/axios';

export interface GrantAccessRequest {
  userId: number;
  courseId: number;
  expiresAt?: string; // ISO 8601 date string, opcional (null = permanente)
}

export interface CourseAccessResponse {
  id: number;
  accessToken: string;
  grantedAt: string;
  expiresAt: string | null;
  isPermanent: boolean;
  userId: number;
  courseId: number;
}

const COURSE_ACCESS_ENDPOINT = '/course-access';

/**
 * Otorga acceso a un curso para un usuario
 * @param data - Datos del acceso (userId, courseId, expiresAt opcional)
 * @returns Respuesta con los datos del acceso creado
 */
export const grantCourseAccess = async (data: GrantAccessRequest): Promise<CourseAccessResponse> => {
  try {
    const response = await api.post(`${COURSE_ACCESS_ENDPOINT}/grant`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error al otorgar acceso al curso:', error);
    throw error;
  }
};

/**
 * Revoca el acceso a un curso para un usuario
 * @param userId - ID del usuario
 * @param courseId - ID del curso
 * @param revokeReason - Razón de la revocación (opcional)
 */
export const revokeCourseAccess = async (
  userId: number,
  courseId: number,
  revokeReason?: string
): Promise<void> => {
  try {
    await api.put(`${COURSE_ACCESS_ENDPOINT}/${userId}/courses/${courseId}/revoke`, {
      revokeReason
    });
  } catch (error) {
    console.error('Error al revocar acceso al curso:', error);
    throw error;
  }
};
