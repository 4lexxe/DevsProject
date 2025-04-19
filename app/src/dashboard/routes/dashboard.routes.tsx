import React from 'react';
import { Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import PermissionsPage from '../pages/permissions/PermissionsPage';
import PermissionProtectedRoute from './PermissionProtectedRoute';

// Definir los permisos requeridos para cada ruta
export const DASHBOARD_PERMISSIONS = {
  DASHBOARD: ['view:analytics', 'superadmin:full_access'], // Permisos para acceder al dashboard principal
  PERMISSIONS: ['manage:permissions', 'manage:roles', 'superadmin:full_access'] // Permisos para gestionar permisos y roles
};

export const dashboardRoutes = [
  {
    path: '',
    element: <DashboardPage />,
    requiredPermissions: DASHBOARD_PERMISSIONS.DASHBOARD
  },
  {
    path: 'permissions',
    element: (
      <PermissionProtectedRoute requiredPermissions={DASHBOARD_PERMISSIONS.PERMISSIONS}>
        <PermissionsPage />
      </PermissionProtectedRoute>
    ),
    requiredPermissions: [] // No es necesario aquí porque ya se verifica en el componente
  },
  // Aquí puedes agregar más rutas del dashboard
];

export const renderDashboardRoutes = () => {
  return dashboardRoutes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element} />
  ));
}; 