import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, LogIn, UserPlus, CreditCard } from 'lucide-react'; // Added CreditCard icon
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';
import NavLink from '../navbar/NavLink';
import AuthButton from '../../buttons/AuthButton';
import SearchBar from '../../searchBar/SearchBar';

export default function DesktopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 shadow-lg sticky top-0 left-0 w-full z-50">
      <div className="lg:mx-16 mx-2 ">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                alt="Dev's Project"
                className="h-16 w-16 object-contain"
              />
            </a>
          </div>

          {/* Search bar */}
          <div className="flex-grow max-w-md mx-6">
            <SearchBar 
              placeholder="Buscar cursos, recursos..."
              searchQuery=""
              setSearchQuery={() => {}}
              handleSearch={(e) => e.preventDefault()}
            />
          </div>

          {/* Navigation links */}
          <div className="flex items-center space-x-6">
            <NavLink href="/cursos">Cursos</NavLink>
            <NavLink href="/plans">Planes</NavLink>
            <NavLink href="/ruta-aprendizaje">Ruta de Aprendizaje</NavLink>
            <NavLink href="/recursos">Recursos</NavLink>
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
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
      >
        <span className="text-sm font-medium">{user.name}</span>
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
        />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white">
          <div className="py-1">
            <MenuLink href="/profile" icon={User}>Perfil</MenuLink>
            <MenuLink href="/subscription" icon={CreditCard}>Mi Suscripción</MenuLink> {/* Updated icon */}
            <MenuLink href="/settings" icon={Settings}>Configuración</MenuLink>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-4 w-4 text-red-500" />
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
    <a
      href={href}
      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50"
    >
      <Icon className="mr-3 h-4 w-4 text-blue-500" />
      {children}
    </a>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center lg:space-x-4 ml-4">
      <AuthButton 
        variant="secondary" 
        href="/login"
        className="flex items-center   py-2.5 rounded-lg hover:bg-blue-100 md:hidden lg:block"
      >
        <LogIn className="h-5 w-5" />
        <span>Iniciar Sesión</span>
      </AuthButton>
      <AuthButton 
        variant="primary" 
        href="/register"
        className="flex items-center space-x-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        <UserPlus className="h-5 w-5" />
        <span>Registrarse</span>
      </AuthButton>
    </div>
  );
}