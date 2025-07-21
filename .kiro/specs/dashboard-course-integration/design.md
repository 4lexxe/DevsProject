# Design Document

## Overview

This design addresses the integration of course management functionality within the dashboard-admin application. The solution focuses on adapting the copied course components from the main app to work seamlessly within the dashboard environment, resolving import dependencies, API endpoint configurations, and ensuring consistent styling and functionality.

## Architecture

### Component Architecture
The course integration follows a modular architecture with clear separation of concerns:

```
dashboard-admin/src/course/
├── components/
│   ├── Forms/           # Course creation and editing forms
│   ├── courses/         # Course display and list components  
│   └── shared/          # Reusable course-related components
├── services/            # API communication layer
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks for course operations
└── utils/              # Course-specific utility functions
```

### Integration Points
1. **API Layer**: Centralized service layer that handles all course-related API calls
2. **Type System**: Shared TypeScript interfaces between dashboard and main app
3. **Component Bridge**: Adapter components that bridge main app components to dashboard context
4. **Routing Integration**: Course routes integrated into dashboard routing system

## Components and Interfaces

### Core Components

#### CourseViewPage
- **Purpose**: Display detailed course information in read-only mode
- **Props**: `{ courseId: string }`
- **Dependencies**: CourseService, course types
- **Key Features**: 
  - Fetches course data on mount
  - Displays course metadata, content, and relationships
  - Handles loading and error states

#### CourseEditPage  
- **Purpose**: Provide course editing interface
- **Props**: `{ courseId?: string }` (optional for new course creation)
- **Dependencies**: CourseForm, validation schemas, CourseService
- **Key Features**:
  - Pre-populates form for existing courses
  - Handles form submission and validation
  - Manages success/error feedback

#### CourseForm (Adapted)
- **Purpose**: Reusable form component for course creation/editing
- **Props**: `{ course?: ICourse, onSubmit: (data: CourseFormData) => void }`
- **Adaptations**:
  - Updated import paths for dashboard environment
  - Modified API service calls to use dashboard endpoints
  - Integrated with dashboard styling system

#### CourseListIntegration
- **Purpose**: Enhanced course list with view/edit actions
- **Props**: `{ courses: Course[], onView: (id) => void, onEdit: (id) => void }`
- **Features**:
  - Action buttons for view/edit operations
  - Consistent styling with dashboard theme
  - Proper routing integration

### Service Layer

#### CourseService (Dashboard Adapter)
```typescript
class DashboardCourseService {
  private baseURL = '/api/dashboard/courses';
  
  async getCourse(id: string): Promise<Course>
  async updateCourse(id: string, data: CourseFormData): Promise<Course>
  async createCourse(data: CourseFormData): Promise<Course>
  async getCategories(): Promise<Category[]>
  async getCareerTypes(): Promise<CareerType[]>
}
```

#### API Configuration
- **Base URL**: Configurable through environment variables
- **Authentication**: Integrated with dashboard auth system
- **Error Handling**: Consistent error handling with dashboard patterns

### Type Definitions

#### Shared Types
```typescript
interface ICourse {
  id: bigint;
  title: string;
  image: string;
  summary: string;
  about: string;
  careerTypeId?: bigint;
  learningOutcomes: string[];
  prerequisites?: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: bigint;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseFormData {
  title: string;
  image: string;
  summary: string;
  about: string;
  careerTypeId?: bigint;
  learningOutcomes: string[];
  prerequisites: string[];
  isActive: boolean;
  isInDevelopment: boolean;
}
```

## Data Models

### Course Data Flow
1. **Fetch**: CourseService retrieves course data from API
2. **Transform**: Data transformed to match component expectations
3. **Display**: Components render data with proper formatting
4. **Edit**: Form components handle data mutations
5. **Persist**: Service layer sends updates to API

### State Management
- **Local State**: Component-level state for form data and UI state
- **Query Cache**: React Query for server state management
- **Error State**: Centralized error handling and display

## Error Handling

### Import Resolution Errors
- **Strategy**: Create barrel exports and path mapping
- **Implementation**: Update tsconfig paths and create index files
- **Fallbacks**: Provide default implementations for missing dependencies

### API Integration Errors
- **Strategy**: Centralized error handling with user-friendly messages
- **Implementation**: Error boundary components and toast notifications
- **Recovery**: Retry mechanisms and graceful degradation

### Type Conflicts
- **Strategy**: Shared type definitions and strict TypeScript configuration
- **Implementation**: Common types package or shared interfaces
- **Validation**: Runtime type checking for critical data

## Testing Strategy

### Unit Testing
- **Components**: Test rendering, props handling, and user interactions
- **Services**: Test API calls, data transformation, and error handling
- **Utilities**: Test helper functions and data processing

### Integration Testing
- **Form Flow**: Test complete create/edit workflows
- **Navigation**: Test routing between view/edit modes
- **API Integration**: Test service layer with mock API responses

### End-to-End Testing
- **User Workflows**: Test complete user journeys for course management
- **Cross-Component**: Test interactions between course list and forms
- **Error Scenarios**: Test error handling and recovery flows

## Implementation Phases

### Phase 1: Foundation
- Set up proper import paths and dependencies
- Create dashboard-specific service adapters
- Establish shared type definitions

### Phase 2: Component Integration
- Adapt CourseForm for dashboard environment
- Create CourseViewPage and CourseEditPage
- Integrate with dashboard routing

### Phase 3: Enhanced Functionality
- Add proper error handling and loading states
- Implement form validation and feedback
- Optimize performance and user experience

### Phase 4: Polish and Testing
- Add comprehensive testing coverage
- Refine styling and user interface
- Performance optimization and bug fixes