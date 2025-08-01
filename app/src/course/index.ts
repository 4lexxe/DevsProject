// Exportar componentes y páginas
export { default as SearchResultsPage } from './pages/SearchResultsPage';
export { default as CoursesPage } from './pages/CoursesPage';
export { default as CourseDetail } from './pages/courseDetail';
export { default as QuizPage } from './pages/QuizPage';
export { default as Profile } from '../user/components/profile/Profile';
export { default as ContentPage } from './pages/ContentPage';
export { default as CoursesList } from './components/courses/CoursesList';

// Exportar servicios
export { CourseSearchService } from './services/searchService';

// Exportar tipos
export type { SearchOptions, SearchResult, PaginationInfo } from './services/searchService';