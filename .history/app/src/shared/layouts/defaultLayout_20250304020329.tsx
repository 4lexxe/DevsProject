import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';
import Footer from '../components/navigation/Footer';
import NotificationBubble from '../../notification/NotificationBubble';
import useSocket from '../../hooks/useSocket';
import Sidebar from '../../dashboard/components/Sidebar';
import { useAuth } from '../../auth/contexts/AuthContext';

export default function DefaultLayout() {
  const { backendOnline } = useSocket();
  const location = useLocation();
  const { user } = useAuth();
  
  // Determinar si estamos en la ruta del dashboard
  const isDashboardRoute = location.pathname === '/dashboard';
  
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
      
      {/* Mostrar Navbar solo si no estamos en el dashboard */}
      {!isDashboardRoute && (
        <Navbar />
      )}
      
      {/* Layout flexible que incluye Sidebar solo en el dashboard */}
      <div className={`flex-grow flex ${isDashboardRoute ? 'flex-row' : 'flex-col'}`}>
        {/* Incluir Sidebar solo para la ruta del dashboard */}
        {isDashboardRoute && (
          <Sidebar user={mockUser} />
        )}
        
        {/* Contenido principal */}
        <main className={`${isDashboardRoute ? 'flex-1' : 'w-full'}`}>
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
      </div>
      
      <Footer />
    </div>
  );
}