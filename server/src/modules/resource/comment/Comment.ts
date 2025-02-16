import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Resource from "../Resource";
import User from "../../user/User";

interface CommentAttributes {
  id: number;
  userId: number;
  resourceId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public userId!: number;
  public resourceId!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definir el modelo
Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    resourceId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Resources",
        key: "id",
      },
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "Comments",
    timestamps: true,
  }
);

// Relaciones
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

Comment.belongsTo(Resource, {
  foreignKey: "resourceId",
  as: "Resource",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "Comments",
});

Resource.hasMany(Comment, {
  foreignKey: "resourceId",
  as: "Comments",
});

export default Comment;