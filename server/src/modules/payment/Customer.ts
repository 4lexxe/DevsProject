import { 
    Model, 
    DataTypes, 
    InferAttributes, 
    InferCreationAttributes, 
    CreationOptional 
  } from 'sequelize';
  import sequelize from "../../infrastructure/database/db";
  
  class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    // createdAt y updatedAt automáticos si habilitas timestamps
  }
  
  Customer.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'customers',
    timestamps: true // o false, según tu preferencia
  });
  
  export default Customer;
  