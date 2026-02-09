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
 * Genera la URL de una sección usando courseSlug y sectionSlug
 * @param section - Objeto de la sección con slug, id y course (con slug)
 * @returns URL de la sección en formato /section/:courseSlug/:sectionSlug
 */
export function getSectionUrl(section: { 
  slug?: string; 
  id: number | string;
  course?: { slug?: string; id?: number | string };
}): string {
  const courseSlug = section.course?.slug || section.course?.id || '';
  const sectionSlug = section.slug || section.id;
  
  if (courseSlug && sectionSlug) {
    return `/section/${courseSlug}/${sectionSlug}`;
  }
  
  // Fallback a formato antiguo si no hay curso
  if (section.slug) {
    return `/sections/${section.slug}`;
  }
  return `/sections/${section.id}`;
}

/**
 * Genera la URL de una sección usando courseSlug y sectionSlug
 * @param courseSlug - Slug del curso (preferido) o ID
 * @param sectionSlug - Slug de la sección (preferido) o ID
 * @returns URL de la sección
 */
export function getSectionUrlFromSlugOrId(
  courseSlug?: string | number, 
  sectionSlug?: string | number
): string {
  if (courseSlug && sectionSlug) {
    return `/section/${courseSlug}/${sectionSlug}`;
  }
  return '/sections';
}

/**
 * Genera la URL de un contenido usando courseSlug, sectionSlug y contentSlug
 * @param courseSlug - Slug del curso (preferido) o ID
 * @param sectionSlug - Slug de la sección (preferido) o ID
 * @param contentSlug - Slug del contenido (preferido) o ID
 * @returns URL del contenido en formato /course/:courseSlug/section/:sectionSlug/content/:contentSlug
 */
export function getContentUrl(
  courseSlug?: string | number,
  sectionSlug?: string | number,
  contentSlug?: string | number
): string {
  if (courseSlug && sectionSlug && contentSlug) {
    return `/course/${courseSlug}/section/${sectionSlug}/content/${contentSlug}`;
  }
  // Fallback a formato antiguo si falta algún slug
  if (courseSlug && contentSlug) {
    return `/course/${courseSlug}/section/content/${contentSlug}`;
  }
  return '/courses';
}
