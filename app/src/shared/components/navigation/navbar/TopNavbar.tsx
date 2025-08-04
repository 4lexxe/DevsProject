import { Bell, Search, ShoppingCart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';
import { useState, useEffect } from 'react';
import SearchInput from '../../search/SearchInput';
import MobileSearchOverlay from '../../search/MobileSearchOverlay';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { cartService } from '@/payment/services/cartService';

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Inicio';
    case '/cursos':
      return 'Cursos';
    default:
      return 'Inicio';
  }
};

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el estado del usuario desde el contexto de autenticación
  const pageTitle = getPageTitle(location.pathname);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Obtener la cantidad de items en el carrito
  useEffect(() => {
    const fetchCartData = async () => {
      if (user) {
        try {
          const cartData = await cartService.getActiveCart();
          setCartItemsCount(cartData?.summary?.courseCount || 0);
        } catch (error) {
          console.error('Error obteniendo datos del carrito:', error);
          setCartItemsCount(0);
        }
      } else {
        setCartItemsCount(0);
      }
    };

    fetchCartData();
  }, [user]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md h-20 z-50">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <img
              src="https://i.ibb.co/dQ09SsH/logoDev2.png"
              alt="Dev's Project"
              className="h-12 w-12 object-contain"
            />
            <h1 className={`font-semibold ${
              isMobile ? 'text-lg' : 'text-xl'
            }`}>{pageTitle}</h1>
          </div>
    
          {/* Búsqueda y notificaciones */}
          <div className="flex items-center space-x-2">
            {isMobile ? (
              /* Vista móvil: Solo ícono de búsqueda */
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="h-6 w-6 text-gray-600" />
              </button>
            ) : (
              /* Vista desktop: Barra de búsqueda completa */
              <div className="w-64">
                <SearchInput placeholder="Buscar cursos..." />
              </div>
            )}
            
            {user && (
              <>
                {/* Carrito */}
                <button 
                  onClick={() => navigate('/cart')}
                  className="p-3 hover:bg-gray-100 rounded-full relative transition-colors"
                >
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium" style={{backgroundColor: "rgb(66, 215, 199)", color: "#0c154c"}}>
                      {cartItemsCount}
                    </span>
                  )}
                </button>
                
                {/* Notificaciones */}
                <button className="p-3 hover:bg-gray-100 rounded-full relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    3
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay de búsqueda móvil */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        placeholder="Buscar cursos, recursos..."
      />
    </>
  );
}