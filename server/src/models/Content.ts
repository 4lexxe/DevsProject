import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Section from './Section'; // Relación con la sección

class Content extends Model {
  public id!: number;
  public type!: string;
  public contentText?: string;
  public contentVideo?: string;
  public contentImage?: string;
  public contentFile?: string;
  public externalLink?: string;
  public duration?: number;
  public position?: number;
  public sectionId!: number;
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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contentVideo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contentImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contentFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    externalLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
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
    tableName: 'Contents',
    modelName: 'Content',
    timestamps: true,
  }
);

// Relación con Section
Content.belongsTo(Section, { foreignKey: 'sectionId' });

export default Content;