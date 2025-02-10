import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class FileContent extends Model {
  public id!: bigint;
  public contentFile!: string;
  public contentFileTitle!: string;
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
    contentFile: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentFileTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.BIGINT,
      references: { model: Section, key: "id" },
    },
  },
  {
    sequelize,
    modelName: "file_content",
    timestamps: true,
  }
);

export default FileContent;
