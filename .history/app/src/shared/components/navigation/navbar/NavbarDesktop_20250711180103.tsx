import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, LogIn, UserPlus, CreditCard, Bell, Search, Menu, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';
import NavLink from '../navbar/NavLink';
import AuthButton from '../../buttons/AuthButton';
import SearchBar from '../../searchBar/SearchBar';

export default function DesktopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-xl sticky top-0 left-0 w-full z-50"
    >
      {/* Gradient line at top */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="lg:mx-16 mx-2">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.img
                  src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                  alt="Dev's Project"
                  className="h-12 w-12 object-contain transition-transform duration-300 group-hover:rotate-12"
                  whileHover={{ rotate: 6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl -z-10"></div>
              </div>
              <div className="hidden sm:block">
                <motion.h1 
                  className="text-xl font-black bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  Dev's Project
                </motion.h1>
                <p className="text-xs text-gray-500 font-medium">Learn. Code. Build.</p>
              </div>
            </a>
          </motion.div>

          {/* Enhanced Search Bar */}
          <div className="flex-grow max-w-md mx-6 relative">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar cursos, recursos..."
                className="w-full pl-12 pr-16 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm placeholder-gray-500 hover:bg-white focus:bg-white shadow-sm hover:shadow-md focus:shadow-lg"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center space-x-2">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded font-mono border border-gray-300">⌘K</kbd>
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>

          {/* Enhanced Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/cursos">Cursos</NavLink>
            <NavLink href="/plans">
              <span className="flex items-center gap-1">
                Planes
                <Sparkles className="w-3 h-3 text-yellow-500" />
              </span>
            </NavLink>
            <NavLink href="/ruta-aprendizaje">Ruta de Aprendizaje</NavLink>
            <NavLink href="/recursos">Recursos</NavLink>
          </div>

          {/* Enhanced Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <UserMenu 
                user={user} 
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                profileMenuRef={profileMenuRef}
                handleLogout={handleLogout}
              />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

interface UserMenuProps {
  user: { name: string; avatar?: string };
  isProfileOpen: boolean;
  setIsProfileOpen: (isOpen: boolean) => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
  handleLogout: () => Promise<void>;
}

function UserMenu({ 
  user, 
  isProfileOpen, 
  setIsProfileOpen, 
  profileMenuRef, 
  handleLogout 
}: UserMenuProps) {
  return (
    <>
      {/* Enhanced Notification Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        <motion.div 
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-white font-bold">3</span>
        </motion.div>
      </motion.button>

      {/* Enhanced Profile Menu */}
      <div className="relative" ref={profileMenuRef}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-3 p-2 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 border-2 border-gradient-to-r border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md"
          />
          <span className="text-sm font-bold text-gray-800 hidden sm:block bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            {user.name}
          </span>
          <motion.div 
            className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-72 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/50 overflow-hidden"
            >
              {/* Enhanced Profile Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover border-3 border-white shadow-lg"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-gray-500 font-medium">Usuario activo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Menu Items */}
              <div className="py-3">
                <MenuLink href="/profile" icon={User}>
                  <span className="flex items-center justify-between w-full">
                    Mi Perfil
                    <Zap className="w-3 h-3 text-blue-500" />
                  </span>
                </MenuLink>
                <MenuLink href="/subscription" icon={CreditCard}>
                  <span className="flex items-center justify-between w-full">
                    Mi Suscripción
                    <span className="px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full font-bold">PRO</span>
                  </span>
                </MenuLink>
                <MenuLink href="/settings" icon={Settings}>Configuración</MenuLink>
                
                <div className="my-3 border-t border-gray-100"></div>
                
                <motion.button
                  whileHover={{ x: 4, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                  onClick={handleLogout}
                  className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:text-red-700 transition-all duration-200 font-medium"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Cerrar sesión
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

interface MenuLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function MenuLink({ href, icon: Icon, children }: MenuLinkProps) {
  return (
    <motion.a
      whileHover={{ x: 4, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
      href={href}
      className="flex items-center px-6 py-3 text-sm text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium"
    >
      <Icon className="mr-3 h-4 w-4 text-blue-500" />
      {children}
    </motion.a>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
        <AuthButton 
          variant="secondary" 
          href="/login"
          className="flex items-center space-x-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-semibold shadow-sm hover:shadow-md"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:block">Iniciar Sesión</span>
        </AuthButton>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
        <AuthButton 
          variant="primary" 
          href="/register"
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold border-2 border-transparent hover:border-white/20"
        >
          <UserPlus className="h-4 w-4" />
          <span>Registrarse</span>
          <Sparkles className="h-3 w-3" />
        </AuthButton>
      </motion.div>
    </div>
  );
}