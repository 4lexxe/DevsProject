import { Sequelize, DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Role from './Role';  // Importamos el modelo Role

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public roleId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
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
  },
}, {
  sequelize,
  modelName: 'User',
});

export default User;