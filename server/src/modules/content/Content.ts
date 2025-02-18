import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./../../infrastructure/database/db";
import Section from "./../section/Section";

type quizType = "Multiple Choice"
  | "true or false"
  | "Short Answer"
  | "Checkbox";

type linkType = "video" | "pagina" | "imagen" | "documento"

class Content extends Model {
  public id!: bigint;
  public sectionId!: bigint;
  public title!: string;
  public text!: string;
  public markdown?: string;
  public linkType?: string;
  public link?: string;
  public quiz?: Array<{
    question: string; // Pregunta
    text?: string;
    image?: string;
    type: quizType;
    answers: Array<{
      answer: string; // Respuesta
      isCorrect: boolean; // Indica si es una respuesta correcta
    }>;
  }>;
  public resources?: Array<{
    title: string;
    url: string;
  }>;
  public duration!: number;
  public position!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Content.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    markdown: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    linkType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quiz: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    resources: {
        type: DataTypes.JSONB,
        allowNull: true,
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
    modelName: "Content",
    tableName: "Contents",
    timestamps: true,
  }
);

Content.belongsTo(Section, { foreignKey: "sectionId", as: "section" });
Section.hasMany(Content, { foreignKey: "sectionId", as: "contents" });

export default Content;
