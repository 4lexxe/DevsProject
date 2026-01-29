/**
 * Genera la URL de un curso usando su slug o id como fallback
 * @param course - Objeto del curso con slug e id
 * @returns URL del curso
 */
export function getCourseUrl(course: { slug?: string; id: number | string }): string {
  if (course.slug) {
    return `/course/${course.slug}`;
  }
  return `/course/${course.id}`;
}

/**
 * Genera la URL de un curso usando slug o id
 * @param slug - Slug del curso (preferido)
 * @param id - ID del curso (fallback)
 * @returns URL del curso
 */
export function getCourseUrlFromSlugOrId(slug?: string, id?: number | string): string {
  if (slug) {
    return `/course/${slug}`;
  }
  if (id) {
    return `/course/${id}`;
  }
  return '/cursos';
}

/**
 * Genera la URL de una sección usando su slug o id como fallback
 * @param section - Objeto de la sección con slug e id
 * @returns URL de la sección
 */
export function getSectionUrl(section: { slug?: string; id: number | string }): string {
  if (section.slug) {
    return `/sections/${section.slug}`;
  }
  return `/sections/${section.id}`;
}

/**
 * Genera la URL de una sección usando slug o id
 * @param slug - Slug de la sección (preferido)
 * @param id - ID de la sección (fallback)
 * @returns URL de la sección
 */
export function getSectionUrlFromSlugOrId(slug?: string, id?: number | string): string {
  if (slug) {
    return `/sections/${slug}`;
  }
  if (id) {
    return `/sections/${id}`;
  }
  return '/sections';
}
