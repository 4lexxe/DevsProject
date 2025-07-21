# Requirements Document

## Introduction

The dashboard-admin application needs to properly display and manage courses with "View" and "Edit" functionality. Currently, course components have been copied from the main app but are not functioning correctly due to missing dependencies, incompatible imports, and different project structures between the dashboard-admin and main app environments.

## Requirements

### Requirement 1

**User Story:** As an admin user, I want to view course details in the dashboard-admin, so that I can review course information without switching to the main application.

#### Acceptance Criteria

1. WHEN an admin clicks "Ver" (View) on a course THEN the system SHALL display the complete course information including title, image, summary, about, learning outcomes, and prerequisites
2. WHEN the course view loads THEN the system SHALL show the course status (active/inactive, in development)
3. WHEN displaying course information THEN the system SHALL format the data consistently with the main app's presentation
4. IF a course has associated categories or career types THEN the system SHALL display this relationship information

### Requirement 2

**User Story:** As an admin user, I want to edit course information through the dashboard-admin, so that I can manage course content efficiently from the admin interface.

#### Acceptance Criteria

1. WHEN an admin clicks "Editar" (Edit) on a course THEN the system SHALL open the CourseForm component with pre-populated course data
2. WHEN editing a course THEN the system SHALL validate all required fields before allowing submission
3. WHEN a course is successfully updated THEN the system SHALL show a success message and refresh the course list
4. IF validation fails THEN the system SHALL display specific error messages for each invalid field
5. WHEN form submission fails THEN the system SHALL display appropriate error messages without losing user input

### Requirement 3

**User Story:** As an admin user, I want the course components to work seamlessly within the dashboard-admin environment, so that there are no technical errors or missing functionality.

#### Acceptance Criteria

1. WHEN course components load THEN the system SHALL resolve all import dependencies correctly
2. WHEN using course services THEN the system SHALL connect to the correct API endpoints for the dashboard environment
3. WHEN components render THEN the system SHALL apply consistent styling with the dashboard-admin theme
4. IF there are TypeScript errors THEN the system SHALL compile without type conflicts
5. WHEN using shared utilities THEN the system SHALL access them through proper import paths

### Requirement 4

**User Story:** As an admin user, I want course categories and career types to be properly loaded and displayed, so that I can manage course classifications effectively.

#### Acceptance Criteria

1. WHEN the course form loads THEN the system SHALL fetch and display available categories
2. WHEN the course form loads THEN the system SHALL fetch and display available career types
3. WHEN selecting categories or career types THEN the system SHALL update the course data accordingly
4. IF category or career type data fails to load THEN the system SHALL display appropriate fallback options
5. WHEN saving course changes THEN the system SHALL properly associate selected categories and career types

### Requirement 5

**User Story:** As an admin user, I want the course list to integrate properly with view and edit actions, so that I can efficiently manage multiple courses.

#### Acceptance Criteria

1. WHEN the course list loads THEN the system SHALL display all courses with their basic information
2. WHEN clicking action buttons THEN the system SHALL properly route to view or edit modes
3. WHEN returning from view/edit modes THEN the system SHALL maintain the course list state
4. IF course data changes THEN the system SHALL reflect updates in the course list immediately
5. WHEN filtering or searching courses THEN the system SHALL maintain view/edit functionality for filtered results