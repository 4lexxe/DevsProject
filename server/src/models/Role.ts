import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Role extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Definimos los roles iniciales
const rolesIniciales = [
  { name: 'usuario', description: 'Usuario normal del sistema' },
  { name: 'admin', description: 'Administrador del sistema' },
  { name: 'super admin', description: 'Super administrador con acceso completo' }
];

Role.init({
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
  modelName: 'Role',
  hooks: {
    // Este hook se ejecuta después de sincronizar la base de datos
    async afterSync() {
      for (const role of rolesIniciales) {
        // Verifica si el rol ya existe y si no, lo crea
        await Role.findOrCreate({
          where: { name: role.name },
          defaults: { description: role.description },
        });
      }
    }
  }
});

export default Role;