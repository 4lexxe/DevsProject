import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';

export default function DefaultLayout() {
  const { backendOnline } = useSocket();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <NotificationBubble />
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 pt-20">
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
      <Footer />
    </div>
  );
}