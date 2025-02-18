import { FC } from 'react';
import { BookOpen, Map, Library } from 'lucide-react';
import NavLink from './NavLink';

interface NavLinksProps {
  onNavigate: () => void;
  isMobile?: boolean;
}

export const NavLinks: FC<NavLinksProps> = ({ onNavigate, isMobile = false }) => {
  const linkItems = [
    { href: '/cursos', icon: BookOpen, label: 'Cursos' },
    { href: '/ruta-aprendizaje', icon: Map, label: 'Ruta de Aprendizaje' },
    { href: '/recursosxd', icon: Library, label: 'Recursos' }
  ];

  const baseClasses = `flex items-center space-x-2 px-4 py-${isMobile ? '3' : '2'} rounded-lg`;
  const hoverClasses = `hover:bg-blue-${isMobile ? '50' : '100'} transition-colors duration-200`;

  return (
    <>
      {linkItems.map(({ href, icon: Icon, label }) => (
        <NavLink 
          key={href}
          href={href} 
          className={`${baseClasses} ${hoverClasses}`}
          onClick={onNavigate}
        >
          <Icon className={`h-5 w-5 ${isMobile ? 'text-blue-500' : ''}`} />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );
};