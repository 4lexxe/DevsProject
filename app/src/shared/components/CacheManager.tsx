import React, { useState, useEffect } from 'react';
import { useCacheManager } from '../hooks/useCacheManager';
import { useUserConfig } from '../hooks/useUserConfig';
import { Trash2, Database, Settings, RefreshCw, Info } from 'lucide-react';

interface CacheManagerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const CacheManager: React.FC<CacheManagerProps> = ({ isOpen = true, onClose }) => {
  const {
    getCacheStats,
    clearCoursesCache,
    clearAllCache,
    hasCoursesInCache
  } = useCacheManager();
  
  const { config, updateConfig, resetConfig } = useUserConfig();
  const [stats, setStats] = useState<any>(null);
  const [isClearing, setIsClearing] = useState(false);

  // Actualizar estadísticas del caché
  const refreshStats = () => {
    const cacheStats = getCacheStats();
    setStats(cacheStats);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStats();
    }
  }, [isOpen]);

  const handleClearCoursesCache = async () => {
    setIsClearing(true);
    try {
      clearCoursesCache();
      refreshStats();
      alert('Caché de cursos limpiado exitosamente');
    } catch (error) {
      console.error('Error limpiando caché:', error);
      alert('Error al limpiar el caché');
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearAllCache = async () => {
    if (confirm('¿Estás seguro de que quieres limpiar todo el caché? Esto incluye configuraciones guardadas.')) {
      setIsClearing(true);
      try {
        clearAllCache();
        refreshStats();
        alert('Todo el caché ha sido limpiado');
      } catch (error) {
        console.error('Error limpiando caché:', error);
        alert('Error al limpiar el caché');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleResetConfig = () => {
    if (confirm('¿Estás seguro de que quieres resetear la configuración a los valores por defecto?')) {
      resetConfig();
      alert('Configuración reseteada');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  if (!isOpen) return null;

  // Renderizado como modal
  if (onClose) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Gestor de Caché</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Estadísticas del caché */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Estadísticas del Caché</h3>
                <button
                  onClick={refreshStats}
                  className="ml-auto p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Actualizar estadísticas"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* LocalStorage */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">LocalStorage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usado:</span>
                        <span className="font-mono">{formatBytes(stats.localStorage.used)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-mono">{formatBytes(stats.localStorage.total)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getUsagePercentage(stats.localStorage.used, stats.localStorage.total)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUsagePercentage(stats.localStorage.used, stats.localStorage.total)}% usado
                      </div>
                    </div>
                  </div>

                  {/* SessionStorage */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">SessionStorage</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usado:</span>
                        <span className="font-mono">{formatBytes(stats.sessionStorage.used)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-mono">{formatBytes(stats.sessionStorage.total)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getUsagePercentage(stats.sessionStorage.used, stats.sessionStorage.total)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUsagePercentage(stats.sessionStorage.used, stats.sessionStorage.total)}% usado
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stats && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Total de elementos en caché:</span>
                    <span className="font-semibold text-blue-800">{stats.cacheItems}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-blue-700">Cursos en caché:</span>
                    <span className="font-semibold text-blue-800">
                      {hasCoursesInCache() ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Configuración del usuario */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Configuración del Usuario</h3>
              </div>
              
              {config && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Tema:</span>
                      <span className="font-semibold text-green-800">{config.theme || 'light'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Idioma:</span>
                      <span className="font-semibold text-green-800">{config.language || 'es'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Autoplay:</span>
                      <span className="font-semibold text-green-800">
                        {config.preferences?.autoplay ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones de limpieza */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-800">Acciones de Limpieza</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleClearCoursesCache}
                  disabled={isClearing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {isClearing ? 'Limpiando...' : 'Limpiar Caché de Cursos'}
                </button>
                
                <button
                  onClick={handleClearAllCache}
                  disabled={isClearing}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {isClearing ? 'Limpiando...' : 'Limpiar Todo el Caché'}
                </button>
                
                <button
                  onClick={handleResetConfig}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors md:col-span-2"
                >
                  <Settings className="w-4 h-4" />
                  Resetear Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado como página normal
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Gestión de Caché</h3>
      </div>
      
      {/* Estadísticas del caché */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Estadísticas del Caché</h3>
          <button
            onClick={refreshStats}
            className="ml-auto p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Actualizar estadísticas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LocalStorage */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">LocalStorage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usado:</span>
                  <span className="font-mono">{formatBytes(stats.localStorage.used)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className="font-mono">{formatBytes(stats.localStorage.total)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getUsagePercentage(stats.localStorage.used, stats.localStorage.total)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {getUsagePercentage(stats.localStorage.used, stats.localStorage.total)}% usado
                </div>
              </div>
            </div>

            {/* SessionStorage */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">SessionStorage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usado:</span>
                  <span className="font-mono">{formatBytes(stats.sessionStorage.used)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className="font-mono">{formatBytes(stats.sessionStorage.total)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getUsagePercentage(stats.sessionStorage.used, stats.sessionStorage.total)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {getUsagePercentage(stats.sessionStorage.used, stats.sessionStorage.total)}% usado
                </div>
              </div>
            </div>
          </div>
        )}

        {stats && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Total de elementos en caché:</span>
              <span className="font-semibold text-blue-800">{stats.cacheItems}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-blue-700">Cursos en caché:</span>
              <span className="font-semibold text-blue-800">
                {hasCoursesInCache() ? 'Sí' : 'No'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Configuración del usuario */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Configuración del Usuario</h3>
        </div>
        
        {config && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Tema:</span>
                <span className="font-semibold text-green-800">{config.theme || 'light'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Idioma:</span>
                <span className="font-semibold text-green-800">{config.language || 'es'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Autoplay:</span>
                <span className="font-semibold text-green-800">
                  {config.preferences?.autoplay ? 'Activado' : 'Desactivado'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acciones de limpieza */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">Acciones de Limpieza</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleClearCoursesCache}
            disabled={isClearing}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isClearing ? 'Limpiando...' : 'Limpiar Caché de Cursos'}
          </button>
          
          <button
            onClick={handleClearAllCache}
            disabled={isClearing}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {isClearing ? 'Limpiando...' : 'Limpiar Todo el Caché'}
          </button>
          
          <button
            onClick={handleResetConfig}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors md:col-span-2"
          >
            <Settings className="w-4 h-4" />
            Resetear Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default CacheManager;