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
      <main className="flex-grow flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Contenedor para Sidebar y Contenido Principal */}
        <div className="flex flex-1 relative">
          {/* Sidebar - Fijo */}
          <aside className="fixed top-[64px] left-0 w-64 h-[calc(100vh-64px)] border-r border-gray-200 bg-white overflow-y-auto z-10">
            <Sidebar user={{ name: 'Admin', role: 'admin' }} />
          </aside>

          {/* Contenido dinámico (Outlet) */}
          <div className="flex-grow w-full ml-[256px] overflow-y-auto">
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
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}