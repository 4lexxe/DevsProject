import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class FileContent extends Model {
  public id!: bigint;
  public content!: string;
  public title!: string;
  public duration!: number;
  public position!: number;
  public sectionId!: bigint;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FileContent.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.BIGINT,
      references: { model: Section, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "FileContent",
    tableName: "FileContents",
    timestamps: true,
  }
);

FileContent.belongsTo(Section, { foreignKey: "sectionId", as: "section" });
Section.hasMany(FileContent, { foreignKey: "sectionId", as: "fileContents" });

export default FileContent;
