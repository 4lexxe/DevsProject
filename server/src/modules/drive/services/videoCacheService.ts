import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { createDriveClient } from '../config/driveConfig';
import { drive_v3 } from 'googleapis';

export interface CachedVideoResult {
  success: boolean;
  filePath?: string;
  contentType?: string;
  size?: number;
  error?: string;
  isDownloading?: boolean;
}

/**
 * Servicio para cache completo de videos de Google Drive
 */
export class VideoCacheService {
  private drive: drive_v3.Drive;
  private cacheDir: string;
  private downloadingFiles: Set<string> = new Set(); // Para evitar descargas simultáneas
  
  constructor() {
    this.drive = createDriveClient();
    this.cacheDir = path.join(process.cwd(), 'cache', 'videos');
    this.ensureCacheDir();
    this.setupCleanupHandlers();
  }

  /**
   * Configura los handlers para limpiar cache al cerrar el servidor
   */
  private setupCleanupHandlers(): void {
    const cleanup = async () => {
      console.log('🧹 Limpiando cache antes de cerrar el servidor...');
      await this.clearAllCache();
      process.exit(0);
    };

    // Limpiar cache al reiniciar/cerrar el servidor
    process.on('SIGINT', cleanup);  // Ctrl+C
    process.on('SIGTERM', cleanup); // Terminación del proceso
    process.on('SIGUSR2', cleanup); // Reinicio con nodemon
    
    // Limpiar cache al iniciar el servidor
    this.clearAllCache().then(() => {
      console.log('🔄 Cache limpiado al iniciar el servidor');
    }).catch((error) => {
      console.error('❌ Error al limpiar cache inicial:', error);
    });
  }

  /**
   * Asegura que el directorio de cache existe
   */
  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Genera ruta del archivo en cache
   */
  private getCachePath(fileId: string, mimeType: string): string {
    const extension = this.getExtensionFromMimeType(mimeType);
    return path.join(this.cacheDir, `${fileId}${extension}`);
  }

  /**
   * Obtiene extensión desde MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: { [key: string]: string } = {
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/ogg': '.ogg',
      'video/avi': '.avi',
      'video/mov': '.mov',
      'video/wmv': '.wmv',
      'video/mkv': '.mkv',
      'video/x-matroska': '.mkv'
    };
    return mimeToExt[mimeType] || '.mp4';
  }

  /**
   * Verifica si el video está en cache
   */
  async isVideoCached(fileId: string, mimeType: string): Promise<boolean> {
    const cachePath = this.getCachePath(fileId, mimeType);
    return fs.existsSync(cachePath);
  }

  /**
   * Obtiene tamaño del archivo en cache
   */
  async getCachedVideoSize(fileId: string, mimeType: string): Promise<number> {
    const cachePath = this.getCachePath(fileId, mimeType);
    if (fs.existsSync(cachePath)) {
      const stats = fs.statSync(cachePath);
      return stats.size;
    }
    return 0;
  }

