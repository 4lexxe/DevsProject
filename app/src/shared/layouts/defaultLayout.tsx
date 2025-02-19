import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import BottomNavbar from '../components/navigation/navbar/BottomNavbar'; // Importa el BottomNavbar

export default function DefaultLayout() {
  const { backendOnline } = useSocket();
  const location = useLocation(); // Obtener la ubicación actual
  const isMobile = useMediaQuery('(max-width: 768px)'); // Detectar si estamos en modo responsive
  const shouldShowTopNavbar = location.pathname !== '/search';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      {shouldShowTopNavbar && <Navbar showTopNavbar={true} />}

      {/* Notificación */}
      <NotificationBubble />

      {/* Contenido Principal */}
      <main
        className={`flex-grow w-full ${
          shouldShowTopNavbar ? 'pt-20' : 'pt-0' // Padding top para el Top Navbar
        } ${isMobile ? 'pb-24' : ''}`} // Padding bottom para el Bottom Navbar en modo móvil
      >
        {backendOnline ? (
          <Outlet />
        ) : (
          <div className="flex justify-center items-center h-[50vh] text-red-600 text-center px-4">
            <p className="text-sm sm:text-base">
              El servidor no está disponible. Por favor, intenta más tarde.
            </p>
          </div>
        )}
      </main>

      {/* Footer (solo en modo desktop) */}
      {!isMobile && <Footer />}

      {/* Bottom Navbar (solo en modo móvil) */}
      {isMobile && <BottomNavbar />}
    </div>
  );
}