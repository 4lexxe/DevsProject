import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';
import Sidebar from '@/dashboard/components/Sidebar'; // Importa el Sidebar

export default function DefaultLayout() {
  const { backendOnline } = useSocket();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Notificaciones */}
      <NotificationBubble />

      {/* Contenido principal */}
      <main className="flex-grow flex">
        {/* Sidebar con posición sticky */}
        <div className="sticky top-0 self-start h-screen">
          <Sidebar user={{ name: 'Admin', role: 'admin' }} />
        </div>

        {/* Contenido dinámico (Outlet) */}
        <div className="flex-grow w-full overflow-x-hidden">
          <Navbar />
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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}