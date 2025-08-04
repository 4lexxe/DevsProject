import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Content from "./Content";

type fileType = "video" | "audio" | "document" | "image" | "pdf" | "presentation" | "spreadsheet" | "code" | "archive" | "other";

interface ContentFilesAttributes {
  id: string; // Cambiado a string para UUID
  contentId: bigint;
  fileName: string;
  originalName: string;
  fileType: fileType;
  fileSize: number; // Tamaño en bytes
  mimeType: string;
  driveFileId: string; // ID del archivo en Google Drive
  driveUrl: string; // URL de visualización/descarga de Google Drive
  thumbnailLink?: string; // URL de la miniatura del archivo (si aplica)
  driveWebViewLink?: string; // URL para vista web del archivo
  driveWebContentLink?: string; // URL de descarga directa
  drivePreviewLink?: string; // URL de preview embebido del archivo
  description?: string;
  isPublic: boolean; // Si el archivo es público o privado
  allowDownload: boolean; // Si se permite descargar el archivo desde la preview
  uploadedBy: bigint; // ID del admin que subió el archivo
  position: number; // Orden de los archivos en el contenido
  createdAt: Date;
  updatedAt: Date;
}

interface ContentFilesCreationAttributes extends Optional<ContentFilesAttributes, 'id' | 'driveWebViewLink' | 'driveWebContentLink' | 'drivePreviewLink' | 'description' | 'createdAt' | 'updatedAt'> {}

class ContentFiles extends Model<ContentFilesAttributes, ContentFilesCreationAttributes> implements ContentFilesAttributes {
  public id!: string; // Cambiado a string para UUID
  public contentId!: bigint;
  public fileName!: string;
  public originalName!: string;
  public fileType!: fileType;
  public fileSize!: number;
  public mimeType!: string;
  public driveFileId!: string;
  public driveUrl!: string;
  public driveWebViewLink?: string;
  public driveWebContentLink?: string;
  public drivePreviewLink?: string;
  public description?: string;
  public isPublic!: boolean;
  public allowDownload!: boolean;
  public uploadedBy!: bigint;
  public position!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos de instancia para manejo de Drive
  public getDriveShareableLink(): string {
    return `https://drive.google.com/file/d/${this.driveFileId}/view?usp=sharing`;
  }

  public getDriveDirectDownloadLink(): string {
    return `https://drive.google.com/uc?id=${this.driveFileId}&export=download`;
  }

  public getDriveEmbedLink(): string {
    // Usar drivePreviewLink si está disponible, sino generar el enlace público estándar
    if (this.drivePreviewLink) {
      return this.drivePreviewLink;
    }
    // Generar enlace público de preview
    return `https://drive.google.com/file/d/${this.driveFileId}/preview?usp=sharing`;
  }

  public getFormattedFileSize(): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (this.fileSize === 0) return '0 Bytes';
    const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
    return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  public isImageFile(): boolean {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(this.mimeType);
  }

  public isVideoFile(): boolean {
    return this.mimeType.startsWith('video/');
  }

  public isDocumentFile(): boolean {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ].includes(this.mimeType);
  }

  public canBeDownloaded(): boolean {
    return this.allowDownload && !!this.driveWebContentLink;
  }

  public getAccessibleUrl(): string {
    // Si se permite descarga y hay enlace disponible, usar el enlace de descarga
    if (this.allowDownload && this.driveWebContentLink) {
      return this.driveWebContentLink;
    }
    // Solo vista/preview
    return this.getDriveEmbedLink();
  }

  public getSecureAccessInfo(): {
    canDownload: boolean;
    hasDownloadLink: boolean;
    accessUrl: string;
    accessType: 'download' | 'view-only';
    message: string;
  } {
    const hasDownloadLink = !!this.driveWebContentLink;
    const canDownload = this.allowDownload && hasDownloadLink;
    
    return {
      canDownload,
      hasDownloadLink,
      accessUrl: this.getAccessibleUrl(),
      accessType: canDownload ? 'download' : 'view-only',
      message: canDownload 
        ? 'Archivo disponible para descarga'
        : hasDownloadLink 
          ? 'Descarga deshabilitada - solo vista/preview'
          : 'Solo vista/preview disponible'
    };
  }

  /**
   * Obtiene información segura para video streaming
   */
  public getSecureVideoInfo(): {
    contentFileId: string;
    driveFileId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    isVideo: boolean;
    isPublic: boolean;
    allowDownload: boolean;
  } {
    return {
      contentFileId: this.id,
      driveFileId: this.driveFileId,
      fileName: this.fileName,
      mimeType: this.mimeType,
      fileSize: this.fileSize,
      isVideo: this.isVideoFile(),
      isPublic: this.isPublic,
      allowDownload: this.allowDownload
    };
  }
}

ContentFiles.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { 
        model: Content, 
        key: "id" 
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nombre del archivo procesado/sanitizado',
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nombre original del archivo subido por el usuario',
    },
    fileType: {
      type: DataTypes.ENUM('video', 'audio', 'document', 'image', 'pdf', 'presentation', 'spreadsheet', 'code', 'archive', 'other'),
      allowNull: false,
      comment: 'Tipo de archivo categorizado',
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Tamaño del archivo en bytes',
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tipo MIME del archivo',
    },
    driveFileId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'ID único del archivo en Google Drive',
    },
    driveUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'URL principal del archivo en Google Drive',
    },
    thumbnailLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL de la miniatura del archivo (si aplica)',
    },
    driveWebViewLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL para vista web del archivo en Google Drive',
    },
    driveWebContentLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL de descarga directa del archivo desde Google Drive',
    },
    drivePreviewLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL de preview embebido del archivo desde Google Drive',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción opcional del archivo',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indica si el archivo es público o privado',
    },
    allowDownload: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indica si se permite descargar el archivo desde la preview',
    },
    uploadedBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'ID del administrador que subió el archivo',
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Orden de visualización del archivo en el contenido',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ContentFiles",
    tableName: "ContentFiles",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['contentId'],
      },
      {
        fields: ['driveFileId'],
        unique: true,
      },
      {
        fields: ['fileType'],
      },
      {
        fields: ['position'],
      },
      {
        fields: ['contentId', 'position'],
        name: 'content_files_order',
      },
    ],
  }
);

// Relaciones
ContentFiles.belongsTo(Content, { 
  foreignKey: "contentId", 
  as: "content",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Content.hasMany(ContentFiles, { 
  foreignKey: "contentId", 
  as: "files",
});

export default ContentFiles;
export type { ContentFilesAttributes, ContentFilesCreationAttributes, fileType };
