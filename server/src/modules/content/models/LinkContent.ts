import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class LinkContent extends Model {
  public id!: bigint;
  public externalLink!: string;
  public externalLinkTitle!: string;
  public sectionId!: bigint;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LinkContent.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    externalLink: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    externalLinkTitle: {
      type: DataTypes.TEXT,
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
    modelName: "link_content",
    timestamps: true,
  }
);

export default LinkContent;
