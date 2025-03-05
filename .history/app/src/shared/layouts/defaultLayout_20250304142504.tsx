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

      {/* Sidebar como componente independiente */}
      <Sidebar />

      {/* Contenido principal - ahora sin Sidebar dentro */}
      <main className="flex-grow flex flex-col">
        {/* Navbar con ancho completo */}
        <div className="shadow-md">
          <Navbar />
        </div>
        
        {/* Contenido principal */}
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
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}