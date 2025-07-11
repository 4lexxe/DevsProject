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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 z-50">
      <div className="flex items-center justify-around h-full px-6">
        {navItems.map(({ icon: Icon, label, path, isProfile }) => {
          if (isProfile) {
            return (
              <div key={path} className="relative">
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
                  className="flex flex-col items-center space-y-1 p-2 transition-colors"
                >
                  {user ? (
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=6b7280&color=fff`
                      }
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-600" />
                  )}
                  <span className="text-xs text-gray-600">{user ? "Perfil" : "Ingresar"}</span>
                </button>
                
                <AnimatePresence>
                  {isAuthDropdownOpen && !user && (
                    <motion.div
                      ref={authDropdownRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-100 p-3 min-w-[200px]"
                    >
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            navigate("/login");
                            setIsAuthDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        >
                          Iniciar Sesión
                        </button>
                        <button
                          onClick={() => {
                            navigate("/register");
                            setIsAuthDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
                        >
                          Registrarse
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }
          
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center space-y-1 p-2 transition-colors"
            >
              {Icon && <Icon className={`h-6 w-6 ${active ? 'text-gray-900' : 'text-gray-600'}`} />}
              <span className={`text-xs ${active ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {label}
              </span>
            </button>
          );
        })}
        
        <button
          onClick={() => setIsGridMenuOpen(!isGridMenuOpen)}
          className="flex flex-col items-center space-y-1 p-2 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-600" />
          <span className="text-xs text-gray-600">Menú</span>
        </button>
      </div>

      <AnimatePresence>
        {isGridMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50"
              onClick={() => setIsGridMenuOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[70vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Menú</h2>
                  <button
                    onClick={() => setIsGridMenuOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.map(({ icon: Icon, label, path }) => (
                      <button
                        key={path}
                        onClick={() => {
                          navigate(path);
                          setIsGridMenuOpen(false);
                        }}
                        className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Icon className="w-6 h-6 text-gray-600 mb-2" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {!user && (
                  <div className="p-4 border-t border-gray-100 space-y-2">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsGridMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setIsGridMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
                    >
                      Registrarse
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}