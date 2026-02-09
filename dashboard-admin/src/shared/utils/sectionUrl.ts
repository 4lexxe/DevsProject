/**
 * Genera la URL de una sección usando courseSlug y sectionSlug
 * @param section - Objeto de la sección con slug, id y course (con slug)
 * @returns URL de la sección en formato /courses/:courseSlug/section/:sectionSlug
 */
export function getSectionUrl(section: { 
  slug?: string; 
  id: number | string;
  course?: { slug?: string; id?: number | string };
  courseId?: string | number;
}): string {
  const courseSlug = section.course?.slug || section.course?.id || section.courseId || '';
  const sectionSlug = section.slug || section.id;
  
  if (courseSlug && sectionSlug) {
    return `/courses/${courseSlug}/section/${sectionSlug}`;
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
    return `/courses/${courseSlug}/section/${sectionSlug}`;
  }
  return '/courses';
}
