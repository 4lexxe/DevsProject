import DesktopNavbar from './NavbarDesktop';

export default function Navbar() {
  // Eliminar el uso de useMediaQuery y mostrar siempre la versión desktop
  return <DesktopNavbar />;
}