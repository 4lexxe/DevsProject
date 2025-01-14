import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import User from './User';  // Importar el modelo User

class Admin extends Model {
  public admin_since!: Date;
  public permissions!: string[];
  public isSuperAdmin!: boolean;
  public admin_notes!: string;
  public userId!: number;
}

Admin.init({
  admin_since: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  permissions: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isSuperAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Relación con el modelo User
      key: 'id',
    },
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Admin',
  tableName: 'Admins',
  timestamps: true,
});

User.hasOne(Admin, { foreignKey: 'userId' });
Admin.belongsTo(User, { foreignKey: 'userId' });

export default Admin;