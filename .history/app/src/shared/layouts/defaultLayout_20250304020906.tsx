import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';
import Sidebar from '../../dashboard/components/Sidebar';

export default function DefaultLayout() {
  const { backendOnline } = useSocket();
  
  // Mock de usuario para el sidebar
  const mockUser = {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NotificationBubble />
      
      {/* Simplemente agregamos el Sidebar aquí, sin modificar la estructura */}
      <Sidebar user={mockUser} />
      
      <main className="flex-grow w-full">
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
      </main>
      <Footer />
    </div>
  );
}