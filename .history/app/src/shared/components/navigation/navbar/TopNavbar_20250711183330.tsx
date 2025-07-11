import { Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Inicio';
    case '/cursos':
      return 'Cursos';
    case '/ruta-aprendizaje':
      return 'Ruta';
    case '/recursos':
      return 'Recursos';
    default:
      return 'Dev\'s';
  }
};

export default function TopNavbar() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 h-14 z-50">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Logo minimalista */}
        <div className="flex items-center space-x-2">
          <img
            src="https://i.ibb.co/dQ09SsH/logoDev2.png"
            alt="Dev's Project"
            className="h-6 w-6 object-contain"
          />
          <h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1>
        </div>
  
        {/* Botones mínimos */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}