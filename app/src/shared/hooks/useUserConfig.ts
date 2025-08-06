import { useState, useEffect, useCallback } from 'react';
import { cacheService, UserConfig } from '../services/cacheService';

/**
 * Hook personalizado para gestionar la configuración del usuario con caché
 */
export const useUserConfig = () => {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración inicial del caché
  useEffect(() => {
    const loadConfig = () => {
      try {
        const cachedConfig = cacheService.getUserConfig();
        setConfig(cachedConfig || {
          theme: 'light',
          language: 'es',
          preferences: {
            autoplay: false,
            quality: 'auto',
            speed: 1
          }
        });
      } catch (error) {
        console.error('Error cargando configuración del usuario:', error);
        // Configuración por defecto en caso de error
        setConfig({
          theme: 'light',
          language: 'es',
          preferences: {
            autoplay: false,
            quality: 'auto',
            speed: 1
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Actualizar configuración
  const updateConfig = useCallback((newConfig: Partial<UserConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      cacheService.setUserConfig(updatedConfig);
      console.log('Configuración de usuario actualizada:', updatedConfig);
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    }
  }, [config]);

  // Actualizar tema
  const updateTheme = useCallback((theme: 'light' | 'dark') => {
    updateConfig({ theme });
  }, [updateConfig]);

  // Actualizar idioma
  const updateLanguage = useCallback((language: string) => {
    updateConfig({ language });
  }, [updateConfig]);

  // Actualizar preferencias
  const updatePreferences = useCallback((preferences: Partial<UserConfig['preferences']>) => {
    updateConfig({
      preferences: {
        ...config?.preferences,
        ...preferences
      }
    });
  }, [updateConfig, config?.preferences]);

  // Resetear configuración a valores por defecto
  const resetConfig = useCallback(() => {
    const defaultConfig: UserConfig = {
      theme: 'light',
      language: 'es',
      preferences: {
        autoplay: false,
        quality: 'auto',
        speed: 1
      }
    };
    setConfig(defaultConfig);
    cacheService.setUserConfig(defaultConfig);
    console.log('Configuración reseteada a valores por defecto');
  }, []);

  return {
    config,
    isLoading,
    updateConfig,
    updateTheme,
    updateLanguage,
    updatePreferences,
    resetConfig
  };
};

export default useUserConfig;