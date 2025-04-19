import { Model, DataTypes } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import Permission from "../Permission/Permission";

class UserPermissionException extends Model {
  declare userId: number;
  declare permissionId: number;
  declare Permission: Permission;
}

UserPermissionException.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Users", // Nombre de la tabla de usuarios
        key: "id", // Clave primaria de la tabla Users
      },
      onDelete: "CASCADE",
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Permissions", // Nombre de la tabla de permisos
        key: "id", // Clave primaria de la tabla Permissions
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "UserPermissionException",
    tableName: "UserPermissionExceptions",
    timestamps: false,
  }
);

// Definir relación con Permission
UserPermissionException.belongsTo(Permission, {
  foreignKey: "permissionId",
  as: "Permission", // Alias para la relación
});

export default UserPermissionException;