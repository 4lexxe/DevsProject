import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Inicio'x;
    case '/cursos':
      return 'Cursos';
    case '/ruta-aprendizaje':
      return 'Ruta de Aprendizaje';
    case '/recursos':
      return 'Recursos';
    default:
      return 'Inicio';
  }
};

export default function TopNavbar() {
  const location = useLocation();
  const { user } = useAuth(); // Obtener el estado del usuario desde el contexto de autenticación
  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md h-20 z-50">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Logo y título */}
        <div className="flex items-center space-x-3">
          <img
            src="https://i.ibb.co/dQ09SsH/logoDev2.png"
            alt="Dev's Project"
            className="h-16 w-16 object-contain"
          />
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
  
        {/* Botones de búsqueda y notificaciones */}
        <div className="flex items-center space-x-6">
          <button className="p-3 hover:bg-gray-100 rounded-full">
            <Search className="h-7 w-7 text-gray-600" />
          </button>
          {user && (
            <button className="p-3 hover:bg-gray-100 rounded-full relative">
              <Bell className="h-7 w-7 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                3
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}