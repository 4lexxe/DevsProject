import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Section from './Section';  // Relación con la sección

class Content extends Model {
  public id!: number;
  public type!: string;  // Tipo de contenido (texto, video, enlace, etc.)
  public content!: string;  // El contenido en sí (texto, URL, etc.)
  public sectionId!: number;  // Relación con la sección
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sectionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'sections',  // Asegúrate de que el nombre de la tabla sea en minúsculas ('sections')
        key: 'id',
      },
    }
  },
  {
    sequelize,
    tableName: 'contents',
    modelName: 'Content',
    timestamps: true
  }
);

// Relación con la sección
Content.belongsTo(Section, { foreignKey: 'sectionId' });

export default Content;