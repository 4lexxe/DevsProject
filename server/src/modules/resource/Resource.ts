import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import User from "../user/User";

// Enumeración para los tipos de recursos
export enum ResourceType {
  VIDEO = "video",
  DOCUMENT = "document",
  IMAGE = "image",
  LINK = "link",
}

interface ResourceAttributes {
  id: number;
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  userId: number;
  userName: string;
  userAvatar: string;
  isVisible: boolean;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResourceCreationAttributes extends Optional<ResourceAttributes, "id"> {}

class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> implements ResourceAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public url!: string;
  public type!: ResourceType;
  public userId!: number;
  public userName!: string;
  public userAvatar!: string;
  public isVisible!: boolean;
  public coverImage?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definir el modelo
Resource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ResourceType)),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAvatar: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    sequelize,
    modelName: "Resource",
    tableName: "Resources",
    timestamps: true,
  }
);

// Definir relaciones
Resource.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(Resource, {
  foreignKey: "userId",
  as: "Resources",
});

export default Resource;