import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import ForumPost from "./ForumPost";
import ForumReply from "./ForumReply";

/**
 * @enum {string} ReportStatus
 * @description Estados posibles para un reporte de contenido inapropiado
 * @property {string} PENDING - Reporte pendiente de revisión por moderadores
 * @property {string} REVIEWED - Reporte revisado y acción tomada
 * @property {string} REJECTED - Reporte revisado y rechazado (no requiere acción)
 */
export enum ReportStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  REJECTED = "rejected",
}

/**
 * @enum {string} ReportTargetType
 * @description Tipos de contenido que pueden ser reportados
 * @property {string} POST - Reporte dirigido a una publicación
 * @property {string} REPLY - Reporte dirigido a una respuesta
 */
export enum ReportTargetType {
  POST = "post",
  REPLY = "reply",
}

/**
 * @interface ReportAttributes
 * @description Define los atributos del modelo Report
 */
interface ReportAttributes {
  id: number;
  userId: number;
  targetId: number;
  targetType: ReportTargetType;
  reason: string;
  status: ReportStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface ReportCreationAttributes
 * @description Define los atributos opcionales durante la creación de un Report
 */
interface ReportCreationAttributes extends Optional<ReportAttributes, "id" | "status"> {}

/**
 * @class Report
 * @description Modelo para gestionar reportes de contenido inapropiado en el foro
 * @extends Model<ReportAttributes, ReportCreationAttributes>
 */
class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  public id!: number;
  public userId!: number;
  public targetId!: number;
  public targetType!: ReportTargetType;
  public reason!: string;
  public status!: ReportStatus;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * @method getReportedObject
   * @description Obtiene el objeto (post o respuesta) que ha sido reportado
   * @returns {Promise<ForumPost | ForumReply | null>} El objeto reportado o null si no se encuentra
   */
  async getReportedObject(): Promise<ForumPost | ForumReply | null> {
    if (this.targetType === ReportTargetType.POST) {
      return await ForumPost.findByPk(this.targetId);
    } else if (this.targetType === ReportTargetType.REPLY) {
      return await ForumReply.findByPk(this.targetId);
    }
    return null;
  }
}

// Inicialización del modelo
Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    targetType: {
      type: DataTypes.ENUM(...Object.values(ReportTargetType)),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 500]
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ReportStatus)),
      allowNull: false,
      defaultValue: ReportStatus.PENDING,
    },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "Reports",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "targetId", "targetType"],
        name: "unique_user_report",
      },
      {
        fields: ["status"],
        name: "report_status_idx",
      }
    ],
  }
);

export default Report;
