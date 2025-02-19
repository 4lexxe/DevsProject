import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import DesktopNavbar from './NavbarDesktop';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

interface NavbarProps {
  showTopNavbar?: boolean; // Propiedad opcional para controlar la visibilidad del TopNavbar
}

export default function Navbar({ showTopNavbar = true }: NavbarProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <>
        {showTopNavbar && <TopNavbar />} {/* Mostrar TopNavbar solo si showTopNavbar es true */}
        {showTopNavbar}
        <BottomNavbar /> {/* BottomNavbar siempre visible */}
      </>
    );
  }

  return <DesktopNavbar />;
}