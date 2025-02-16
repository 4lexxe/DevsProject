import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class QuizContent extends Model {
  public id!: bigint;
  public title!: string;
  public content!: string;
  public questions?: Array<{
    question: string; // Pregunta
    answers: Array<{
      answer: string; // Respuesta
      isCorrect: boolean; // Indica si es una respuesta correcta
    }>;
  }>;
  public duration!: number;
  public position!: number;
  public sectionId!: bigint;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

QuizContent.init( 
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    questions: {
      type: DataTypes.JSONB,
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
    modelName: "QuizContent",
    tableName: "QuizContents",
    timestamps: true,
  }
);

QuizContent.belongsTo(Section, { foreignKey: "sectionId", as: "section" });
Section.hasMany(QuizContent, { foreignKey: "sectionId", as: "quizContents" });

export default QuizContent;
