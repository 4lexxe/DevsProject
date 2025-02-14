import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import Resource from "../Resource";
import User from "../../user/User";

interface RatingAttributes {
  id: number;
  userId: number;
  resourceId: number;
  star: boolean; // true (con estrella) o false (sin estrella)
  createdAt?: Date;
  updatedAt?: Date;
}

interface RatingCreationAttributes extends Optional<RatingAttributes, "id"> {}

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
  public id!: number;
  public userId!: number;
  public resourceId!: number;
  public star!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definir el modelo
Rating.init(
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
    star: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Por defecto, sin estrella
    },
  },
  {
    sequelize,
    modelName: "Rating",
    tableName: "Ratings",
    timestamps: true,
  }
);

// Relaciones
Rating.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

Rating.belongsTo(Resource, {
  foreignKey: "resourceId",
  as: "Resource",
});

User.hasMany(Rating, {
  foreignKey: "userId",
  as: "Ratings",
});

Resource.hasMany(Rating, {
  foreignKey: "resourceId",
  as: "Ratings",
});

// Hooks para actualizar el contador de estrellas en el recurso
Rating.afterCreate(async (rating, options) => {
  if (rating.star) {
    await Resource.increment("starCount", { by: 1, where: { id: rating.resourceId } });
  }
});

Rating.afterDestroy(async (rating, options) => {
  if (rating.star) {
    await Resource.decrement("starCount", { by: 1, where: { id: rating.resourceId } });
  }
});

Rating.afterUpdate(async (rating, options) => {
  if (rating.changed("star")) {
    if (rating.star) {
      await Resource.increment("starCount", { by: 1, where: { id: rating.resourceId } });
    } else {
      await Resource.decrement("starCount", { by: 1, where: { id: rating.resourceId } });
    }
  }
});

export default Rating;