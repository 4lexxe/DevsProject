import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import LoadingSpinner from '../components/loading/LoadingSpinner';

const withAuthCheck = (WrappedComponent: React.ComponentType) => {
  return function WithAuthCheckWrapper(props: any) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

    // Verifica si el usuario está autenticado al cargar el componente
    useEffect(() => {
      const checkAuth = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 400));

          const { authenticated } = await authService.verify();
          if (authenticated) {
            navigate("/"); // Redirige al usuario a la página de inicio si ya está autenticado
          }
        } catch (error) {
          console.error("Error verificando autenticación:", error);
        } finally {
          setIsLoading(false); // Finaliza la carga, independientemente del resultado
        }
      };

      checkAuth();
    }, [navigate]);

    // Si está cargando, muestra un spinner o un mensaje de carga
    if (isLoading) {
      return <LoadingSpinner />; // Muestra un componente de carga
    }

    // Si no está cargando, renderiza el componente envuelto
    return <WrappedComponent {...props} />;
  };
};

export default withAuthCheck;