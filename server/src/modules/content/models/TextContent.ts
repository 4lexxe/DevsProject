import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class TextContent extends Model {
  public id!: bigint;
  public contentText!: string;
  public contentTextTitle!: string;
  public sectionId!: bigint;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date; 
}

TextContent.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    contentText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contentTextTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sectionId: {
      type: DataTypes.BIGINT,
      references: { model: Section, key: "id" },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "text_content",
    timestamps: true
  }
);

export default TextContent;
