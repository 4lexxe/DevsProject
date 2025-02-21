import { DataTypes, Model } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import User from "../user/User";

class Roadmap extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public isPublic!: boolean;
  public structure!: object;
  public userId!: number;

  // Relación con User
  public User?: User;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Roadmap.init(
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
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    structure: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: "Roadmap",
    tableName: "Roadmaps",
    indexes: [
      { fields: ["userId"] }
    ]
  }
);

// Definir relaciones
Roadmap.belongsTo(User, {
  foreignKey: "userId",
  as: "User"
});

User.hasMany(Roadmap, {
  foreignKey: "userId",
  as: "Roadmaps"
});

export default Roadmap;