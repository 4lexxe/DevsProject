import React from 'react';
import { Github, Disc as Discord } from 'lucide-react';
import authService from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';

function AnotherWay() {
  const { login } = useAuth();

  const handleOpenPopup = (url: string) => {
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      url,
      'OAuthPopup',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup);
        // Verificar estado de autenticación y actualizar el contexto
        interface AuthResponse {
          authenticated: boolean;
          user?: User | undefined;
          session?: any;
        }

        interface User {
          id: number;
        }

                authService.verify()
                  .then((response: AuthResponse) => {
                    if (response.authenticated && response.user) {
                      window.location.href = '/';
                    }
                  })
                  .catch((error: Error) => {
                    console.error('Error verificando autenticación:', error);
                  });
      }
    }, 500);
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O continuar con</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => handleOpenPopup(authService.getGithubAuthUrl())}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Github className="h-5 w-5 mr-2" />
          GitHub
        </button>
        <button
          onClick={() => handleOpenPopup(authService.getDiscordAuthUrl())}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Discord className="h-5 w-5 mr-2" />
          Discord
        </button>
      </div>
    </div>
  );
}

export default AnotherWay;