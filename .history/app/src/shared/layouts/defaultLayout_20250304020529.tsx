import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';
import Sidebar from '../../dashboard/components/Sidebar';
import { useAuth } from '../../auth/contexts/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function DefaultLayout() {
  const { backendOnline } = useSocket();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Mock user para el Sidebar si es necesario
  const mockUser = user || {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NotificationBubble />
      
      {/* En móvil, mostrar Navbar arriba */}
      {isMobile && <Navbar />}
      
      <div className="flex flex-1 relative">
        {/* Sidebar siempre visible (aunque en móvil empieza oculto) */}
        <Sidebar user={mockUser} />
        
        {/* Contenido principal con ajuste de márgenes para acomodar sidebar */}
        <div className="flex flex-col flex-1 md:ml-16 lg:ml-64 transition-all duration-300">
          {/* En pantallas más grandes, mostrar Navbar después del sidebar */}
          {!isMobile && <Navbar />}
          
          <main className="flex-1">
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
      </div>
    </div>
  );
}