import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';
import Sidebar from '@/dashboard/components/Sidebar';

export default function DefaultLayout() {
  const { backendOnline } = useSocket();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Notificaciones */}
      <NotificationBubble />

      {/* Contenido principal */}
      <main className="flex-grow flex relative">
        {/* Sidebar con z-index mayor que el Navbar */}
        <div className="fixed top-0 left-0 h-screen z-[60]">
          <Sidebar user={{ name: 'Admin', role: 'admin' }} />
        </div>

        {/* Contenido dinámico (Outlet) y Footer agrupados */}
        <div className="flex-grow w-full overflow-x-hidden flex flex-col min-h-screen">
          <div className="z-50">
            <Navbar />
          </div>
          
          <div className="flex-grow">
            {backendOnline ? (
              <Outlet />
            ) : (
              <div className="flex justify-center items-center h-[50vh] text-red-600 text-center px-4">
                <p className="text-sm sm:text-base">
                  El servidor no está disponible. Por favor, intenta más tarde.
                </p>
              </div>
            )}
          </div>
          
          <Footer />
        </div>
      </main>
    </div>
  );
}
