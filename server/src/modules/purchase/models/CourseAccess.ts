import { DataTypes, Model } from "sequelize";
import sequelize from "../../../infrastructure/database/db";

class CourseAccess extends Model {
  public id!: bigint;
  public courseId!: bigint;
  public userId!: number;
  public accessToken!: string;
  public revokedAt!: Date | null;
  public revokeReason!: string | null;
  public grantedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourseAccess.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      comment: "ID único del acceso al curso",
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: "Courses", key: "id" },
      comment: "ID del curso",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      comment: "ID del usuario",
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Token de acceso al curso",
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha de revocación del acceso",
    },
    revokeReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Razón de la revocación del acceso",
    },
    grantedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Fecha de concesión del acceso",
    },
  },
  {
    sequelize,
    tableName: "CourseAccess",
    timestamps: true,
    paranoid: true,
    comment: "Tabla para gestionar el acceso de usuarios a cursos",
  }
);

export default CourseAccess;
