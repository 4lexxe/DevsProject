import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Content from "./Content";

type fileType = "video" | "audio" | "document" | "image" | "pdf" | "presentation" | "spreadsheet" | "code" | "archive" | "other";

interface ContentFilesAttributes {
  id: bigint;
  contentId: bigint;
  fileName: string;
  originalName: string;
  fileType: fileType;
  fileSize: number; // Tamaño en bytes
  mimeType: string;
  driveFileId: string; // ID del archivo en Google Drive
  driveUrl: string; // URL de visualización/descarga de Google Drive
  driveWebViewLink?: string; // URL para vista web del archivo
  driveWebContentLink?: string; // URL de descarga directa
  description?: string;
  isPublic: boolean; // Si el archivo es público o privado
  uploadedBy: bigint; // ID del admin que subió el archivo
  position: number; // Orden de los archivos en el contenido
  createdAt: Date;
  updatedAt: Date;
}

interface ContentFilesCreationAttributes extends Optional<ContentFilesAttributes, 'id' | 'driveWebViewLink' | 'driveWebContentLink' | 'description' | 'createdAt' | 'updatedAt'> {}

class ContentFiles extends Model<ContentFilesAttributes, ContentFilesCreationAttributes> implements ContentFilesAttributes {
  public id!: bigint;
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
  public description?: string;
  public isPublic!: boolean;
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
    return `https://drive.google.com/file/d/${this.driveFileId}/preview`;
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
}

ContentFiles.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
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
        fields: ['isPublic'],
      },
      {
        fields: ['position'],
      },
      {
        fields: ['contentId', 'position'],
        name: 'content_files_order',
      },
    ],
    hooks: {
      beforeValidate: (contentFile: ContentFiles) => {
        // Determinar el tipo de archivo basado en el mimeType si no se especifica
        if (!contentFile.fileType && contentFile.mimeType) {
          if (contentFile.mimeType.startsWith('video/')) {
            contentFile.fileType = 'video';
          } else if (contentFile.mimeType.startsWith('audio/')) {
            contentFile.fileType = 'audio';
          } else if (contentFile.mimeType.startsWith('image/')) {
            contentFile.fileType = 'image';
          } else if (contentFile.mimeType === 'application/pdf') {
            contentFile.fileType = 'pdf';
          } else if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(contentFile.mimeType)) {
            contentFile.fileType = 'document';
          } else if (['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(contentFile.mimeType)) {
            contentFile.fileType = 'presentation';
          } else if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(contentFile.mimeType)) {
            contentFile.fileType = 'spreadsheet';
          } else if (contentFile.mimeType.includes('zip') || contentFile.mimeType.includes('rar') || contentFile.mimeType.includes('tar')) {
            contentFile.fileType = 'archive';
          } else {
            contentFile.fileType = 'other';
          }
        }
      },
    },
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
