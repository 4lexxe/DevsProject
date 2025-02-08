import { Sequelize, DataTypes, Model, Op } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import Role from "../role/Role";
import Permission from "../role/Permission";

export enum AuthProvider {
  LOCAL = "local",
  DISCORD = "discord",
  GITHUB = "github",
}

// Extender tipo Role con Permissions
declare module "../role/Role" {
  interface Role {
    Permissions?: Permission[];
  }
}

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string | null;
  public password!: string | null;
  public phone!: string | null;

  public roleId!: number;
  public authProvider!: AuthProvider;
  public authProviderId!: string | null;

  // Información del proveedor
  public username!: string | null;
  public avatar!: string | null;
  public displayName!: string | null;

  // Metadata del proveedor
  public providerMetadata!: object | null;

  // Campos de seguridad geoespacial
  public registrationGeo!: {
    city: string | null;
    region: string | null;
    country: string | null;
    loc: [number, number];
    timezone: string | null;
    isProxy: boolean;
  } | null;

  public lastLoginGeo!: {
    city: string | null;
    region: string | null;
    country: string | null;
    loc: [number, number];
    timezone: string | null;
    isProxy: boolean;
  } | null;

  registrationIp!: string;

  lastLoginIp!: string;

  public suspiciousActivities!: Array<{
    type: string;
    ip: string;
    geo: object;
    timestamp: Date;
  }>;

  public isActiveSession!: boolean;
  public lastActiveAt!: Date | null;

  // Relación con Role
  public Role?: Role;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async hasPermission(permissionName: string): Promise<boolean> {
    const role = await Role.findByPk(this.roleId, {
      include: [
        {
          association: "Permissions",
          attributes: ["name"],
        },
      ],
    });

    return !!role?.Permissions?.some((p) => p.name === permissionName);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Roles",
        key: "id",
      },
      allowNull: false,
      defaultValue: 1,
    },
    authProvider: {
      type: DataTypes.ENUM(...Object.values(AuthProvider)),
      allowNull: false,
      defaultValue: AuthProvider.LOCAL,
    },
    authProviderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    providerMetadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    registrationIp: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        isIP: true,
      },
      defaultValue: "127.0.0.1",
    },
    registrationGeo: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    lastLoginIp: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        isIP: true,
      },
      defaultValue: "127.0.0.1",
    },
    lastLoginGeo: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    suspiciousActivities: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    isActiveSession: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    indexes: [
      { fields: ["roleId"] },
      { unique: true, fields: ["authProvider", "authProviderId"] },
      {
        unique: true,
        fields: ["email"],
        where: { email: { [Op.ne]: null } },
      },
      { fields: ["registrationIp"] },
      { fields: ["lastLoginIp"] },
      { fields: ["suspiciousActivities"] },
    ],
  }
);

// Definir relaciones
User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "Role",
});

Role.hasMany(User, {
  foreignKey: "roleId",
  as: "Users",
});

export default User;