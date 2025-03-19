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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../auth/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
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
        <div
          className="col-span-1 flex items-center justify-center relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 ${
              isDropdownOpen ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs font-medium mt-1">Menú</span>
          </button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-2 right-0 bg-white shadow-lg border rounded-md overflow-hidden w-56"
              >
                {dropdownItems.map(({ icon: Icon, label, path }) => (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}