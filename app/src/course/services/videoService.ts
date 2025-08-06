import api from '@/shared/api/axios';

export interface VideoMetadata {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  duration?: string;
  proxyUrl: string;
}

export interface VideoAccessResponse {
  success: boolean;
  hasAccess: boolean;
  proxyUrl?: string;
}

/**
 * Servicio para manejar videos a través del proxy seguro (oculta URLs de Drive)
 * Ahora usa contentFileId para mayor seguridad en lugar de driveFileId
 */
class VideoService {

  /**
   * Obtiene metadatos del video sin exponer URL de Drive
   * @param contentFileId UUID del ContentFile (no driveFileId)
   */
  async getVideoMetadata(contentFileId: string): Promise<VideoMetadata | null> {
    try {
      const response = await api.get(`/video/metadata/${contentFileId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Error al obtener metadatos del video:', error);
      return null;
    }
  }


  /**
   * Prueba la conectividad con el servidor de proxy
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await api.get('/video/test');
      return response.data.success;
    } catch (error: any) {
      console.error('❌ Error de conexión con el proxy:', error);
      return false;
    }
  }

  /**
   * Genera URL del proxy híbrido (decide automáticamente entre cache y streaming)
   * @param contentFileId UUID del ContentFile
   * @param userCount Número de usuarios viendo el video (opcional)
   */
  getHybridStreamUrl(contentFileId: string, userCount?: number): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const queryParams = userCount ? `?userCount=${userCount}` : '';
    const fullUrl = `${baseUrl}/video/hybrid/${contentFileId}${queryParams}`;
    
    return fullUrl;
  }

  /**
   * Genera URL del proxy para streaming seguro
   * @param contentFileId UUID del ContentFile
   */
  getSecureStreamUrl(contentFileId: string): string {
    // Usar la URL base de la configuración de axios sin duplicar /api
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}/video/stream/${contentFileId}`;
    
    return fullUrl;
  }

  /**
   * Obtiene URL de cache forzado
   * @param contentFileId UUID del ContentFile
   */
  getCacheStreamUrl(contentFileId: string): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}/video/cache/${contentFileId}`;
    
    return fullUrl;
  }

  /**
   * Analiza qué estrategia usaría el sistema híbrido
   * @param contentFileId UUID del ContentFile
   * @param userCount Número de usuarios viendo el video (opcional)
   */
  async analyzeStrategy(contentFileId: string, userCount?: number): Promise<{
    success: boolean;
    strategy?: {
      recommended: 'cache' | 'streaming';
      reason: string;
      cacheInfo?: any;
    };
    video?: any;
    error?: string;
  }> {
    try {
      const queryParams = userCount ? `?userCount=${userCount}` : '';
      const response = await api.get(`/video/analyze/${contentFileId}${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al analizar estrategia:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene estadísticas del sistema híbrido
   */
  async getHybridStats(): Promise<{
    success: boolean;
    stats?: any;
    error?: string;
  }> {
    try {
      const response = await api.get('/video/hybrid-stats');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener estadísticas híbridas:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Pre-carga videos populares basado en contentFileId
   * @param videos Array de objetos con contentFileId y userCount
   */
  async preloadPopularVideos(videos: { contentFileId: string; userCount: number }[]): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await api.post('/video/preload-popular', { videos });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al pre-cargar videos populares:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene información del cache
   */
  async getCacheInfo(): Promise<{
    success: boolean;
    cache?: any;
    error?: string;
  }> {
    try {
      const response = await api.get('/video/cache-info');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al obtener info del cache:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verifica si un archivo es un video basado en su tipo MIME
   */
  isVideoFile(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }

  /**
   * Formatea la duración del video de milisegundos a formato legible
   */
  formatDuration(durationMs?: string): string {
    if (!durationMs) return 'Duración desconocida';
    
    const totalSeconds = Math.floor(parseInt(durationMs) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const videoService = new VideoService();
