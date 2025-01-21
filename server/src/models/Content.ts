import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Section from './Section'; // Relación con la tabla "Sections"

class Content extends Model {
  public id!: number; // Identificador único del contenido
  public type!: string; // Tipo de contenido (e.g., texto, video, imagen, archivo, enlace externo)

  // Contenido de texto
  public contentText?: string; // Texto asociado al contenido, si aplica

  // Contenido de video
  public contentVideo?: string; // URL del video asociado al contenido
  public contentVideoTitle?: string; // Título o descripción del video

  // Contenido de imagen
  public contentImage?: string; // URL de la imagen asociada al contenido
  public contentImageTitle?: string; // Título o descripción de la imagen

  // Contenido de archivo
  public contentFile?: string; // URL del archivo asociado al contenido
  public contentFileTitle?: string; // Título o descripción del archivo

  // Enlace externo
  public externalLink?: string; // URL de un enlace externo asociado al contenido
  public externalLinkTitle?: string; // Título o descripción del enlace externo

  // Metadatos adicionales
  public duration?: number; // Duración del contenido (en segundos), útil para videos o audios
  public position?: number; // Posición del contenido en el orden dentro de su sección

  public sectionId!: number; // ID de la sección a la que pertenece este contenido

  public readonly createdAt!: Date; // Fecha de creación del contenido
  public readonly updatedAt!: Date; // Fecha de la última actualización del contenido
}

Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Incrementa automáticamente el ID
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false, // Este campo es obligatorio
    },
    contentText: {
      type: DataTypes.TEXT, // Soporta grandes cantidades de texto
      allowNull: true, // Opcional: solo se usa si el contenido es de tipo texto
    },
    contentVideo: {
      type: DataTypes.STRING, // URL del video
      allowNull: true, // Opcional: solo se usa si el contenido es un video
    },
    contentVideoTitle: {
      type: DataTypes.STRING, // Título del video
      allowNull: true, // Opcional
    },
    contentImage: {
      type: DataTypes.STRING, // URL de la imagen
      allowNull: true, // Opcional: solo se usa si el contenido es una imagen
    },
    contentImageTitle: {
      type: DataTypes.STRING, // Título de la imagen
      allowNull: true, // Opcional
    },
    contentFile: {
      type: DataTypes.STRING, // URL del archivo
      allowNull: true, // Opcional: solo se usa si el contenido es un archivo
    },
    contentFileTitle: {
      type: DataTypes.STRING, // Título del archivo
      allowNull: true, // Opcional
    },
    externalLink: {
      type: DataTypes.STRING, // URL de un enlace externo
      allowNull: true, // Opcional: solo se usa si el contenido es un enlace externo
    },
    externalLinkTitle: {
      type: DataTypes.STRING, // Título del enlace externo
      allowNull: true, // Opcional
    },
    duration: {
      type: DataTypes.INTEGER, // Duración en segundos
      allowNull: true, // Opcional: útil para videos o audios
    },
    position: {
      type: DataTypes.INTEGER, // Posición del contenido en su sección
      allowNull: true, // Opcional: utilizado para ordenar los contenidos
    },
    sectionId: {
      type: DataTypes.INTEGER, // Clave foránea que conecta con la tabla "Sections"
      references: {
        model: 'Sections', // Nombre de la tabla relacionada
        key: 'id', // Columna de referencia
      },
    },
  },
  {
    sequelize,
    tableName: 'Contents', // Nombre de la tabla en la base de datos
    modelName: 'Content', // Nombre del modelo en Sequelize
    timestamps: true, // Incluye columnas "createdAt" y "updatedAt"
  }
);

// Relación con Section: un contenido pertenece a una sección
Content.belongsTo(Section, { foreignKey: 'sectionId' });

export default Content;