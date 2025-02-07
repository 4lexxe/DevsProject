import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';

export default function DefaultLayout() {
  const { backendOnline } = useSocket(); // hook para verificar el estado del backend

  return (
    <div className="min-h-screen flex flex-col bg-white pt-20">
      <Navbar />
      <NotificationBubble />
      {backendOnline ? (
        <Outlet />
      ) : (
        <div className="flex justify-center items-center h-full text-red-600">
          El servidor no está disponible. Por favor, intenta más tarde.
        </div>
      )}
      <Footer />
    </div>
  );
}