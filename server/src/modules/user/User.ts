import { Sequelize, DataTypes, Model, Op } from 'sequelize';
import sequelize from '../../infrastructure/database/db';
import Role from './../role/Role';
import Permission from '../role/Permission';

// Enum para los tipos de autenticación
export enum AuthProvider {
  LOCAL = 'local',
  DISCORD = 'discord',
  GITHUB = 'github',
  GOOGLE = 'google'
}

// Interfaz para el modelo Role con Permissions
interface RoleWithPermissions extends Role {
  Permissions?: Permission[];
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
  
  // Información genérica del proveedor
  public username!: string | null;
  public avatar!: string | null;
  public displayName!: string | null;

  // Metadata específica del proveedor
  public providerMetadata!: object | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método helper para verificar permisos
  async hasPermission(permissionName: string): Promise<boolean> {
    const role = await Role.findByPk(this.roleId, {
      include: ['Permissions']
    }) as RoleWithPermissions | null;
    
    return role?.Permissions?.some((p: Permission) => p.name === permissionName) ?? false;
  }
}

User.init({
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
      model: 'Roles',
      key: 'id',
    },
    allowNull: false,
    defaultValue: 1, // El ID del rol 'user'
  },
  // Campos de autenticación
  authProvider: {
    type: DataTypes.ENUM(...Object.values(AuthProvider)),
    allowNull: false,
    defaultValue: AuthProvider.LOCAL,
  },
  authProviderId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Campos genéricos para información del proveedor
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
  // Metadata específica del proveedor
  providerMetadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'User',
  indexes: [
    {
      unique: false,
      fields: ['roleId'],
    },
    {
      unique: true,
      fields: ['authProvider', 'authProviderId'],
    },
    {
      unique: true,
      fields: ['email'],
      where: {
        email: {
          [Op.ne]: null
        }
      }
    }
  ],
});

// Definir relación con Role
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

export default User;