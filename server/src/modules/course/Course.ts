import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../database';
import User from '../user/User';

class Course extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public price!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'courses',
  }
);

Course.belongsTo(User, {
  foreignKey: 'userId',
  as: 'creator'
});

export default Course;