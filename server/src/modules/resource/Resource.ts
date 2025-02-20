import { DataTypes, Model, Optional, QueryTypes } from "sequelize";
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
  searchVector: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResourceCreationAttributes extends Optional<ResourceAttributes, "id" | "starCount" | "searchVector"> {}

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
  public searchVector!: any;
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
    starCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    searchVector: {
      type: DataTypes.TSVECTOR,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Resource",
    tableName: "Resources",
    timestamps: true,
    indexes: [
      // Índice optimizado para búsqueda full-text
      {
        name: "idx_resource_search",
        using: "GIN",
        fields: ["searchVector"],
      },
      // Índice compuesto optimizado para filtros comunes
      {
        name: "idx_resource_visibility_date",
        fields: ["isVisible", "createdAt"],
      },
      // Índice para ordenamiento y paginación
      {
        name: "idx_resource_created_at",
        fields: ["createdAt"],
      },
      // Índice para búsquedas por tipo
      {
        name: "idx_resource_type",
        fields: ["type"],
      },
    ],
    hooks: {
      beforeSave: async (resource: Resource) => {
        // Actualizar el vector de búsqueda antes de guardar
        const searchText = [
          resource.title,
          resource.description,
          resource.type.toLowerCase(),
        ].filter(Boolean).join(' ');

        // Usar una consulta SQL directa para generar el vector de búsqueda
        const [results] = await sequelize.query(
          `SELECT to_tsvector('spanish', :searchText) as vector`,
          {
            replacements: { searchText },
            type: QueryTypes.SELECT,
          }
        );
        
        resource.searchVector = (results as any).vector;
      },
    },
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