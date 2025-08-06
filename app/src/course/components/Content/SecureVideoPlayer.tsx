import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Loader2, AlertCircle } from 'lucide-react';
import { videoService, VideoMetadata } from '@/course/services/videoService';

interface SecureVideoPlayerProps {
  contentFileId: string; // Cambiado de fileId a contentFileId para mayor seguridad
  title?: string;
  className?: string;
  autoPlay?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
}

function SecureVideoPlayer({ 
  contentFileId, 
  title = 'Video', 
  className = '',
  autoPlay = false,
  onLoadStart,
  onLoadEnd,
  onError 
}: SecureVideoPlayerProps) {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<{ type: string; reason: string } | null>(null);
  
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

      } catch (err: any) {
        const errorMessage = err.message || 'Error al cargar el video';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
        onLoadEnd?.();
      }
    };

    if (contentFileId) {
      initializeVideo();
    }
  }, [contentFileId, onLoadStart, onLoadEnd, onError]);

  const handlePlayerError = (error: any) => {
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
    return (
      <div className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Cargando video seguro...</p>
        </div>
      </div>
    );
  }

  if (error || !metadata || !streamUrl) {
    return (
      <div className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center space-y-3 text-center p-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-600">{error || 'Error al cargar el video'}</p>
          {/* Botón de debug temporal */}
          <button
            onClick={() => {
              const debugUrl = videoService.getSecureStreamUrl(contentFileId);
              console.log('🔗 URL de prueba:', debugUrl);
              window.open(debugUrl, '_blank');
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Probar URL manualmente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>

      {/* React Player */}
      <ReactPlayer
        url={streamUrl}
        playing={autoPlay}
        controls={true}
        width="100%"
        height="100%"
        style={{ aspectRatio: '16/9' }}
        onError={handlePlayerError}
        config={{
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
        }}
      />
    </div>
  );
}

export default SecureVideoPlayer;
