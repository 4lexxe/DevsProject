
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PermissionsPage from '../pages/PermissionsPage';
// Importa otros componentes de páginas

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Otras rutas */}
      <Route path="/permissions" element={<PermissionsPage />} />
      {/* Más rutas */}
    </Routes>
  );
};

export default AppRoutes;