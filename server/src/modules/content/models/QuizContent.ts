import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class QuizContent extends Model {
  public id!: bigint;
  public quizTitle!: string;
  public quizContent!: string;
  public questions!: object;
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
    quizTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quizContent: {
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
      type: DataTypes.INTEGER.UNSIGNED,
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
    modelName: "quiz_content",
    timestamps: true,
  }
);

export default QuizContent;
