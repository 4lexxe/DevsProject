import { useState, useRef, useEffect, FormEvent } from "react";
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Settings, 
  BookOpen, 
  Map, 
  Library,
  LogIn,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthButton from "../buttons/AuthButton";
import NavLink from "../navLink/NavLink";
import { useAuth } from "../../../auth/contexts/AuthContext";
import SearchBar from "../searchBar/SearchBar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Función para cerrar el menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isMenuOpen || isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isProfileOpen]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setIsMenuOpen(false); // Cerrar menú al buscar
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 transition-transform duration-200 hover:scale-105">
            <a 
              href="/" 
              className="flex items-center space-x-2"
              onClick={handleNavigation}
            >
              <div className="h-16 w-16 mx-auto">
                <img
                  src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                  alt="Devs Project Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </a>
          </div>

          {/* Search bar (desktop) */}
          <div className="hidden md:block flex-grow max-w-md mx-6">
            <SearchBar 
              placeholder="Buscar cursos, recursos..."
              searchQuery=""
              setSearchQuery={() => {}}
              handleSearch={handleSearch}
            />
          </div>

          {/* Navigation links (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              href="/cursos" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              onClick={handleNavigation}
            >
              <BookOpen className="h-5 w-5" />
              <span>Cursos</span>
            </NavLink>
            <NavLink 
              href="/ruta-aprendizaje" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              onClick={handleNavigation}
            >
              <Map className="h-5 w-5" />
              <span>Ruta de Aprendizaje</span>
            </NavLink>
            <NavLink 
              href="/recursos" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              onClick={handleNavigation}
            >
              <Library className="h-5 w-5" />
              <span>Recursos</span>
            </NavLink>
          </div>

          {/* Auth buttons or user profile (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 focus:outline-none"
                >
                  <span className="text-sm font-medium">{user.name}</span>
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=random`
                    }
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-blue-400 transition-transform duration-200 hover:scale-105"
                  />
                </button>

                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200">
                    <div className="py-1" role="menu">
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                        onClick={handleNavigation}
                      >
                        <User className="mr-3 h-4 w-4 text-blue-500" />
                        Perfil
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                        onClick={handleNavigation}
                      >
                        <Settings className="mr-3 h-4 w-4 text-blue-500" />
                        Configuración
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-red-500" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <AuthButton 
                  variant="secondary" 
                  href="/login"
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-lg hover:bg-blue-100 transition-all duration-200"
                  onClick={handleNavigation}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </AuthButton>
                <AuthButton 
                  variant="primary" 
                  href="/register"
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={handleNavigation}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Registrarse</span>
                </AuthButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors duration-200 focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-blue-100 shadow-lg"
        >
          {/* Search bar (mobile) */}
          <div className="px-4 pt-4 pb-3">
            <SearchBar 
              handleSearch={handleSearch}
              searchQuery=""
              setSearchQuery={() => {}}
              placeholder="Buscar cursos, recursos..."
            />
          </div>

          {/* Navigation links (mobile) */}
          <div className="px-4 pt-2 pb-3 space-y-2">
            <NavLink 
              href="/cursos" 
              className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              onClick={handleNavigation}
            >
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span>Cursos</span>
            </NavLink>
            <NavLink 
              href="/ruta-aprendizaje" 
              className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              onClick={handleNavigation}
            >
              <Map className="h-5 w-5 text-blue-500" />
              <span>Ruta de Aprendizaje</span>
            </NavLink>
            <NavLink 
              href="/recursos" 
              className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              onClick={handleNavigation}
            >
              <Library className="h-5 w-5 text-blue-500" />
              <span>Recursos</span>
            </NavLink>
          </div>

          {/* Auth section (mobile) */}
          <div className="pt-4 pb-3 border-t border-blue-100">
            {user ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=random`
                      }
                      alt={user.name}
                      className="h-12 w-12 rounded-full border-2 border-blue-400"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    onClick={handleNavigation}
                  >
                    <User className="mr-3 h-5 w-5 text-blue-500" />
                    Perfil
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    onClick={handleNavigation}
                  >
                    <Settings className="mr-3 h-5 w-5 text-blue-500" />
                    Configuración
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-red-500" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-4">
                <AuthButton 
                  variant="secondary" 
                  fullWidth 
                  href="/login"
                  className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg hover:bg-blue-100 transition-all duration-200"
                  onClick={handleNavigation}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Iniciar Sesión</span>
                </AuthButton>
                <AuthButton 
                  variant="primary" 
                  fullWidth 
                  href="/register"
                  className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={handleNavigation}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Registrarse</span>
                </AuthButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}