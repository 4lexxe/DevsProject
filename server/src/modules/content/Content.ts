import { DataTypes, Model } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import Section from '../section/Section'; // Relación con la tabla "Sections"

class Content extends Model {
  public id!: number; // Identificador único del contenido
  public type!: string; // Tipo de contenido (e.g., texto, video, imagen, archivo, enlace externo, encuesta)

  // Contenido de texto
  public contentText?: string; // Texto asociado al contenido, si aplica
  public contentTextTitle?: string; // Título asociado al texto

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

  // Encuestas o cuestionarios
  public quizTitle?: string; // Título de la encuesta/cuestionario
  public quizContent?: string; // Contenido adicional en Markdown o texto normal
  public questions?: Array<{
    question: string; // Pregunta
    answers: Array<{
      answer: string; // Respuesta
      isCorrect: boolean; // Indica si es una respuesta correcta
    }>;
  }>;

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
      type: DataTypes.TEXT, // Soporta grandes cantidades de texto o Markdown
      allowNull: true, // Opcional: solo se usa si el contenido es de tipo texto
    },
    contentTextTitle: {
      type: DataTypes.STRING, // Título asociado al texto
      allowNull: true, // Opcional
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
    quizTitle: {
      type: DataTypes.STRING, // Título de la encuesta/cuestionario
      allowNull: true, // Opcional
    },
    quizContent: {
      type: DataTypes.TEXT, // Contenido adicional en Markdown o texto normal
      allowNull: true, // Opcional
    },
    questions: {
      type: DataTypes.JSONB, // Preguntas y respuestas en formato JSON
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