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
  
  // Determinar si estamos en una ruta de administración (por ejemplo, dashboard)
  const isAdminRoute = location.pathname.startsWith('/dashboard');

  // Mockup de usuario para el sidebar si no hay uno real
  const mockUser = user || {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
  
  // Contenido principal que se muestra en todas las páginas
  const mainContent = backendOnline ? <Outlet /> : (
    <div className="flex justify-center items-center h-[50vh] text-red-600 text-center px-4">
      <p className="text-sm sm:text-base">
        El servidor no está disponible. Por favor, intenta más tarde.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NotificationBubble />
      
      {/* Solo mostrar Navbar si no estamos en una ruta de administración */}
      {!isAdminRoute && <Navbar />}
      
      {/* Layout condicional dependiendo de si estamos en una ruta de administración */}
      {isAdminRoute ? (
        <div className="flex flex-grow">
          {/* Sidebar para rutas de administración */}
          <Sidebar user={mockUser} />
          
          {/* Contenido principal con ajuste de margen */}
          <main className="flex-grow ml-0 md:ml-16 lg:ml-64 transition-all duration-300 overflow-x-hidden">
            <div className="p-4 md:p-6">
              {mainContent}
            </div>
          </main>
        </div>
      ) : (
        <main className="flex-grow w-full">
          {mainContent}
        </main>
      )}
      
      <Footer />
    </div>
  );
}