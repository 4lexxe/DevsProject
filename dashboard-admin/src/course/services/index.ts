// Exportar servicios de cursos principales
export * from './courseServices';

// Exportar servicios de formularios con alias para evitar conflictos
export {
  getActiveCategories,
  getActiveCareerTypes,
  createFullCourse,
  editFullCourse,
  validateCourseForm,
  validateSectionForm,
  getCourseSections
} from './courseFormService';

// Exportar servicios de contenidos
export * from './contentServices';

// Exportar servicios de secciones (renombrar funciones conflictivas)
export {
  getSectionsByCourse,
  getAllSections,
  getSectionById as getSectionByIdComplete,
  createSection as createSectionComplete,
  updateSection,
  updateSectionWithContents,
  deleteSection as deleteSectionComplete,
  reorderSections,
  duplicateSection,
  getSectionCount,
  getSectionStats,
  toggleSectionStatus,
  getPopularSections
} from './sectionServices';

// Re-exportar tipos principales para fácil acceso
export type {
  Course,
  CourseInput,
  CourseFilters,
  CourseStats,
  Category,
  CareerType
} from './courseServices';

export type {
  CourseFormData,
  SectionFormData,
  ContentFormData,
  CategoryOption,
  CareerTypeOption
} from './courseFormService';

export type {
  Content,
  Section,
  Quiz,
  QuizQuestion,
  ContentNavigation
} from './contentServices';

export type {
  SectionWithContents,
  SectionInput,
  SectionFilters,
  SectionStats
} from './sectionServices';
