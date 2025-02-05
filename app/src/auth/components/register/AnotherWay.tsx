import React from 'react';
import { Github, Disc as Discord } from 'lucide-react';
import authService from '../../services/auth.service';

function AnotherWay() {
  const handleOAuthLogin = (url: string) => {
    // Obtener la URL actual (desde donde se solicitó la autenticación)
    const redirectUrl = window.location.href;

    // Agregar la URL de origen como parámetro en la solicitud de autenticación
    const authUrl = `${url}?redirect=${encodeURIComponent(redirectUrl)}`;

    // Redirigir al usuario a la página de autenticación
    window.location.href = authUrl;
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
          onClick={() => handleOAuthLogin(authService.getGithubAuthUrl())}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <Github className="h-5 w-5 mr-2" />
          GitHub
        </button>
        <button
          onClick={() => handleOAuthLogin(authService.getDiscordAuthUrl())}
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