import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import User from "../user/User";

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
  isVisible: boolean;
  coverImage?: string;
  starCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResourceCreationAttributes extends Optional<ResourceAttributes, "id" | "starCount"> {}

class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> implements ResourceAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public url!: string;
  public type!: ResourceType;
  public userId!: number;
  public isVisible!: boolean;
  public coverImage?: string;
  public starCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    starCount: { // contador de estrellas
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Inicializa con 0 estrellas
    },
  },
  {
    sequelize,
    modelName: "Resource",
    tableName: "Resources",
    timestamps: true,
  }
);

// Relaciones
Resource.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(Resource, {
  foreignKey: "userId",
  as: "Resources",
});

export default Resource;
