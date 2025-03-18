import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumPost from "./ForumPost";
import ForumReply from "./ForumReply";
import PostFlair from "./PostFlair";
import UserFlair from "./UserFlair";

/**
 * @enum {string} FlairType
 * @description Tipos de distintivos disponibles
 * @property {string} ROLE_BASED - Distintivo asignado automáticamente basado en el rol del usuario
 * @property {string} ACHIEVEMENT - Distintivo otorgado por logros específicos
 * @property {string} POST - Distintivo específico para posts
 * @property {string} CUSTOM - Distintivo personalizado que puede ser asignado manualmente
 */
export enum FlairType {
  ROLE_BASED = 'role_based',
  ACHIEVEMENT = 'achievement',
  POST = 'post',
  CUSTOM = 'custom'
}

/**
 * @interface ForumFlairAttributes
 * @description Define los atributos del modelo ForumFlair
 */
interface ForumFlairAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  type: FlairType;
  createdBy?: number;
  isActive: boolean;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface ForumFlairCreationAttributes
 * @description Define los atributos opcionales durante la creación de un ForumFlair
 */
interface ForumFlairCreationAttributes extends Optional<ForumFlairAttributes, "id" | "isActive"> {}

/**
 * @class ForumFlair
 * @description Modelo para gestionar los distintivos de los usuarios en el foro
 * @extends Model<ForumFlairAttributes, ForumFlairCreationAttributes>
 */
class ForumFlair extends Model<ForumFlairAttributes, ForumFlairCreationAttributes> implements ForumFlairAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public icon?: string;
  public type!: FlairType;
  public createdBy?: number;
  public isActive!: boolean;
  public color!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos para gestionar la asignación de flairs a usuarios
  public async assignToUser(userId: number, assignedBy?: number): Promise<UserFlair> {
    const transaction = await sequelize.transaction();
    try {
      // Verificar si ya existe la asignación
      const existingAssignment = await UserFlair.findOne({
        where: {
          userId,
          flairId: this.id
        }
      });

      // Si ya existe y está inactivo, lo reactivamos
      if (existingAssignment) {
        if (!existingAssignment.isActive) {
          existingAssignment.isActive = true;
          await existingAssignment.save({ transaction });
        }
        await transaction.commit();
        return existingAssignment;
      }

      // Si no existe, creamos uno nuevo
      const userFlair = await UserFlair.create({ 
        userId, 
        flairId: this.id,
        isActive: true
      }, { transaction });
      
      await transaction.commit();
      return userFlair;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async removeFromUser(userId: number): Promise<boolean> {
    const transaction = await sequelize.transaction();
  
    try {
      // Buscar la asignación existente
      const existingAssignment = await UserFlair.findOne({
        where: {
          userId,
          flairId: this.id
        }
      });

      // Si no existe, no hay nada que desactivar
      if (!existingAssignment) {
        await transaction.commit();
        return false;
      }

      // Marcar como inactivo en lugar de eliminar
      existingAssignment.isActive = false;
      await existingAssignment.save({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof Error) {
        throw new Error(`Error removing flair from user: ${error.message}`);
      } else {
        throw new Error('Error removing flair from user');
      }
    }
  }

  // Métodos para gestionar la asignación de flairs a posts
  public async assignToPost(postId: number, assignedBy?: number): Promise<PostFlair> {
    const transaction = await sequelize.transaction();
    try {
      // Verificar si ya existe la asignación
      const existingAssignment = await PostFlair.findOne({
        where: {
          postId,
          flairId: this.id
        }
      });

      // Si ya existe y está inactivo, lo reactivamos
      if (existingAssignment) {
        if (!existingAssignment.isActive) {
          existingAssignment.isActive = true;
          await existingAssignment.save({ transaction });
        }
        await transaction.commit();
        return existingAssignment;
      }

      // Si no existe, creamos uno nuevo
      const postFlair = await PostFlair.create({ 
        postId, 
        flairId: this.id,
        assignedBy,
        isActive: true
      }, { transaction });
      
      await transaction.commit();
      return postFlair;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async removeFromPost(postId: number): Promise<boolean> {
    const transaction = await sequelize.transaction();
    try {
      // Buscar la asignación existente
      const existingAssignment = await PostFlair.findOne({
        where: {
          postId,
          flairId: this.id
        }
      });

      // Si no existe, no hay nada que desactivar
      if (!existingAssignment) {
        await transaction.commit();
        return false;
      }

      // Marcar como inactivo en lugar de eliminar
      existingAssignment.isActive = false;
      await existingAssignment.save({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof Error) {
        throw new Error(`Error removing flair from post: ${error.message}`);
      } else {
        throw new Error('Error removing flair from post');
      }
    }
  }

  // Método estático para obtener flairs asignados a un post específico
  public static async getFlairsForPost(postId: number): Promise<ForumFlair[]> {
    return await ForumFlair.findAll({
      include: [{
        model: PostFlair,
        as: 'postFlairs',
        where: { postId, isActive: true },
        attributes: []
      }]
    });
  }

  // Método estático para obtener flairs asignados a un usuario específico
  public static async getFlairsForUser(userId: number): Promise<ForumFlair[]> {
    return await ForumFlair.findAll({
      include: [{
        model: UserFlair,
        as: 'userFlairs',
        where: { userId, isActive: true },
        attributes: []
      }]
    });
  }
}

ForumFlair.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      comment: "Identificador único del distintivo"
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: "Nombre del distintivo"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Descripción del distintivo"
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "URL del ícono del distintivo"
    },
    type: {
      type: DataTypes.ENUM(...Object.values(FlairType)),
      allowNull: false,
      comment: "Tipo de distintivo (basado en rol, por logro o personalizado)"
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "ID del usuario que creó el distintivo personalizado"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Indica si el distintivo está activo"
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Color del distintivo en formato hexadecimal"
    },
  },
  {
    sequelize,
    modelName: "ForumFlair",
    tableName: "ForumFlairs",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
      }
    ],
    comment: "Almacena los distintivos que pueden ser asignados a usuarios en el foro"
  }
);

