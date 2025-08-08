import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Loader2, AlertCircle } from 'lucide-react';
import { videoService } from '@/course/services/videoService';
function SecureVideoPlayer({ contentFileId, title = 'Video', className = '', autoPlay = false, onLoadStart, onLoadEnd, onError }) {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    const [strategy, setStrategy] = useState(null);
    // Verificar acceso y cargar metadatos
    useEffect(() => {
        const initializeVideo = async () => {
            try {
                setLoading(true);
                onLoadStart?.();
                // Primero probar la conexión con el servidor
                const connectionOk = await videoService.testConnection();
                if (!connectionOk) {
                    setError('No se puede conectar con el servidor de videos');
                    onError?.('No se puede conectar con el servidor de videos');
                    return;
                }
                // Obtener metadatos del video
                const videoMetadata = await videoService.getVideoMetadata(contentFileId);
                if (!videoMetadata) {
                    setError('No se pudieron cargar los metadatos del video');
                    onError?.('No se pudieron cargar los metadatos del video');
                    return;
                }
                setMetadata(videoMetadata);
                // Generar URL híbrida para React Player (decide automáticamente)
                const hybridUrl = videoService.getHybridStreamUrl(contentFileId);
                setStreamUrl(hybridUrl);
                // Debug: Analizar estrategia que se usará
                const analysis = await videoService.analyzeStrategy(contentFileId);
                if (analysis.success && analysis.strategy) {
                    console.log(`📋 Estrategia recomendada: ${analysis.strategy.recommended.toUpperCase()}`);
                    console.log(`📝 Razón: ${analysis.strategy.reason}`);
                    setStrategy({
                        type: analysis.strategy.recommended,
                        reason: analysis.strategy.reason
                    });
                }
            }
            catch (err) {
                const errorMessage = err.message || 'Error al cargar el video';
                setError(errorMessage);
                onError?.(errorMessage);
            }
            finally {
                setLoading(false);
                onLoadEnd?.();
            }
        };
        if (contentFileId) {
            initializeVideo();
        }
    }, [contentFileId, onLoadStart, onLoadEnd, onError]);
    const handlePlayerError = (error) => {
        console.error('❌ Error en React Player:', error);
        // Obtener más detalles del error del elemento video
        if (error?.target) {
            const videoElement = error.target;
            console.error('📊 Estado del video:', {
                networkState: videoElement.networkState,
                readyState: videoElement.readyState,
                error: videoElement.error,
                src: videoElement.src,
                currentSrc: videoElement.currentSrc
            });
            // Analizar el tipo de error específico
            if (videoElement.error) {
                const errorCode = videoElement.error.code;
                const errorMessage = videoElement.error.message;
                console.error(`📍 Error específico: Código ${errorCode} - ${errorMessage}`);
                let userFriendlyError = 'Error al reproducir el video';
                switch (errorCode) {
                    case 1: // MEDIA_ERR_ABORTED
                        userFriendlyError = 'Reproducción abortada por el usuario';
                        break;
                    case 2: // MEDIA_ERR_NETWORK
                        userFriendlyError = 'Error de red al cargar el video';
                        break;
                    case 3: // MEDIA_ERR_DECODE
                        userFriendlyError = 'Error al decodificar el video (formato no compatible)';
                        break;
                    case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                        userFriendlyError = 'Formato de video no soportado';
                        break;
                    default:
                        userFriendlyError = `Error desconocido (${errorCode}): ${errorMessage}`;
                }
                setError(userFriendlyError);
                onError?.(userFriendlyError);
                return;
            }
        }
        setError('Error al reproducir el video');
        onError?.('Error al reproducir el video');
    };
    // Estados de carga y error
    if (loading) {
        return (_jsx("div", { className: `aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`, children: _jsxs("div", { className: "flex flex-col items-center space-y-3", children: [_jsx(Loader2, { className: "w-8 h-8 text-blue-600 animate-spin" }), _jsx("p", { className: "text-sm text-gray-600", children: "Cargando video seguro..." })] }) }));
    }
    if (error || !metadata || !streamUrl) {
        return (_jsx("div", { className: `aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`, children: _jsxs("div", { className: "flex flex-col items-center space-y-3 text-center p-6", children: [_jsx(AlertCircle, { className: "w-8 h-8 text-red-500" }), _jsx("p", { className: "text-sm text-red-600", children: error || 'Error al cargar el video' }), _jsx("button", { onClick: () => {
                            const debugUrl = videoService.getSecureStreamUrl(contentFileId);
                            console.log('🔗 URL de prueba:', debugUrl);
                            window.open(debugUrl, '_blank');
                        }, className: "mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600", children: "Probar URL manualmente" })] }) }));
    }
    return (_jsx("div", { className: `relative bg-black rounded-lg overflow-hidden ${className}`, children: _jsx(ReactPlayer, { url: streamUrl, playing: autoPlay, controls: true, width: "100%", height: "100%", style: { aspectRatio: '16/9' }, onError: handlePlayerError, config: {
                file: {
                    attributes: {
                        crossOrigin: 'use-credentials',
                        preload: 'metadata',
                    },
                    forceVideo: true,
                    forceAudio: false,
                    forceHLS: false,
                    forceDASH: false
                },
            } }) }));
}
export default SecureVideoPlayer;
