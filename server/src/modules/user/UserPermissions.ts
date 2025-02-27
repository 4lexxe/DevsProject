import { Model, DataTypes } from "sequelize";
import sequelize from "../../infrastructure/database/db";

class UserPermission extends Model {
  declare userId: number;
  declare permissionId: number;
}

UserPermission.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Users", // Nombre de la tabla de usuarios
        key: "id", // Clave primaria de la tabla Users
      },
      onDelete: "CASCADE", // Si se elimina un usuario, se eliminan sus permisos personalizados
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Permissions", // Nombre de la tabla de permisos
        key: "id", // Clave primaria de la tabla Permissions
      },
      onDelete: "CASCADE", // Si se elimina un permiso, se elimina de los usuarios que lo tenían
    },
  },
  {
    sequelize,
    modelName: "UserPermission",
    tableName: "UserPermissions", // Nombre de la tabla intermedia
    timestamps: false, // No necesitamos createdAt y updatedAt en esta tabla
  }
);

export default UserPermission;