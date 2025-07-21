# Implementation Plan

- [x] 1. Set up proper import paths and dependency resolution





  - Update tsconfig.app.json to include proper path mappings for shared utilities
  - Create barrel export files (index.ts) in course module directories
  - Fix import statements in copied components to use dashboard-specific paths
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 2. Create dashboard-specific course service adapter
  - Implement DashboardCourseService class with proper API endpoints
  - Configure base URL and authentication for dashboard environment
  - Add error handling and response transformation methods
  - Create service methods for getCourse, updateCourse, createCourse, getCategories, getCareerTypes
  - _Requirements: 3.2, 4.1, 4.2_

- [ ] 3. Establish shared type definitions and interfaces
  - Create or update ICourse interface to match server model
  - Define CourseFormData interface for form handling
  - Add Category and CareerType interfaces
  - Export all types through course module index file
  - _Requirements: 3.4, 4.3_

- [ ] 4. Adapt CourseForm component for dashboard environment
  - Update import statements to use dashboard paths
  - Integrate with dashboard-specific course service
  - Apply dashboard styling and theme consistency
  - Fix any TypeScript compilation errors
  - Add proper prop types and validation
  - _Requirements: 2.1, 2.2, 3.1, 3.3_

- [ ] 5. Create CourseViewPage component
  - Implement component to display course details in read-only mode
  - Add course data fetching with loading and error states
  - Format course information display (title, image, summary, about, outcomes, prerequisites)
  - Show course status indicators (active/inactive, in development)
  - Display category and career type relationships
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 6. Create CourseEditPage component
  - Implement component that wraps CourseForm for editing
  - Add course data pre-population for existing courses
  - Handle form submission with success/error feedback
  - Implement navigation back to course list after save
  - Add form validation and error display
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 7. Integrate course pages with dashboard routing
  - Add routes for course view and edit pages
  - Update course list component to include view/edit action buttons
  - Implement proper navigation between course list and detail pages
  - Ensure routing maintains course list state when returning
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 8. Fix category and career type data loading
  - Implement API calls to fetch categories and career types
  - Add dropdown/select components for category and career type selection
  - Handle loading states and fallback options for failed requests
  - Ensure proper data association when saving course changes
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 9. Add comprehensive error handling and user feedback
  - Implement error boundaries for course components
  - Add toast notifications for success/error messages
  - Create loading spinners and skeleton components
  - Handle API errors with user-friendly messages
  - Add form validation with specific field error messages
  - _Requirements: 2.4, 2.5, 3.1, 4.4_

- [ ] 10. Update course list integration with new functionality
  - Modify course list to properly integrate with view/edit actions
  - Ensure course list refreshes after successful edits
  - Add filtering and search functionality that maintains view/edit capabilities
  - Implement proper state management for course list updates
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 11. Create unit tests for course components and services
  - Write tests for CourseViewPage component rendering and data display
  - Write tests for CourseEditPage component form handling
  - Write tests for DashboardCourseService API methods
  - Write tests for CourseForm component validation and submission
  - Add tests for error handling scenarios
  - _Requirements: 2.2, 2.3, 3.1, 3.2_

- [ ] 12. Optimize performance and finalize integration
  - Implement React Query for efficient data caching
  - Add code splitting for course-related components
  - Optimize bundle size by removing unused dependencies
  - Ensure consistent styling across all course components
  - Perform final testing of complete view/edit workflow
  - _Requirements: 1.1, 2.1, 3.3, 5.4_