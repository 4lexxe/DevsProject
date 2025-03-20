import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PermissionProtectedRoute from '../routes/PermissionProtectedRoute';

// Permisos básicos para acceder al dashboard (basados en permisos reales del backend)
const DASHBOARD_BASE_PERMISSIONS = ['admin:manage_all', 'view:analytics', 'superadmin:full_access'];

const DashboardLayout: React.FC = () => {
  return (
    <PermissionProtectedRoute requiredPermissions={DASHBOARD_BASE_PERMISSIONS}>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </PermissionProtectedRoute>
  );
};

export default DashboardLayout; 