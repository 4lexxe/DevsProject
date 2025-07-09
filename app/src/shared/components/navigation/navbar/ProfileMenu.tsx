import { FC, useRef } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface ProfileMenuProps {
  user: { name: string; email?: string; avatar?: string };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onNavigate: () => void;
  isMobile?: boolean;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({
  user,
  isOpen,
  setIsOpen,
  onLogout,
  onNavigate,
  isMobile = false,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsOpen(false), isOpen);

  if (isMobile) {
    return (
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
            {user.email && <div className="text-sm font-medium text-gray-500">{user.email}</div>}
          </div>
        </div>
        <div className="space-y-2">
          <ProfileMenuItem href="/profile" icon={User} label="Perfil" onClick={onNavigate} isMobile />
          <ProfileMenuItem href="/settings" icon={Settings} label="Configuración" onClick={onNavigate} isMobile />
          <ProfileMenuItem icon={LogOut} label="Cerrar sesión" onClick={onLogout} isMobile isLogout />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200">
          <div className="py-1" role="menu">
            <ProfileMenuItem href="/profile" icon={User} label="Perfil" onClick={onNavigate} />
            <ProfileMenuItem href="/settings" icon={Settings} label="Configuración" onClick={onNavigate} />
            <ProfileMenuItem icon={LogOut} label="Cerrar sesión" onClick={onLogout} isLogout />
          </div>
        </div>
      )}
    </div>
  );
};

interface ProfileMenuItemProps {
  href?: string;
  icon: typeof User;
  label: string;
  onClick: () => void;
  isMobile?: boolean;
  isLogout?: boolean;
}

const ProfileMenuItem: FC<ProfileMenuItemProps> = ({ href, icon: Icon, label, onClick, isMobile, isLogout }) => {
  const baseClasses = `flex items-center ${isMobile ? 'px-4 py-3 text-base' : 'px-4 py-3 text-sm'} text-gray-700`;
  const hoverClasses = `hover:bg-${isLogout ? 'red' : 'blue'}-50 transition-colors duration-200`;
  const Component = href ? 'a' : 'button';
  const props = {
    ...(href ? { href } : {}),
    className: `${baseClasses} ${hoverClasses} ${!href ? 'w-full' : ''}`,
    onClick,
  };

  return (
    <Component {...props}>
      <Icon className={`mr-3 h-4 w-4 ${isLogout ? 'text-red-500' : 'text-blue-500'}`} />
      {label}
    </Component>
  );
};