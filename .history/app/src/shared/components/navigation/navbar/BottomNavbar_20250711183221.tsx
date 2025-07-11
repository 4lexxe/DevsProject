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
  LogOut,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/user/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  const menuItems = [
    { icon: Settings, label: "Ajustes", path: "/ajustes" },
    { icon: MessageCircle, label: "Foro", path: "/foro" },
    { icon: CreditCard, label: "Plans", path: "/plans" },
    { icon: Map, label: "Ruta de Aprendizaje", path: "/ruta-aprendizaje" },
  ];

  interface NavItem {
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
    isProfile?: boolean;
  }

  const isActive = (path: string): boolean => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Para el menú principal
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
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
    setIsDropdownOpen(false);
    setIsAuthDropdownOpen(false);
  }, [location]);

  return (
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
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: "backOut" }}
                      className="absolute bottom-full mb-6 left-1/2 transform -translate-x-1/2 z-50"
                    >
                      {/* Container mejorado */}
                      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-4 min-w-[280px]">
                        {/* Header */}
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">¡Únete a nosotros!</h3>
                          <p className="text-sm text-gray-600">Accede a todos nuestros cursos y recursos</p>
                        </div>

                        {/* Botones mejorados */}
                        <div className="space-y-3">
                          {/* Botón Iniciar Sesión */}
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              navigate("/login");
                              setIsAuthDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400"
                          >
                            <LogIn className="h-5 w-5" />
                            <span>Iniciar Sesión</span>
                          </motion.button>

                          {/* Separador */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-white px-2 text-gray-500 font-medium">o</span>
                            </div>
                          </div>

                          {/* Botón Registrarse */}
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              navigate("/register");
                              setIsAuthDropdownOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            <UserPlus className="h-5 w-5" />
                            <span>Crear Cuenta</span>
                          </motion.button>
                        </div>

                        {/* Features o beneficios */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Gratis</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Sin límites</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span>Certificados</span>
                            </div>
                          </div>
                        </div>

                        {/* Flecha indicadora */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-4 h-4 bg-white border-r border-b border-gray-200/50 transform rotate-45"></div>
                        </div>
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
        <div
          className="col-span-1 flex items-center justify-center relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsGridMenuOpen(!isGridMenuOpen)}
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 ${
              isGridMenuOpen ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs font-medium mt-1">Menú</span>
          </button>
        </div>
      </div>

      {/* Full Screen Grid Menu Overlay */}
      <AnimatePresence>
        {isGridMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsGridMenuOpen(false)}
            />

            {/* Grid Menu - Ocupa la mayor parte de la pantalla */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                  <button
                    onClick={() => setIsGridMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=6366f1&color=fff`
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">En línea</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Menu Items - Ocupa el espacio restante */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {menuItems.map(({ icon: Icon, label, path }, index) => (
                      <motion.button
                        key={path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          navigate(path);
                          setIsGridMenuOpen(false);
                        }}
                        className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 aspect-square"
                      >
                        <Icon className="w-8 h-8 text-gray-600 mb-3" />
                        <span className="text-sm font-medium text-gray-700 text-center">
                          {label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Footer mejorado */}
                <div className="p-4 border-t border-gray-200">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Header para usuarios no autenticados */}
                      <div className="text-center mb-4">
                        <h4 className="text-base font-bold text-gray-900 mb-1">¡Comienza tu viaje!</h4>
                        <p className="text-xs text-gray-600">Únete a miles de desarrolladores</p>
                      </div>

                      {/* Botón Iniciar Sesión mejorado */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate("/login");
                          setIsGridMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                      </motion.button>

                      {/* Botón Registrarse mejorado */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate("/register");
                          setIsGridMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Crear Cuenta Gratis
                      </motion.button>

                      {/* Mensaje adicional */}
                      <p className="text-xs text-center text-gray-500 mt-3">
                        🚀 Acceso completo • 📚 +100 cursos • 🎓 Certificados
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}