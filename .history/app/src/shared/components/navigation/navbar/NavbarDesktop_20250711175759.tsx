import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Settings, LogIn, UserPlus, CreditCard, Bell, Search, Menu } from 'lucide-react';
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
      className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg sticky top-0 left-0 w-full z-50"
    >
      <div className="lg:mx-16 mx-2">
        <div className="flex items-center justify-between h-20">
          {/* Logo mejorado */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                  alt="Dev's Project"
                  className="h-12 w-12 object-contain transition-transform duration-300 group-hover:rotate-6"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                  Dev's Project
                </h1>
                <p className="text-xs text-gray-500">Learn. Code. Build.</p>
              </div>
            </a>
          </motion.div>

          {/* Search bar mejorada */}
          <div className="flex-grow max-w-md mx-6 relative">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar cursos, recursos..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm placeholder-gray-500 hover:bg-white focus:bg-white"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded font-mono">⌘K</kbd>
              </div>
            </motion.div>
          </div>

          {/* Navigation links mejorados */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/cursos">Cursos</NavLink>
            <NavLink href="/plans">Planes</NavLink>
            <NavLink href="/ruta-aprendizaje">Ruta de Aprendizaje</NavLink>
            <NavLink href="/recursos">Recursos</NavLink>
          </div>

          {/* Auth section mejorada */}
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
      {/* Notification Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">3</span>
        </div>
      </motion.button>

      {/* Profile Menu */}
      <div className="relative" ref={profileMenuRef}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-3 p-2 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200/50 transition-all duration-200"
        >
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <span className="text-sm font-semibold text-gray-800 hidden sm:block">{user.name}</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </motion.button>

        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 rounded-2xl shadow-xl bg-white border border-gray-200/50 backdrop-blur-lg overflow-hidden"
          >
            {/* Profile Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">Usuario activo</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <MenuLink href="/profile" icon={User}>Mi Perfil</MenuLink>
              <MenuLink href="/subscription" icon={CreditCard}>Mi Suscripción</MenuLink>
              <MenuLink href="/settings" icon={Settings}>Configuración</MenuLink>
              
              <div className="my-2 border-t border-gray-100"></div>
              
              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Cerrar sesión
              </motion.button>
            </div>
          </motion.div>
        )}
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
      whileHover={{ x: 4 }}
      href={href}
      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
    >
      <Icon className="mr-3 h-4 w-4" />
      {children}
    </motion.a>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <AuthButton 
          variant="secondary" 
          href="/login"
          className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl transition-all duration-200 border border-gray-200"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:block">Iniciar Sesión</span>
        </AuthButton>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <AuthButton 
          variant="primary" 
          href="/register"
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <UserPlus className="h-4 w-4" />
          <span>Registrarse</span>
        </AuthButton>
      </motion.div>
    </div>
  );
}