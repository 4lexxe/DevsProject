// src/modules/contact/ContactMessage.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../infrastructure/database/db";

// Definimos las interfaces para los atributos y para la creación
interface ContactMessageAttributes {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContactMessageCreationAttributes extends Optional<ContactMessageAttributes, "id"> {}

class ContactMessage extends Model<ContactMessageAttributes, ContactMessageCreationAttributes>
  implements ContactMessageAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public subject!: string;
  public message!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContactMessage.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ContactMessage",
    tableName: "ContactMessages",
    timestamps: true,
  }
);

export default ContactMessage;
