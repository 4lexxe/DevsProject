import React from 'react';
import { useAuth } from '@/user/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Settings, Mail, Key, Calendar, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout, loading } = useAuth();
  if (user) {
    console.log(user.email);
    console.log(user.displayName);
    console.log('el id del usuario es',user.id);
  }
  if (loading) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se verifica la autenticación
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Información del Perfil */}
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
                />
                {user.isActiveSession && (
                  <span className="absolute bottom-2 right-2 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></span>
                )}
              </div>
              
              <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left flex-grow">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">@{user.username}</p>
                <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user.role?.name || 'Usuario'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {user.authProvider}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </button>
            </div>

            {/* Detalles del Usuario */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="h-6 w-6 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Correo electrónico</p>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <User className="h-6 w-6 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Nombre para mostrar</p>
                  <p className="text-sm text-gray-900">{user.displayName || user.name}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Última actividad</p>
                  <p className="text-sm text-gray-900">
                    {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 text-gray-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Autenticación</p>
                  <p className="text-sm text-gray-900 capitalize">{user.authProvider}</p>
                </div>
              </div>
            </div>

            {/* Sección de Configuración */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Configuración de la cuenta</h2>
              <div className="mt-4 space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Settings className="h-6 w-6 text-gray-400" />
                    <span className="ml-4 text-sm font-medium text-gray-900">Editar perfil</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Key className="h-6 w-6 text-gray-400" />
                    <span className="ml-4 text-sm font-medium text-gray-900">Cambiar contraseña</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;