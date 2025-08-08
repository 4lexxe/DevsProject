import api from '@/shared/api/axios';
/**
 * Servicio para manejar videos a través del proxy seguro (oculta URLs de Drive)
 * Ahora usa contentFileId para mayor seguridad en lugar de driveFileId
 */
class VideoService {
    /**
     * Obtiene metadatos del video sin exponer URL de Drive
     * @param contentFileId UUID del ContentFile (no driveFileId)
     */
    async getVideoMetadata(contentFileId) {
        try {
            const response = await api.get(`/video/metadata/${contentFileId}`);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        }
        catch (error) {
            console.error('❌ Error al obtener metadatos del video:', error);
            return null;
        }
    }
    /**
     * Prueba la conectividad con el servidor de proxy
     */
    async testConnection() {
        try {
            const response = await api.get('/video/test');
            return response.data.success;
        }
        catch (error) {
            console.error('❌ Error de conexión con el proxy:', error);
            return false;
        }
    }
    /**
     * Genera URL del proxy híbrido (decide automáticamente entre cache y streaming)
     * @param contentFileId UUID del ContentFile
     * @param userCount Número de usuarios viendo el video (opcional)
     */
    getHybridStreamUrl(contentFileId, userCount) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const queryParams = userCount ? `?userCount=${userCount}` : '';
        const fullUrl = `${baseUrl}/video/hybrid/${contentFileId}${queryParams}`;
        return fullUrl;
    }
    /**
     * Genera URL del proxy para streaming seguro
     * @param contentFileId UUID del ContentFile
     */
    getSecureStreamUrl(contentFileId) {
        // Usar la URL base de la configuración de axios sin duplicar /api
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const fullUrl = `${baseUrl}/video/stream/${contentFileId}`;
        return fullUrl;
    }
    /**
     * Obtiene URL de cache forzado
     * @param contentFileId UUID del ContentFile
     */
    getCacheStreamUrl(contentFileId) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const fullUrl = `${baseUrl}/video/cache/${contentFileId}`;
        return fullUrl;
    }
    /**
     * Analiza qué estrategia usaría el sistema híbrido
     * @param contentFileId UUID del ContentFile
     * @param userCount Número de usuarios viendo el video (opcional)
     */
    async analyzeStrategy(contentFileId, userCount) {
        try {
            const queryParams = userCount ? `?userCount=${userCount}` : '';
            const response = await api.get(`/video/analyze/${contentFileId}${queryParams}`);
            return response.data;
        }
        catch (error) {
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
    async getHybridStats() {
        try {
            const response = await api.get('/video/hybrid-stats');
            return response.data;
        }
        catch (error) {
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
    async preloadPopularVideos(videos) {
        try {
            const response = await api.post('/video/preload-popular', { videos });
            return response.data;
        }
        catch (error) {
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
    async getCacheInfo() {
        try {
            const response = await api.get('/video/cache-info');
            return response.data;
        }
        catch (error) {
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
    isVideoFile(mimeType) {
        return mimeType.startsWith('video/');
    }
    /**
     * Formatea la duración del video de milisegundos a formato legible
     */
    formatDuration(durationMs) {
        if (!durationMs)
            return 'Duración desconocida';
        const totalSeconds = Math.floor(parseInt(durationMs) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}
export const videoService = new VideoService();
