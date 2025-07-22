# Implementation Plan - Student Management

## Current Focus: Fix Student Management Functionality

- [x] 1. Fix "Ver" (View) functionality for students




  - Ensure StudentProfilePage component loads correctly
  - Fix routing to `/dashboard/students/:id`
  - Test user profile data display
  - Handle loading and error states properly

- [x] 2. Fix "Editar" (Edit) functionality for students  











  - Ensure StudentEditPage component loads correctly
  - Fix routing to `/dashboard/students/:id/edit`
  - Test form pre-population with user data
  - Ensure form submission works and updates user

- [ ] 3. Fix "Activar/Desactivar Usuario" (Activate/Deactivate) functionality
  - Test activateUser and deactivateUser API calls
  - Ensure proper error handling and user feedback
  - Verify query invalidation refreshes the user list
  - Test confirmation dialogs work properly

- [ ] 4. Fix "Eliminar Usuario" (Delete User) functionality
  - Test deleteUser API call
  - Ensure proper error handling and user feedback  
  - Verify query invalidation refreshes the user list
  - Test confirmation dialog works properly

- [ ] 5. Debug API endpoint issues
  - Check if user service endpoints are working
  - Test authentication and authorization
  - Verify server-side user management routes
  - Add proper error logging and debugging

## Previous Course Integration Work (Completed)

- [x] 1. Set up proper import paths and dependency resolution
  - Update tsconfig.app.json to include proper path mappings for shared utilities
  - Create barrel export files (index.ts) in course module directories
  - Fix import statements in copied components to use dashboard-specific paths

- [x] 2. Create dashboard-specific course service adapter (Partially Complete)
  - Implement DashboardCourseService class with proper API endpoints
  - Configure base URL and authentication for dashboard environment
  - Add error handling and response transformation methods
  - Create service methods for getCourse, updateCourse, createCourse, getCategories, getCareerTypes

- [ ] 3. Establish shared type definitions and interfaces
  - Create or update ICourse interface to match server model
  - Define CourseFormData interface for form handling
  - Add Category and CareerType interfaces
  - Export all types through course module index file

- [ ] 4. Adapt CourseForm component for dashboard environment
  - Update import statements to use dashboard paths
  - Integrate with dashboard-specific course service
  - Apply dashboard styling and theme consistency
  - Fix any TypeScript compilation errors
  - Add proper prop types and validation

- [ ] 5. Create CourseViewPage component
  - Implement component to display course details in read-only mode
  - Add course data fetching with loading and error states
  - Format course information display (title, image, summary, about, outcomes, prerequisites)
  - Show course status indicators (active/inactive, in development)
  - Display category and career type relationships

- [ ] 6. Create CourseEditPage component
  - Implement component that wraps CourseForm for editing
  - Add course data pre-population for existing courses
  - Handle form submission with success/error feedback
  - Implement navigation back to course list after save
  - Add form validation and error display

- [ ] 7. Integrate course pages with dashboard routing
  - Add routes for course view and edit pages
  - Update course list component to include view/edit action buttons
  - Implement proper navigation between course list and detail pages
  - Ensure routing maintains course list state when returning

- [ ] 8. Fix category and career type data loading
  - Implement API calls to fetch categories and career types
  - Add dropdown/select components for category and career type selection
  - Handle loading states and fallback options for failed requests
  - Ensure proper data association when saving course changes

- [ ] 9. Add comprehensive error handling and user feedback
  - Implement error boundaries for course components
  - Add toast notifications for success/error messages
  - Create loading spinners and skeleton components
  - Handle API errors with user-friendly messages
  - Add form validation with specific field error messages

- [ ] 10. Update course list integration with new functionality
  - Modify course list to properly integrate with view/edit actions
  - Ensure course list refreshes after successful edits
  - Add filtering and search functionality that maintains view/edit capabilities
  - Implement proper state management for course list updates

- [ ] 11. Create unit tests for course components and services
  - Write tests for CourseViewPage component rendering and data display
  - Write tests for CourseEditPage component form handling
  - Write tests for DashboardCourseService API methods
  - Write tests for CourseForm component validation and submission
  - Add tests for error handling scenarios

- [ ] 12. Optimize performance and finalize integration
  - Implement React Query for efficient data caching
  - Add code splitting for course-related components
  - Optimize bundle size by removing unused dependencies
  - Ensure consistent styling across all course components
  - Perform final testing of complete view/edit workflow