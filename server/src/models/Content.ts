import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Section from './Section'; // Relación con la sección

class Content extends Model {
  public id!: number;
  public type!: string; // Tipo de contenido (texto, video, imagen, archivo, etc.)
  public contentText?: string; // Texto, markdown, etc.
  public contentVideo?: string; // URL de video
  public contentImage?: string; // URL de imagen
  public contentFile?: string; // URL de archivo (PDF, DOC, etc.)
  public externalLink?: string; // URL externa (enlace opcional)
  public duration?: number; // Duración en minutos (para videos o lecciones)
  public position?: number; // Orden del contenido dentro de la sección
  public sectionId!: number; // Relación con la sección
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentText: {
      type: DataTypes.TEXT, // Para contenido de texto o markdown
      allowNull: true,
    },
    contentVideo: {
      type: DataTypes.STRING, // Para almacenar la URL del video
      allowNull: true,
    },
    contentImage: {
      type: DataTypes.STRING, // Para almacenar la URL de la imagen
      allowNull: true,
    },
    contentFile: {
      type: DataTypes.STRING, // Para almacenar la URL del archivo
      allowNull: true,
    },
    externalLink: {
      type: DataTypes.STRING, // Enlace externo opcional
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER, // Duración en minutos
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER, // Para definir el orden dentro de la sección
      allowNull: true,
    },
    sectionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sections',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'contents',
    modelName: 'Content',
    timestamps: true,
  }
);

// Relación con la sección
Content.belongsTo(Section, { foreignKey: 'sectionId' });

export default Content;