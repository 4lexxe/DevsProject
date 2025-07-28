# Design Document

## Overview

Este diseño se enfoca en adaptar la funcionalidad existente de header-section del app al dashboard-admin. La mayoría de los componentes ya están implementados en el app, por lo que el trabajo principal consiste en migrar y adaptar estos componentes al contexto del dashboard administrativo, manteniendo la funcionalidad existente pero integrándola con el sistema de autenticación y navegación del dashboard.

## Architecture

### Current State Analysis
- **Backend**: Ya implementado con rutas CRUD completas en `/server/src/modules/headerSection/`
- **Services**: Ya implementados en ambos proyectos (`app` y `dashboard-admin`)
- **Components**: Implementados completamente en `app/src/home/components/admin/`
- **Missing**: Componentes UI en dashboard-admin y integración con la navegación

### Target Architecture
```
dashboard-admin/
├── src/
│   ├── home/
│   │   ├── components/
│   │   │   └── admin/           # Componentes migrados desde app
│   │   │       ├── HeaderSectionCRUD.tsx
│   │   │       ├── HeaderSectionForm.tsx
│   │   │       ├── HeaderSectionList.tsx
│   │   │       ├── HeaderSectionPreview.tsx
│   │   │       └── InputFile.tsx
│   │   ├── pages/
│   │   │   └── admin/
│   │   │       └── HeaderSectionAdminPage.tsx
│   │   └── services/
│   │       └── headerSectionServices.ts  # Ya existe, necesita tipos
```

## Components and Interfaces

### 1. HeaderSection Interface
```typescript
export interface HeaderSection {
  id?: string;
  image: string;
  title: string;
  slogan: string;
  about: string;
  buttonName: string;
  buttonLink: string;
  adminId: number;
}
```

### 2. Component Adaptations Required

#### HeaderSectionCRUD Component
- **Source**: `app/src/home/components/admin/HeaderSectionCRUD.tsx`
- **Adaptations needed**:
  - Cambiar imports de servicios y contextos
  - Adaptar el contexto de autenticación del dashboard
  - Mantener toda la lógica de estado y funcionalidad

#### HeaderSectionForm Component
- **Source**: `app/src/home/components/admin/HeaderSectionForm.tsx`
- **Adaptations needed**:
  - Adaptar imports de componentes compartidos
  - Mantener toda la validación y lógica de formulario

#### HeaderSectionList Component
- **Source**: `app/src/home/components/admin/HeaderSectionList.tsx`
- **Adaptations needed**:
  - Adaptar estilos para consistencia con dashboard
  - Mantener funcionalidad de listado y acciones

#### HeaderSectionPreview Component
- **Source**: `app/src/home/components/admin/HeaderSectionPreview.tsx`
- **Adaptations needed**:
  - Mantener funcionalidad de vista previa
  - Adaptar estilos si es necesario

#### InputFile Component
- **Source**: `app/src/home/components/admin/InputFile.tsx`
- **Adaptations needed**:
  - Migrar componente de carga de archivos
  - Mantener funcionalidad existente

### 3. Page Integration

#### HeaderSectionAdminPage
- **Source**: `app/src/home/pages/admin/HeaderSectionAdminPage.tsx`
- **Adaptations needed**:
  - Adaptar layout para dashboard-admin
  - Integrar con navegación del dashboard
  - Mantener estructura y funcionalidad

## Data Models

### HeaderSection Model
```typescript
interface HeaderSection {
  id?: string;           // ID único de la sección
  image: string;         // URL de la imagen de fondo
  title: string;         // Título principal
  slogan: string;        // Slogan secundario
  about: string;         // Descripción de la sección
  buttonName: string;    // Texto del botón de acción
  buttonLink: string;    // URL del enlace del botón
  adminId: number;       // ID del administrador que creó/editó
}
```

### Service Interface
```typescript
interface HeaderSectionService {
  getHeaderSections(): Promise<HeaderSection[]>;
  getHeaderSectionById(id: string): Promise<HeaderSection>;
  createHeaderSection(data: HeaderSection): Promise<HeaderSection>;
  updateHeaderSection(id: string, data: HeaderSection): Promise<HeaderSection>;
  deleteHeaderSection(id: string): Promise<void>;
}
```

## Error Handling

### Client-Side Error Handling
- **Form Validation**: Mantener validación existente de campos requeridos
- **API Errors**: Mostrar mensajes de error específicos para operaciones CRUD
- **Authentication**: Verificar autenticación antes de permitir operaciones
- **Network Errors**: Manejar errores de conectividad con mensajes apropiados

### Error States
```typescript
interface ErrorState {
  message: string;
  type: 'validation' | 'network' | 'auth' | 'server';
  field?: string; // Para errores de validación específicos
}
```

## Testing Strategy

### Component Testing
- **Unit Tests**: Probar cada componente individualmente
- **Integration Tests**: Probar interacción entre componentes
- **Form Validation**: Probar todos los casos de validación
- **API Integration**: Probar llamadas a servicios

### Test Cases Priority
1. **HeaderSectionCRUD**: Operaciones CRUD completas
2. **HeaderSectionForm**: Validación y envío de formularios
3. **Authentication**: Verificar acceso solo para administradores
4. **Responsive Design**: Probar en diferentes tamaños de pantalla

## Migration Strategy

### Phase 1: Component Migration
1. Copiar componentes desde app a dashboard-admin
2. Actualizar imports y dependencias
3. Adaptar contexto de autenticación

### Phase 2: Service Integration
1. Actualizar headerSectionServices.ts con tipos TypeScript
2. Verificar integración con API existente
3. Probar operaciones CRUD

### Phase 3: Page Integration
1. Crear HeaderSectionAdminPage en dashboard-admin
2. Integrar con navegación del dashboard
3. Probar flujo completo de usuario

### Phase 4: Testing & Refinement
1. Probar funcionalidad completa
2. Ajustar estilos para consistencia
3. Optimizar rendimiento si es necesario

## Security Considerations

- **Authentication**: Verificar que solo administradores autenticados puedan acceder
- **Authorization**: Validar permisos antes de operaciones CRUD
- **Input Validation**: Mantener validación tanto en cliente como servidor
- **File Upload**: Validar tipos y tamaños de archivos de imagen