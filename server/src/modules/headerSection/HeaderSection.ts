import { Model, DataTypes } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import Admin from '../admin/Admin'; // Relación con el admin que creó la sección

class HeaderSection extends Model {
  public id!: number;
  public image!: string; // Enlace a la imagen de portada
  public title!: string; // Título de la sección
  public slogan!: string; // Eslogan de la sección
  public about!: string; // Información resumida de la sección
  public buttonName!: string; // Nombre del botón
  public buttonLink!: string; // Enlace al producto o información adicional
  public badgeText?: string; // Texto del badge (ej: "Developer Path")
  public adminId!: number; // Relación con el admin que creó la sección
  
  // Campos de personalización
  public contentType?: string; // 'code' | 'iframe' | 'custom' | 'default'
  public customCode?: string; // Código personalizado para mostrar en el editor
  public iframeUrl?: string; // URL para iframe
  public customHtml?: string; // HTML personalizado
  public customCss?: string; // CSS personalizado
  public customJs?: string; // JavaScript personalizado
  
  // Colores personalizables
  public backgroundColor?: string; // Color de fondo del hero
  public titleColor?: string; // Color del título
  public sloganColor?: string; // Color del slogan
  public textColor?: string; // Color del texto general
  public buttonColor?: string; // Color del botón
  public buttonTextColor?: string; // Color del texto del botón
  
  // Tech Stack
  public techStack?: string[]; // Array de tecnologías
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HeaderSection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false, // Enlace de la imagen de portada
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Título de la sección
    },
    slogan: {
      type: DataTypes.STRING,
      allowNull: false, // Eslogan de la sección
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true, // Información resumida de la sección
    },
    buttonName: {
      type: DataTypes.STRING,
      allowNull: false, // Nombre del botón
    },
    buttonLink: {
      type: DataTypes.STRING,
      allowNull: false, // Enlace al producto o información adicional
    },
    badgeText: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Texto del badge (ej: Developer Path)",
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Relación con el admin que creó la sección
      references: {
        model: 'Admins',
        key: 'id',
      },
    },
    // Campos de personalización
    contentType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'default',
      comment: "Tipo de contenido: default, code, iframe, custom",
    },
    customCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Código personalizado para mostrar en el editor",
    },
    iframeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "URL para iframe (solo la URL, no el HTML completo)",
    },
    customHtml: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "HTML personalizado",
    },
    customCss: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "CSS personalizado",
    },
    customJs: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JavaScript personalizado",
    },
    backgroundColor: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Color de fondo del hero (hex, rgb, o nombre)",
    },
    titleColor: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Color del título",
    },
    sloganColor: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Color del slogan",
    },
    textColor: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Color del texto general",
    },
    buttonColor: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Color del botón",
    },
    buttonTextColor: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Color del texto del botón",
    },
    techStack: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: "Array de tecnologías (React, Node, TS, etc.)",
    },
  },
  {
    sequelize,
    modelName: 'HeaderSection',
    tableName: 'HeaderSections',
    timestamps: true,
  }
);

// Relación con Admin
HeaderSection.belongsTo(Admin, { foreignKey: 'adminId' });

export default HeaderSection;