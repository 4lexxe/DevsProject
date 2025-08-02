import { drive_v3, google } from 'googleapis';
import { Readable } from 'stream';
import { createDriveClient, driveConfig, validateDriveConfig } from '../config/driveConfig';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink?: string;
  createdTime: string;
  modifiedTime: string;
  parents?: string[];
  description?: string;
}

export interface UploadFileOptions {
  name: string;
  description?: string;
  folderId?: string;
  makePublic?: boolean;
}

export interface UpdateFileOptions {
  name?: string;
  description?: string;
  folderId?: string;
}

export interface FileUploadResult {
  success: boolean;
  file?: DriveFile;
  error?: string;
  shareableLink?: string;
}

/**
 * Servicio para manejar operaciones con Google Drive API
 */
export class DriveService {
  private drive: drive_v3.Drive;

  constructor() {
    // Validar configuración al crear instancia
    const validation = validateDriveConfig();
    if (!validation.isValid) {
      throw new Error(
        `Google Drive no está configurado correctamente. Variables faltantes: ${validation.missingVars.join(', ')}`
      );
    }

    this.drive = createDriveClient();
  }

  /**
   * Sube un archivo a Google Drive
   * @param fileBuffer - Buffer del archivo
   * @param mimeType - Tipo MIME del archivo
   * @param options - Opciones de subida
   * @returns Resultado de la subida
   */
  async uploadFile(
    fileBuffer: Buffer,
    mimeType: string,
    options: UploadFileOptions
  ): Promise<FileUploadResult> {
    try {
      const fileStream = new Readable();
      fileStream.push(fileBuffer);
      fileStream.push(null);

      const fileMetadata: any = {
        name: options.name,
        description: options.description,
      };

      // Si se especifica una carpeta, mover el archivo ahí
      if (options.folderId || driveConfig.folderId) {
        fileMetadata.parents = [options.folderId || driveConfig.folderId];
      }

      const media = {
        mimeType,
        body: fileStream,
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,parents,description',
      });

      if (!response.data.id) {
        return {
          success: false,
          error: 'No se pudo obtener el ID del archivo subido'
        };
      }

      let shareableLink: string | undefined;

      // Hacer público si se solicita
      if (options.makePublic) {
        const publicLink = await this.makeFilePublic(response.data.id);
        shareableLink = publicLink || undefined;
      }

      const driveFile: DriveFile = {
        id: response.data.id,
        name: response.data.name || options.name,
        mimeType: response.data.mimeType || mimeType,
        size: response.data.size || '0',
        webViewLink: response.data.webViewLink || '',
        webContentLink: response.data.webContentLink || '',
        thumbnailLink: response.data.thumbnailLink || undefined,
        createdTime: response.data.createdTime || new Date().toISOString(),
        modifiedTime: response.data.modifiedTime || new Date().toISOString(),
        parents: response.data.parents || undefined,
        description: response.data.description || undefined,
      };

      return {
        success: true,
        file: driveFile,
        shareableLink: shareableLink || driveFile.webViewLink
      };

    } catch (error: any) {
      console.error('Error al subir archivo a Drive:', error);
      return {
        success: false,
        error: error.message || 'Error desconocido al subir archivo'
      };
    }
  }

  /**
   * Obtiene información de un archivo por su ID
   * @param fileId - ID del archivo en Drive
   * @returns Información del archivo
   */
  async getFile(fileId: string): Promise<DriveFile | null> {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,parents,description',
      });

      if (!response.data.id) {
        return null;
      }

      return {
        id: response.data.id,
        name: response.data.name || 'Sin nombre',
        mimeType: response.data.mimeType || 'application/octet-stream',
        size: response.data.size || '0',
        webViewLink: response.data.webViewLink || '',
        webContentLink: response.data.webContentLink || '',
        thumbnailLink: response.data.thumbnailLink || undefined,
        createdTime: response.data.createdTime || new Date().toISOString(),
        modifiedTime: response.data.modifiedTime || new Date().toISOString(),
        parents: response.data.parents || undefined,
        description: response.data.description || undefined,
      };

    } catch (error: any) {
      console.error('Error al obtener archivo de Drive:', error);
      return null;
    }
  }

  /**
   * Actualiza metadatos de un archivo
   * @param fileId - ID del archivo
   * @param options - Nuevos metadatos
   * @returns Archivo actualizado
   */
  async updateFile(fileId: string, options: UpdateFileOptions): Promise<DriveFile | null> {
    try {
      const updateData: any = {};

      if (options.name) updateData.name = options.name;
      if (options.description !== undefined) updateData.description = options.description;
      if (options.folderId) updateData.parents = [options.folderId];

      const response = await this.drive.files.update({
        fileId,
        requestBody: updateData,
        fields: 'id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,parents,description',
      });

      if (!response.data.id) {
        return null;
      }

      return {
        id: response.data.id,
        name: response.data.name || 'Sin nombre',
        mimeType: response.data.mimeType || 'application/octet-stream',
        size: response.data.size || '0',
        webViewLink: response.data.webViewLink || '',
        webContentLink: response.data.webContentLink || '',
        thumbnailLink: response.data.thumbnailLink || undefined,
        createdTime: response.data.createdTime || new Date().toISOString(),
        modifiedTime: response.data.modifiedTime || new Date().toISOString(),
        parents: response.data.parents || undefined,
        description: response.data.description || undefined,
      };

    } catch (error: any) {
      console.error('Error al actualizar archivo de Drive:', error);
      return null;
    }
  }

  /**
   * Elimina un archivo de Google Drive
   * @param fileId - ID del archivo a eliminar
   * @returns true si se eliminó correctamente
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.drive.files.delete({
        fileId,
      });
      return true;
    } catch (error: any) {
      console.error('Error al eliminar archivo de Drive:', error);
      return false;
    }
  }

  /**
   * Hace un archivo público y devuelve el enlace compartible
   * @param fileId - ID del archivo
   * @returns Enlace público del archivo
   */
  async makeFilePublic(fileId: string): Promise<string | null> {
    try {
      // Crear permiso público de lectura
      await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Obtener el enlace compartible
      const file = await this.drive.files.get({
        fileId,
        fields: 'webViewLink,webContentLink',
      });

      return file.data.webViewLink || file.data.webContentLink || null;

    } catch (error: any) {
      console.error('Error al hacer archivo público:', error);
      return null;
    }
  }

  /**
   * Revoca el acceso público de un archivo
   * @param fileId - ID del archivo
   * @returns true si se revocó correctamente
   */
  async makeFilePrivate(fileId: string): Promise<boolean> {
    try {
      // Obtener permisos actuales
      const permissions = await this.drive.permissions.list({
        fileId,
      });

      // Eliminar permisos públicos
      const publicPermissions = permissions.data.permissions?.filter(
        permission => permission.type === 'anyone'
      );

      if (publicPermissions) {
        for (const permission of publicPermissions) {
          if (permission.id) {
            await this.drive.permissions.delete({
              fileId,
              permissionId: permission.id,
            });
          }
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error al hacer archivo privado:', error);
      return false;
    }
  }

  /**
   * Lista archivos en una carpeta específica
   * @param folderId - ID de la carpeta (opcional)
   * @param pageSize - Número de archivos por página
   * @param pageToken - Token de página para paginación
   * @returns Lista de archivos
   */
  async listFiles(
    folderId?: string,
    pageSize: number = 10,
    pageToken?: string
  ): Promise<{
    files: DriveFile[];
    nextPageToken?: string;
    totalCount?: number;
  }> {
    try {
      let query = "trashed=false";
      
      if (folderId) {
        query += ` and '${folderId}' in parents`;
      } else if (driveConfig.folderId) {
        query += ` and '${driveConfig.folderId}' in parents`;
      }

      const response = await this.drive.files.list({
        q: query,
        pageSize,
        pageToken,
        fields: 'nextPageToken,files(id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,parents,description)',
        orderBy: 'modifiedTime desc',
      });

      const files: DriveFile[] = response.data.files?.map(file => ({
        id: file.id || '',
        name: file.name || 'Sin nombre',
        mimeType: file.mimeType || 'application/octet-stream',
        size: file.size || '0',
        webViewLink: file.webViewLink || '',
        webContentLink: file.webContentLink || '',
        thumbnailLink: file.thumbnailLink || undefined,
        createdTime: file.createdTime || new Date().toISOString(),
        modifiedTime: file.modifiedTime || new Date().toISOString(),
        parents: file.parents || undefined,
        description: file.description || undefined,
      })) || [];

      return {
        files,
        nextPageToken: response.data.nextPageToken || undefined,
      };

    } catch (error: any) {
      console.error('Error al listar archivos de Drive:', error);
      return {
        files: [],
      };
    }
  }

  /**
   * Busca archivos por nombre
   * @param searchTerm - Término de búsqueda
   * @param pageSize - Número de resultados por página
   * @returns Lista de archivos encontrados
   */
  async searchFiles(
    searchTerm: string,
    pageSize: number = 10
  ): Promise<DriveFile[]> {
    try {
      let query = `name contains '${searchTerm}' and trashed=false`;
      
      if (driveConfig.folderId) {
        query += ` and '${driveConfig.folderId}' in parents`;
      }

      const response = await this.drive.files.list({
        q: query,
        pageSize,
        fields: 'files(id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,parents,description)',
        orderBy: 'relevance,modifiedTime desc',
      });

      return response.data.files?.map(file => ({
        id: file.id || '',
        name: file.name || 'Sin nombre',
        mimeType: file.mimeType || 'application/octet-stream',
        size: file.size || '0',
        webViewLink: file.webViewLink || '',
        webContentLink: file.webContentLink || '',
        thumbnailLink: file.thumbnailLink || undefined,
        createdTime: file.createdTime || new Date().toISOString(),
        modifiedTime: file.modifiedTime || new Date().toISOString(),
        parents: file.parents || undefined,
        description: file.description || undefined,
      })) || [];

    } catch (error: any) {
      console.error('Error al buscar archivos en Drive:', error);
      return [];
    }
  }

  /**
   * Crea una carpeta en Google Drive
   * @param name - Nombre de la carpeta
   * @param parentFolderId - ID de la carpeta padre
   * @returns ID de la carpeta creada
   */
  async createFolder(name: string, parentFolderId?: string): Promise<string | null> {
    try {
      const fileMetadata: any = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
      };

      if (parentFolderId || driveConfig.folderId) {
        fileMetadata.parents = [parentFolderId || driveConfig.folderId];
      }

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });

      return response.data.id || null;

    } catch (error: any) {
      console.error('Error al crear carpeta en Drive:', error);
      return null;
    }
  }

  /**
   * Mueve un archivo a otra carpeta
   * @param fileId - ID del archivo
   * @param newFolderId - ID de la nueva carpeta
   * @returns true si se movió correctamente
   */
  async moveFile(fileId: string, newFolderId: string): Promise<boolean> {
    try {
      // Obtener padres actuales
      const file = await this.drive.files.get({
        fileId,
        fields: 'parents',
      });

      const previousParents = file.data.parents?.join(',') || '';

      // Mover archivo
      await this.drive.files.update({
        fileId,
        addParents: newFolderId,
        removeParents: previousParents,
      });

      return true;
    } catch (error: any) {
      console.error('Error al mover archivo en Drive:', error);
      return false;
    }
  }

  /**
   * Obtiene información de uso del espacio de Drive
   * @returns Información del espacio usado
   */
  async getStorageInfo(): Promise<{
    limit: string;
    usage: string;
    usageInDrive: string;
  } | null> {
    try {
      const response = await this.drive.about.get({
        fields: 'storageQuota',
      });

      const quota = response.data.storageQuota;
      if (!quota) return null;

      return {
        limit: quota.limit || '0',
        usage: quota.usage || '0',
        usageInDrive: quota.usageInDrive || '0',
      };

    } catch (error: any) {
      console.error('Error al obtener información de almacenamiento:', error);
      return null;
    }
  }
}

export default DriveService;
