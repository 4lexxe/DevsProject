import { drive_v3, google } from "googleapis";
import { Readable } from "stream";
import { createDriveClient, driveConfig } from "../config/driveConfig";
import fs from 'fs';

export interface UploadFileOptions {
  name: string;
  description?: string;
  parents?: string[];
}

export interface DriveFileResult {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
}

export interface UploadResult {
  success: boolean;
  file?: DriveFileResult;
  error?: string;
  shareableLink?: string;
}

/**
 * Servicio para interactuar con Google Drive API
 */
export default class DriveService {
  private drive: drive_v3.Drive;

  constructor() {
    this.drive = createDriveClient();
  }

  /**
   * Sube un archivo desde una ruta temporal usando fs.createReadStream
   */
  async uploadFileFromPath(filePath: string, mimeType: string, options: UploadFileOptions): Promise<UploadResult> {
    try {
      console.log(`📤 Subiendo archivo desde: ${filePath}`);
      
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo no encontrado: ${filePath}`);
      }

      // Obtener información del archivo para debug
      const fileStats = fs.statSync(filePath);
      console.log(`📋 Info del archivo: Tamaño: ${fileStats.size} bytes, Modificado: ${fileStats.mtime}`);

      // Preparar metadata del archivo
      const fileMetadata: drive_v3.Schema$File = {
        name: options.name,
        description: options.description,
        parents: options.parents || (driveConfig.folderId ? [driveConfig.folderId] : undefined)
      };

      // Verificar configuración de Drive
      console.log(`🔧 Drive Config: folderId=${driveConfig.folderId}, hasParents=${!!fileMetadata.parents}`);

      // Preparar el media con stream del archivo
      const media = {
        mimeType: mimeType,
        body: fs.createReadStream(filePath)
      };

      console.log(`📊 Subiendo a Drive: ${options.name} (${mimeType})`);

      // Agregar timeout y verificación adicional
      const uploadPromise = this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink'
      });

      const response = await uploadPromise;

      const driveFile = response.data;
      console.log("✅ Response datos subido exitosamente: ", driveFile);
      
      if (!driveFile.id) {
        throw new Error('No se pudo obtener el ID del archivo subido');
      }

      console.log(`✅ Archivo subido exitosamente: ${driveFile.name} (ID: ${driveFile.id})`);

      // Hacer público automáticamente (solo vista, sin descarga)
      let shareableLink: string | undefined;
      try {
        const publicResult = await this.makeFilePublic(driveFile.id);
        if (publicResult.success && publicResult.shareableLink) {
          shareableLink = publicResult.shareableLink;
        }
      } catch (publicError: any) {
        console.warn(`⚠️ No se pudo hacer público el archivo ${driveFile.id}:`, publicError.message);
        // Continuar sin hacer público
      }

      return {
        success: true,
        file: {
          id: driveFile.id,
          name: driveFile.name || options.name,
          mimeType: driveFile.mimeType || mimeType,
          size: driveFile.size || undefined,
          webViewLink: driveFile.webViewLink || undefined,
          webContentLink: undefined, // Nunca permitir descarga directa con restricciones máximas
          thumbnailLink: driveFile.thumbnailLink || undefined
        },
        shareableLink
      };

    } catch (error: any) {
      console.log("⚠️ Error durante la subida, verificando si el archivo se subió:", error.message);
      
      // Si el error es 500 pero el archivo podría haberse subido, intentar recuperarlo
      if (error.status === 500 || error.code === 500) {
        console.log("🔍 Error 500 detectado, intentando recuperar archivo subido...");
        
        try {
          // Buscar archivos recientes con el mismo nombre en la carpeta
          const searchResult = await this.drive.files.list({
            q: `name='${options.name}' and parents in '${driveConfig.folderId}'`,
            orderBy: 'createdTime desc',
            pageSize: 1,
            fields: 'files(id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime)'
          });

          if (searchResult.data.files && searchResult.data.files.length > 0) {
            const recoveredFile = searchResult.data.files[0];
            console.log("✅ Archivo recuperado exitosamente:", recoveredFile);
            
            // Verificar que es un archivo reciente (último minuto)
            const fileTime = new Date(recoveredFile.createdTime || '');
            const now = new Date();
            const timeDiff = now.getTime() - fileTime.getTime();
            
            if (timeDiff < 60000) { // Menos de 1 minuto
              console.log("✅ Archivo confirmado como recién subido");
              this.makeFilePublic(recoveredFile.id!); // Hacerlo público automáticamente

              return {
                success: true,
                file: {
                  id: recoveredFile.id!,
                  name: recoveredFile.name || options.name,
                  mimeType: recoveredFile.mimeType || mimeType,
                  size: recoveredFile.size || undefined,
                  webViewLink: recoveredFile.webViewLink || undefined,
                  webContentLink: recoveredFile.webContentLink || undefined,
                  thumbnailLink: recoveredFile.thumbnailLink || undefined
                },
                shareableLink: undefined
              };
            } else {
              console.log("⚠️ El archivo encontrado es muy antiguo, no es el que acabamos de subir");
            }
          } else {
            console.log("❌ No se encontró el archivo en Drive después del error 500");
          }
        } catch (recoveryError: any) {
          console.log("❌ Error al intentar recuperar archivo:", recoveryError.message);
        }
      }

      console.error(`❌ Error al subir archivo desde ${filePath}:`, {
        message: error.message,
        code: error.code,
        status: error.status,
        statusText: error.statusText,
        response: error.response?.data,
        stack: error.stack,
        fullError: error
      });
      
      // Determinar mensaje de error más específico
      let errorMessage = 'Error desconocido al subir archivo';
      
      if (error.code) {
        errorMessage = `Error ${error.code}: ${error.message}`;
      } else if (error.status) {
        errorMessage = `HTTP ${error.status}: ${error.statusText || error.message}`;
      } else if (error.response?.data) {
        errorMessage = `API Error: ${JSON.stringify(error.response.data)}`;
      } else if (error.message && error.message !== 'Unknown Error') {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Hace un archivo público solo para visualización (sin descarga, copia ni impresión)
   */
  async makeFilePublic(fileId: string): Promise<{ success: boolean; shareableLink?: string; error?: string }> {
    try {
      console.log(`🌐 Haciendo público el archivo: ${fileId}`);

      // Verificar si ya tiene permiso público
      const existingPermissions = await this.drive.permissions.list({
        fileId: fileId,
        fields: 'permissions(id,type,role)'
      });

      // Buscar si ya existe un permiso público
      const publicPermission = existingPermissions.data.permissions?.find(
        permission => permission.type === 'anyone' && permission.role === 'reader'
      );

      if (!publicPermission) {
        // Crear permiso público de solo lectura
        await this.drive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
            allowFileDiscovery: false // No aparece en búsquedas
          },
          fields: 'id'
        });
        console.log(`✅ Permiso público creado para archivo: ${fileId}`);
      } else {
        console.log(`ℹ️ El archivo ${fileId} ya es público`);
      }

      // Aplicar restricciones específicas para ocultar botón de descarga
      await this.drive.files.update({
        fileId: fileId,
        requestBody: {
          copyRequiresWriterPermission: true,  // Bloquea copia
          viewersCanCopyContent: false,        // No permite copiar contenido
          writersCanShare: false,              // No permite compartir
          // Restricciones de descarga específicas
          downloadRestrictions: {
            itemDownloadRestriction: {
              restrictedForReaders: true,      // Bloquea descarga para lectores
              restrictedForWriters: true       // Bloquea descarga para escritores
            }
          }
        }
      });
      
      return {
        success: true,
      };

    } catch (error: any) {
      console.error(`❌ Error al hacer público el archivo ${fileId}:`, error.message);
      
      // Manejo específico de errores comunes
      let errorMessage = error.message;
      
      if (error.code === 403) {
        errorMessage = 'No tienes permisos para hacer público este archivo';
      } else if (error.code === 404) {
        errorMessage = 'Archivo no encontrado en Google Drive';
      } else if (error.code === 400) {
        errorMessage = 'Solicitud inválida para hacer público el archivo';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }


  /**
   * Elimina un archivo de Google Drive
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      console.log(`🗑️ Eliminando archivo de Drive: ${fileId}`);
      
      await this.drive.files.delete({
        fileId: fileId
      });
      
      console.log(`✅ Archivo eliminado exitosamente: ${fileId}`);
      return true;

    } catch (error: any) {
      console.error(`❌ Error al eliminar archivo ${fileId}:`, error.message);
      
      // Si el archivo no existe, considerarlo como "eliminado exitosamente"
      if (error.code === 404) {
        console.log(`ℹ️ Archivo ${fileId} no encontrado en Drive, considerado como eliminado`);
        return true;
      }
      
      return false;
    }
  }

  /**
   * Aplica restricciones máximas a un archivo existente
   */
  async applyMaximumRestrictionsToFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔒 Aplicando restricciones máximas a archivo existente: ${fileId}`);

      // Aplicar todas las restricciones disponibles
      await this.applyMaximumRestrictions(fileId);

      console.log(`✅ Restricciones máximas aplicadas a archivo existente: ${fileId}`);
      return { success: true };

    } catch (error: any) {
      console.error(`❌ Error al aplicar restricciones máximas: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Método auxiliar para aplicar restricciones máximas de seguridad
   */
  private async applyMaximumRestrictions(fileId: string): Promise<void> {
    await this.drive.files.update({
      fileId: fileId,
      requestBody: {
        copyRequiresWriterPermission: true,
        viewersCanCopyContent: false,
        writersCanShare: false
      }
    });
  }
}

