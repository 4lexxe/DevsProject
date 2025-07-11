import { Search, Bell, Menu, Sparkles } from 'lucide-react';
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
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl h-16 z-50 border-b border-gray-200/50"
    >
      {/* Gradient line at top */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-center justify-between px-4 h-full">
        {/* Enhanced Logo y título */}
        <div className="flex items-center space-x-3">
          <motion.img
            whileHover={{ rotate: 12, scale: 1.1 }}
            src="https://i.ibb.co/dQ09SsH/logoDev2.png"
            alt="Dev's Project"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              {pageTitle}
            </h1>
            <p className="text-xs text-gray-500 font-medium">Dev's Project</p>
          </div>
        </div>
  
        {/* Enhanced Botones */}
        <div className="flex items-center space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </motion.button>
          
          {user && (
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white shadow-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                3
              </motion.span>
            </motion.button>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}