import { DataTypes, Model, Op, BelongsToGetAssociationMixin } from "sequelize";
import sequelize from "../../infrastructure/database/db";
import Role from "../role/Role";
import Permission from "../role/Permission";
import UserPermissionException from "./UserPermissionExceptions";

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
  public username!: string | null;
  public avatar!: string | null;
  public displayName!: string | null;
  public providerMetadata!: object | null;
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
  public registrationIp!: string;
  public lastLoginIp!: string;
  public suspiciousActivities!: Array<{
    type: string;
    ip: string;
    geo: object;
    timestamp: Date;
  }>;
  public isActiveSession!: boolean;
  public lastActiveAt!: Date | null;
  public Role?: Role;
  public Permissions?: Permission[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos generados por Sequelize para la relación con Permission
  public addPermissions!: (permission: Permission) => Promise<void>; // Declarar explícitamente addPermissions
  public removePermissions!: (permission: Permission) => Promise<void>; // Declarar explícitamente removePermissions
  public getPermissions!: () => Promise<Permission[]>; // Declarar explícitamente getPermissions

  declare getRole: BelongsToGetAssociationMixin<Role>;

  async hasPermission(permissionName: string): Promise<boolean> {
    // Obtener el rol del usuario con sus permisos
    const role = await Role.findByPk(this.roleId, {
      include: [
        {
          model: Permission,
          as: "Permissions",
          attributes: ["name"],
        },
      ],
    });

    // Obtener permisos personalizados del usuario
    const userPermissions = this.Permissions || [];

    // Combinar permisos del rol y permisos personalizados
    const rolePermissions = role?.Permissions?.map((p) => p.name) || [];
    const customPermissions = userPermissions.map((p) => p.name);
    const allPermissions = [...rolePermissions, ...customPermissions];

    // Verificar si el permiso está bloqueado para el usuario
    const permission = role?.Permissions?.find((p) => p.name === permissionName);
    if (!permission) {
      console.log(`Permiso "${permissionName}" no encontrado en el rol.`);
      return false; // Si no existe el permiso, denegar acceso
    }

    console.log('Verificando permiso bloqueado:', {
      userId: this.id,
      permissionId: permission.id,
    });

    const isPermissionBlocked = await UserPermissionException.findOne({
      where: {
        userId: this.id,
        permissionId: permission.id, // Asegurar que permissionId está definido
      },
    });

    // Si el permiso está bloqueado, denegar acceso
    if (isPermissionBlocked) {
      console.log(`Permiso "${permissionName}" está bloqueado para el usuario.`);
      return false;
    }

    // Verificar si el usuario tiene el permiso requerido
    const hasPermission = allPermissions.includes(permissionName);
    console.log(`Usuario ${this.id} tiene permiso "${permissionName}":`, hasPermission);
    return hasPermission;
  }

  // Método para agregar un permiso personalizado
  async addPermission(permission: Permission): Promise<void> {
    if (!permission || !permission.id) {
      throw new Error('Permiso no válido');
    }

    console.log('Agregando permiso:', permission.name, 'ID:', permission.id);

    // Usar el método generado por Sequelize para agregar el permiso
    await this.addPermissions(permission); // ¡Aquí está la corrección!
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

// Definir relaciones correctamente
User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "Role", // Asegurar que coincide con include en las consultas
});

Role.hasMany(User, {
  foreignKey: "roleId",
  as: "Users",
});

// Relación muchos a muchos entre User y Permission para permisos personalizados
User.belongsToMany(Permission, {
  through: 'UserPermissions', // Tabla intermedia
  foreignKey: 'userId',
  as: 'Permissions', // Alias para la relación
  timestamps: false, // Desactivar marcas de tiempo
});

Permission.belongsToMany(User, {
  through: 'UserPermissions', // Tabla intermedia
  foreignKey: 'permissionId',
  as: 'Users', // Alias para la relación
  timestamps: false, // Desactivar marcas de tiempo
});

export default User;