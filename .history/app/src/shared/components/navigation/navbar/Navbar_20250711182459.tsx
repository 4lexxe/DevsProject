import { useMediaQuery } from '../../../hooks/useMediaQuery';
import DesktopNavbar from './NavbarDesktop';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <>
        <TopNavbar />
        <div className="pb-16">
          {/* Contenido */}
        </div>
        <BottomNavbar />
      </>
    );
  }

  return <DesktopNavbar />;
}