import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, LogIn, UserPlus, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';
import NavLink from '../navbar/NavLink';
import AuthButton from '../../buttons/AuthButton';

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
    <nav className="bg-white border-b border-gray-100 sticky top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo centrado */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                alt="Dev's Project"
                className="h-8 w-8 object-contain"
              />
              <span className="ml-2 text-lg font-bold text-gray-900">Dev's</span>
            </a>
          </div>

          {/* Navigation links centrados */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/cursos">Cursos</NavLink>
            <NavLink href="/recursos">Recursos</NavLink>
            <NavLink href="/plans">Planes</NavLink>
            <NavLink href="/ruta-aprendizaje">Ruta</NavLink>
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
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors duration-200"
      >
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6b7280&color=fff`}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-gray-100">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
            <MenuLink href="/profile" icon={User}>Perfil</MenuLink>
            <MenuLink href="/subscription" icon={CreditCard}>Suscripción</MenuLink>
            <MenuLink href="/settings" icon={Settings}>Configuración</MenuLink>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
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
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
    >
      <Icon className="mr-3 h-4 w-4" />
      {children}
    </a>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      <AuthButton 
        variant="secondary" 
        href="/login"
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Iniciar Sesión
      </AuthButton>
      <AuthButton 
        variant="primary" 
        href="/register"
        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
      >
        Registrarse
      </AuthButton>
    </div>
  );
}