  /**
   * Descarga video completo de Google Drive al cache
   */
  async downloadVideoToCache(fileId: string, mimeType: string, totalSize: number): Promise<CachedVideoResult> {
    try {
      // Verificar si ya está descargando
      if (this.downloadingFiles.has(fileId)) {
        return {
          success: false,
          isDownloading: true,
          error: 'Video ya está siendo descargado'
        };
      }

      const cachePath = this.getCachePath(fileId, mimeType);

      // Verificar si ya existe en cache
      if (await this.isVideoCached(fileId, mimeType)) {
        const cachedSize = await this.getCachedVideoSize(fileId, mimeType);
        if (cachedSize === totalSize) {
          console.log(`✅ Video ya en cache: ${fileId}`);
          return {
            success: true,
            filePath: cachePath,
            contentType: mimeType,
            size: cachedSize
          };
        } else {
          // Archivo corrupto o incompleto, borrar y re-descargar
          fs.unlinkSync(cachePath);
          console.log(`🗑️ Archivo corrupto eliminado: ${fileId}`);
        }
      }

      // Marcar como descargando
      this.downloadingFiles.add(fileId);

      // Crear stream de descarga desde Google Drive
      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, {
        responseType: 'stream'
      });

      // Crear write stream al archivo local
      const writeStream = fs.createWriteStream(cachePath);
      const driveStream = response.data as Readable;

      // Pipe con promesa
      await new Promise<void>((resolve, reject) => {
        let downloadedBytes = 0;
        
        driveStream.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          const progress = ((downloadedBytes / totalSize) * 100).toFixed(1);
        });

        driveStream.on('error', (error) => {
          console.error(`❌ Error en descarga de ${fileId}:`, error);
          // Limpiar archivo parcial
          if (fs.existsSync(cachePath)) {
            fs.unlinkSync(cachePath);
          }
          reject(error);
        });

        writeStream.on('error', (error) => {
          console.error(`❌ Error escribiendo ${fileId}:`, error);
          reject(error);
        });

        writeStream.on('finish', () => {
          console.log(`✅ Descarga completa: ${fileId}`);
          resolve();
        });

        driveStream.pipe(writeStream);
      });

      // Verificar tamaño final
      const finalSize = await this.getCachedVideoSize(fileId, mimeType);
      if (finalSize !== totalSize) {
        // Eliminar archivo incompleto
        fs.unlinkSync(cachePath);
        throw new Error(`Tamaño incorrecto: esperado ${totalSize}, obtenido ${finalSize}`);
      }

      console.log(`🎉 Video cacheado exitosamente: ${fileId} (${(finalSize / 1024 / 1024).toFixed(2)} MB)`);

      return {
        success: true,
        filePath: cachePath,
        contentType: mimeType,
        size: finalSize
      };

    } catch (error: any) {
      console.error(`❌ Error al descargar video ${fileId}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      // Remover de lista de descarga
      this.downloadingFiles.delete(fileId);
    }
  }

  /**
   * Obtiene video desde cache (si existe) o lo descarga
   */
  async getCachedVideo(fileId: string, mimeType: string, totalSize: number): Promise<CachedVideoResult> {
    try {
      // Verificar cache primero
      if (await this.isVideoCached(fileId, mimeType)) {
        const cachePath = this.getCachePath(fileId, mimeType);
        const cachedSize = await this.getCachedVideoSize(fileId, mimeType);
        
        if (cachedSize === totalSize) {
          return {
            success: true,
            filePath: cachePath,
            contentType: mimeType,
            size: cachedSize
          };
        }
      }

      // No está en cache, descargar
      return await this.downloadVideoToCache(fileId, mimeType, totalSize);

    } catch (error: any) {
      console.error(`❌ Error al obtener video cacheado ${fileId}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Limpia un video específico del cache
   */
  async clearVideoFromCache(fileId: string, mimeType: string): Promise<boolean> {
    try {
      const cachePath = this.getCachePath(fileId, mimeType);
      if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
        console.log(`🗑️ Video eliminado del cache: ${fileId}`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(`❌ Error al eliminar video del cache ${fileId}:`, error.message);
      return false;
    }
  }

  /**
   * Obtiene información del cache
   */
  async getCacheInfo(): Promise<{ totalFiles: number; totalSize: number; files: string[] }> {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }

      return {
        totalFiles: files.length,
        totalSize,
        files
      };
    } catch (error: any) {
      console.error('❌ Error al obtener info del cache:', error.message);
      return { totalFiles: 0, totalSize: 0, files: [] };
    }
  }

  /**
   * Limpia todo el cache
   */
  async clearAllCache(): Promise<boolean> {
    try {
      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        fs.unlinkSync(filePath);
      }
      console.log(`🧹 Cache completo limpiado: ${files.length} archivos eliminados`);
      return true;
    } catch (error: any) {
      console.error('❌ Error al limpiar cache:', error.message);
      return false;
    }
  }
}

export const videoCacheService = new VideoCacheService();
