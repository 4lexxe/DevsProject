import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class LinkContent extends Model {
  public id!: bigint;
  public externalLink!: string;
  public title!: string;
  public duration!: number;
  public position!: number;
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
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "LinkContent",
    tableName: "LinkContents",
    timestamps: true,
  }
);

LinkContent.belongsTo(Section, { foreignKey: "sectionId", as: "section" });
Section.hasMany(LinkContent, { foreignKey: "sectionId", as: "linkContents" });

export default LinkContent;
