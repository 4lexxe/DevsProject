import { useState, useRef, useEffect } from 'react';
import { 
  LogOut, 
  User, 
  Settings, 
  LogIn, 
  UserPlus,
  BookOpen,
  Compass,
  FileText,
  Home,
  Search,
  Bell
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../auth/contexts/AuthContext';
import AuthButton from '../../buttons/AuthButton';
import SearchBar from '../../searchBar/SearchBar';

export default function DesktopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { icon: <Home size={20} />, label: 'Inicio', href: '/' },
    { icon: <BookOpen size={20} />, label: 'Cursos', href: '/cursos' },
    { icon: <Compass size={20} />, label: 'Ruta de Aprendizaje', href: '/ruta-aprendizaje' },
    { icon: <FileText size={20} />, label: 'Recursos', href: '/recursos' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (isProfileOpen || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, showNotifications]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alineación exacta con el sidebar - h-16 y border-b */}
        <div className="flex items-center justify-between h-16 border-b border-gray-200">
          {/* Logo - Aumentado de tamaño y eliminado el texto */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                alt="Dev's Project"
                className="h-14 w-14 object-contain" // Aumentado de h-10 w-10 a h-14 w-14
              />
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:block flex-grow max-w-md mx-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Buscar cursos, recursos..."
              />
            </div>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-10">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold">Notificaciones</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium">Nuevo curso disponible</p>
                      <p className="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
                    </div>
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium">Comentario en tu proyecto</p>
                      <p className="text-xs text-gray-500 mt-1">Hace 1 hora</p>
                    </div>
                  </div>
                  <div className="p-2 text-center border-t border-gray-200">
                    <button className="text-xs text-blue-600 font-medium hover:text-blue-800">
                      Ver todas
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Auth section */}
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
    </nav>
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
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-expanded={isProfileOpen}
        aria-haspopup="true"
      >
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover border border-blue-300"
        />
        <span className="text-sm font-medium hidden md:block">{user.name}</span>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
          </div>
          <div className="py-1">
            <MenuLink href="/profile" icon={User}>Perfil</MenuLink>
            <MenuLink href="/dashboard" icon={Settings}>Dashboard</MenuLink>
            <MenuLink href="/settings" icon={Settings}>Configuración</MenuLink>
          </div>
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-red-600 group"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function MenuLink({ href, icon: Icon, children }: MenuLinkProps) {
  return (
    <Link
      to={href}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 group"
    >
      <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
      {children}
    </Link>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      <AuthButton 
        variant="secondary" 
        href="/login"
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
      >
        <LogIn className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Iniciar Sesión</span>
      </AuthButton>
      <AuthButton 
        variant="primary" 
        href="/register"
        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Registrarse</span>
      </AuthButton>
    </div>
  );
}