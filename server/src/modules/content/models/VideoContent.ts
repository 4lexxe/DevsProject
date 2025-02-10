import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Section from "../../section/Section";

class VideoContent extends Model {
  public id!: bigint;
  public contentVideo!: string;
  public contentVideoTitle!: string;
  public sectionId!: bigint;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VideoContent.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    contentVideo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentVideoTitle: {
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
    modelName: "video_content",
    timestamps: true,
  }
);

export default VideoContent;