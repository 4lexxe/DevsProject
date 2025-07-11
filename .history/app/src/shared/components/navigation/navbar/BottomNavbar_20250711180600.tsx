import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Library, 
  Settings, 
  MessageCircle, 
  CreditCard, 
  Map, 
  LogOut, 
  User, 
  Menu,
  ChevronUp,
  Sparkles,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '@/user/contexts/AuthContext';

interface NavItem {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isProfile?: boolean;
  badge?: number;
}

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const navItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: BookOpen, label: "Cursos", path: "/cursos", badge: 2 },
    {
      icon: undefined,
      label: user ? "Perfil" : "Ingresar",
      path: user ? "/profile" : "#",
      isProfile: true,
    },
    { icon: Library, label: "Recursos", path: "/recursos" },
  ];

  const dropdownItems = [
    { icon: Settings, label: "Ajustes", path: "/ajustes" },
    { icon: MessageCircle, label: "Foro", path: "/foro" },
    { icon: CreditCard, label: "Plans", path: "/plans" },
    { icon: Map, label: "Ruta de Aprendizaje", path: "/ruta-aprendizaje" },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(event.target as Node) &&
        !profileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsAuthDropdownOpen(false);
  }, [location]);

  const handleProfileClick = () => {
    if (user) {
      setIsAuthDropdownOpen(!isAuthDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <AnimatePresence>
        {(isDropdownOpen || isAuthDropdownOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsAuthDropdownOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl" />
          
          <div className="relative px-4 py-2 safe-area-pb">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {navItems.map((item, index) => {
                if (item.isProfile) {
                  return (
                    <motion.button
                      key={item.label}
                      ref={profileButtonRef}
                      onClick={handleProfileClick}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300"
                    >
                      <div className="relative">
                        {user ? (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                            <img
                              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`}
                              alt={user.name}
                              className="w-full h-full rounded-full object-cover bg-white"
                            />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600 max-w-[60px] truncate">
                        {user ? user.name.split(' ')[0] : item.label}
                      </span>
                    </motion.button>
                  );
                }

                const Icon = item.icon!;
                const active = isActive(item.path);

                return (
                  <motion.button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300 ${
                      active 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`w-6 h-6 transition-colors ${active ? 'text-blue-600' : ''}`} />
                      {item.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-xs text-white font-bold">{item.badge}</span>
                        </motion.div>
                      )}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </div>
                    <span className={`text-xs font-medium max-w-[60px] truncate transition-colors ${
                      active ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}

              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-300 ${
                  isDropdownOpen 
                    ? 'bg-purple-50 text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
                <span className="text-xs font-medium text-gray-600">Más</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed bottom-20 right-4 z-50 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
          >
            <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Menú</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 rounded-full hover:bg-white/50 transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>

            <div className="py-2">
              {dropdownItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      navigate(item.path);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors mr-3">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {item.label}
                    </span>
                    {item.label === "Plans" && (
                      <Sparkles className="w-4 h-4 text-yellow-500 ml-auto" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthDropdownOpen && user && (
          <motion.div
            ref={authDropdownRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
          >
            <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff`}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-xs font-medium text-gray-700">Notificaciones</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600 mb-1" />
                  <span className="text-xs font-medium text-gray-700">Buscar</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-left hover:bg-red-50 transition-colors rounded-xl"
              >
                <div className="p-2 rounded-lg bg-red-50 mr-3">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">
                  Cerrar sesión
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}