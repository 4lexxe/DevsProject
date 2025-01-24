import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Permission extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definimos los permisos iniciales
const permisosIniciales = [
  { name: 'read:users', description: 'Puede ver usuarios' },
  { name: 'write:users', description: 'Puede crear/editar usuarios' },
  { name: 'delete:users', description: 'Puede eliminar usuarios' },
  { name: 'manage:roles', description: 'Puede gestionar roles' },
  { name: 'manage:permissions', description: 'Puede gestionar permisos' }
];

Permission.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Permission',
  hooks: {
    async afterSync() {
      for (const permission of permisosIniciales) {
        await Permission.findOrCreate({
          where: { name: permission.name },
          defaults: { description: permission.description },
        });
      }
    }
  }
});

export default Permission;