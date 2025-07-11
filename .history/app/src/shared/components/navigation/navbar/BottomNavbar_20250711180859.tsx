import {
  Home,
  BookOpen,
  Library,
  User,
  Menu,
  Settings,
  MessageCircle,
  Map,
  LogIn,
  UserPlus,
  CreditCard,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/user/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const navItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: BookOpen, label: "Cursos", path: "/cursos" },
    {
      icon: undefined,
      label: user ? "Perfil" : "Ingresar",
      path: user ? "/profile" : "#",
      isProfile: true,
    },
    { icon: Library, label: "Recursos", path: "/recursos" },
  ];

  interface NavItem {
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
    isProfile?: boolean;
  }

  const dropdownItems = [
    { icon: Settings, label: "Ajustes", path: "/ajustes" },
    { icon: MessageCircle, label: "Foro", path: "/foro" },
    { icon: CreditCard, label: "Plans", path: "/plans" },
    { icon: Map, label: "Ruta de Aprendizaje", path: "/ruta-aprendizaje" },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsSidebarOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Para el menú de autenticación
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
    setIsSidebarOpen(false);
    setIsAuthDropdownOpen(false);
  }, [location]);

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t h-20 z-50">
        <div className="relative grid grid-cols-5 h-full items-center justify-center px-4">
          {navItems.map(({ icon: Icon, label, path, isProfile }) => {
            if (isProfile) {
              return (
                <div
                  key={path}
                  className="col-span-1 flex items-center justify-center relative"
                >
                  <button
                    ref={profileButtonRef}
                    onClick={(e) => {
                      e.preventDefault();
                      if (user) {
                        navigate(path);
                      } else {
                        setIsAuthDropdownOpen(!isAuthDropdownOpen);
                      }
                    }}
                    className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-blue-600 hover:text-blue-600"
                  >
                    {user ? (
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=random`
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isAuthDropdownOpen && !user && (
                      <motion.div
                        ref={authDropdownRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-4 transform -translate-x-1/2 flex gap-4 items-center z-50"
                      >
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => {
                              navigate("/login");
                              setIsAuthDropdownOpen(false);
                            }}
                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-400 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-gray-600"
                          >
                            <LogIn className="h-6 w-6 text-gray-600" />
                          </button>
                          <span className="text-xs font-medium text-gray-600 mt-1 bg-white px-2 rounded">
                            Ingresar
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => {
                              navigate("/register");
                              setIsAuthDropdownOpen(false);
                            }}
                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-400 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-gray-600"
                          >
                            <UserPlus className="h-6 w-6 text-gray-600" />
                          </button>
                          <span className="text-xs font-medium text-gray-600 mt-1 bg-white px-2 rounded">
                            Registrar
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 ${
                  isActive(path) ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {Icon && <Icon className="h-6 w-6" />}
                <span className="text-xs font-medium mt-1">{label}</span>
              </button>
            );
          })}
          
          {/* Menu Button */}
          <div className="col-span-1 flex items-center justify-center relative">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 text-gray-500`}
            >
              <Menu className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">Menú</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                    alt="Dev's Project"
                    className="h-10 w-10 object-contain"
                  />
                  <h2 className="text-xl font-bold text-gray-900">Menú</h2>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* User Info (if logged in) */}
              {user && (
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">Usuario activo</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {dropdownItems.map(({ icon: Icon, label, path }) => (
                    <button
                      key={path}
                      onClick={() => {
                        navigate(path);
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon className="h-5 w-5 mr-3 text-gray-500" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                  
                  {/* Additional Navigation Items */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Navegación
                    </h3>
                    <button
                      onClick={() => {
                        navigate("/");
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Home className="h-5 w-5 mr-3 text-gray-500" />
                      <span className="font-medium">Inicio</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/cursos");
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <BookOpen className="h-5 w-5 mr-3 text-gray-500" />
                      <span className="font-medium">Cursos</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/recursos");
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Library className="h-5 w-5 mr-3 text-gray-500" />
                      <span className="font-medium">Recursos</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Cerrar sesión</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      <span className="font-medium">Iniciar Sesión</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <UserPlus className="h-5 w-5 mr-2" />
                      <span className="font-medium">Registrarse</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}