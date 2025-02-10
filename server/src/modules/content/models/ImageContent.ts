import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class ImageContent extends Model {
  public id!: bigint;
  public contentImage!: string;
  public contentImageTitle!: string;
  public sectionId!: bigint;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ImageContent.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    contentImage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentImageTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.BIGINT,
      references: { model: Section, key: "id" },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "image_content",
    timestamps: true
  }
);

export default ImageContent;
