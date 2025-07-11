import { Search, Bell, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Inicio';
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
  const { user } = useAuth();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg h-16 z-50 border-b border-gray-200/50"
    >
      <div className="flex items-center justify-between px-4 h-full">
        {/* Logo y título */}
        <div className="flex items-center space-x-3">
          <motion.img
            whileHover={{ rotate: 6, scale: 1.1 }}
            src="https://i.ibb.co/dQ09SsH/logoDev2.png"
            alt="Dev's Project"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1>
            <p className="text-xs text-gray-500">Dev's Project</p>
          </div>
        </div>
  
        {/* Botones de búsqueda y notificaciones */}
        <div className="flex items-center space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </motion.button>
          
          {user && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                3
              </motion.span>
            </motion.button>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-200"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}