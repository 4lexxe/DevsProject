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
  public adminId!: number; // Relación con el admin que creó la sección
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
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Relación con el admin que creó la sección
      references: {
        model: 'Admins',
        key: 'id',
      },
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