// Hooks
ForumFlair.addHook('afterCreate', async (flair: ForumFlair) => {
  try {
    console.log(`Distintivo "${flair.name}" creado con éxito.`);
  } catch (error) {
    console.error('Error en hook afterCreate de ForumFlair:', error);
  }
});

// Predefinir flairs para roles y logros
export const predefinedFlairs = [
  // Flairs basados en roles
  {
    name: "Estudiante",
    description: "Usuario registrado en el sistema de aprendizaje",
    icon: "🎓",
    type: FlairType.ROLE_BASED,
    color: "#4A90E2",
    isActive: true
  },
  {
    name: "Instructor",
    description: "Instructor de cursos en la plataforma",
    icon: "👨‍🏫",
    type: FlairType.ROLE_BASED,
    color: "#F5A623",
    isActive: true
  },
  {
    name: "Moderador",
    description: "Moderador de la comunidad",
    icon: "🛡️",
    type: FlairType.ROLE_BASED,
    color: "#7ED321",
    isActive: true
  },
  {
    name: "Administrador",
    description: "Administrador del sistema",
    icon: "⚙️",
    type: FlairType.ROLE_BASED,
    color: "#BD10E0",
    isActive: true
  },
  // Flairs basados en logros
  {
    name: "Colaborador",
    description: "Usuario que contribuye activamente en el foro",
    icon: "🌟",
    type: FlairType.ACHIEVEMENT,
    color: "#50E3C2",
    isActive: true
  },
  {
    name: "Experto",
    description: "Usuario reconocido por su conocimiento en un área específica",
    icon: "🧠",
    type: FlairType.ACHIEVEMENT,
    color: "#FF5733",
    isActive: true
  },
  {
    name: "Mentor",
    description: "Usuario que ayuda a otros en su aprendizaje",
    icon: "🤝",
    type: FlairType.ACHIEVEMENT,
    color: "#9013FE",
    isActive: true
  },
  // Flairs personalizados (ejemplos)
  {
    name: "Cyberpunk",
    description: "Entusiasta de la tecnología y la ciencia ficción",
    icon: "🤖",
    type: FlairType.CUSTOM,
    color: "#FF2D55",
    isActive: true
  },
  {
    name: "Frontend",
    description: "Especialista en desarrollo frontend",
    icon: "💻",
    type: FlairType.POST,
    color: "#5AC8FA",
    isActive: true
  },
  {
    name: "Backend",
    description: "Especialista en desarrollo backend",
    icon: "🖥️",
    type: FlairType.POST,
    color: "#4CD964",
    isActive: true
  },
  {
    name: "DevOps",
    description: "Especialista en automatización e infraestructura",
    icon: "🔧",
    type: FlairType.POST,
    color: "#F39C12",
    isActive: true
  },
  {
    name: "Fullstack",
    description: "Desarrollador con experiencia en frontend y backend",
    icon: "🗂️",
    type: FlairType.POST,
    color: "#34495E",
    isActive: true
  },
  {
    name: "UI/UX",
    description: "Diseñador enfocado en experiencia de usuario e interfaces",
    icon: "🎨",
    type: FlairType.POST,
    color: "#E74C3C",
    isActive: true
  },
  {
    name: "Machine Learning",
    description: "Especialista en modelos predictivos e inteligencia artificial",
    icon: "🤖",
    type: FlairType.POST,
    color: "#8E44AD",
    isActive: true
  },
  {
    name: "Data Science",
    description: "Análisis de datos y modelos estadísticos",
    icon: "📊",
    type: FlairType.POST,
    color: "#3498DB",
    isActive: true
  },
  {
    name: "Cybersecurity",
    description: "Experto en seguridad informática y ciberseguridad",
    icon: "🔒",
    type: FlairType.POST,
    color: "#2C3E50",
    isActive: true
  },
  {
    name: "Blockchain",
    description: "Desarrollador o entusiasta de tecnología blockchain",
    icon: "⛓️",
    type: FlairType.POST,
    color: "#2980B9",
    isActive: true
  },
  {
    name: "Gamedev",
    description: "Desarrollador de videojuegos",
    icon: "🎮",
    type: FlairType.POST,
    color: "#E67E22",
    isActive: true
  },
  {
    name: "Open Source",
    description: "Colaborador activo en proyectos de código abierto",
    icon: "🌐",
    type: FlairType.POST,
    color: "#1ABC9C",
    isActive: true
  },
  {
    name: "Cloud",
    description: "Especialista en infraestructura en la nube",
    icon: "☁️",
    type: FlairType.POST,
    color: "#00ADEF",
    isActive: true
  },
  {
    name: "SQL",
    description: "Experto en bases de datos relacionales y SQL",
    icon: "🗃️",
    type: FlairType.POST,
    color: "#009688",
    isActive: true
  }
];

// Exportación
export default ForumFlair;