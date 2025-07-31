import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "./Section";

type quizType = "Single" | "MultipleChoice" | "TrueOrFalse" | "ShortAnswer";

class Content extends Model {
  public id!: bigint;
  public sectionId!: bigint;
  public title!: string;
  public text!: string;
  public markdown?: string;
  public quiz?: Array<{
    id: string;
    question: string; // Pregunta
    description: string;
    order: number;
    points: number; // Puntos que vale la pregunta
    markdown?: string;
    explanation?: string;
    image?: string;
    type: quizType;
    answers: Array<{
      id?: string;
      text: string; // Respuesta
      isCorrect: boolean; 
      explanation?: string; 
    }>;
    metadata?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
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
