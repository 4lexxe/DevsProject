import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import ForumPost from "./ForumPost";
import User from "../../user/User";
import ForumCategory from "./ForumCategory";

interface ForumThreadAttributes {
  id: number;
  title: string;
  categoryId: number;
  authorId: number;
  isPinned: boolean;
  isLocked: boolean;
  isAnnouncement: boolean;
  viewCount: number;
  postCount: number;
  lastActivityAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumThreadCreationAttributes extends Optional<ForumThreadAttributes, "id" | "viewCount" | "postCount" | "lastActivityAt"> {}

class ForumThread extends Model<ForumThreadAttributes, ForumThreadCreationAttributes> implements ForumThreadAttributes {
  public id!: number;
  public title!: string;
  public categoryId!: number;
  public authorId!: number;
  public isPinned!: boolean;
  public isLocked!: boolean;
  public isAnnouncement!: boolean;
  public viewCount!: number;
  public postCount!: number;
  public lastActivityAt!: Date;
    
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ForumThread.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ForumCategories",
        key: "id",
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAnnouncement: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    postCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Número total de posts en el hilo"
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ForumThread",
    tableName: "ForumThreads",
    timestamps: true,
    indexes: [
      {
        fields: ["categoryId"],
      },
      {
      fields: ["lastActivityAt"],
    },
    {
      fields: ["authorId"],
    },
  ],
  }
);

// Establecer relación con ForumPost
ForumThread.hasMany(ForumPost, {
  sourceKey: "id",
  foreignKey: "threadId",
  as: "posts",
});

// Relación con el autor
ForumThread.belongsTo(User, {
    foreignKey: "authorId",
    as: "author",
  });


// Ejemplo en ForumThread
ForumThread.belongsTo(ForumCategory, {
  foreignKey: 'categoryId',
  onUpdate: 'CASCADE'
});

export default ForumThread; 