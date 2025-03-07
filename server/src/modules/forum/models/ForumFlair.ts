import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumPost from "./ForumPost";
import ForumReply from "./ForumReply";

/**
 * @enum {string} FlairType
 * @description Tipos de distintivos disponibles
 * @property {string} ROLE_BASED - Distintivo asignado automáticamente basado en el rol del usuario
 * @property {string} ACHIEVEMENT - Distintivo otorgado por logros específicos
 * @property {string} CUSTOM - Distintivo personalizado que puede ser asignado manualmente
 */
export enum FlairType {
  ROLE_BASED = 'role_based',
  ACHIEVEMENT = 'achievement',
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

  // Métodos adicionales para gestionar flairs
  public async assignToUser(userId: number): Promise<void> {
    const transaction = await sequelize.transaction();
    const UserFlair = sequelize.models.UserFlair;
    try {
    await UserFlair.create({ userId, flairId: this.id }, { transaction });
    await transaction.commit();
    } catch (error) {
    await transaction.rollback();
    throw error;
    }
  }

  public async removeFromUser(userId: number): Promise<void> {
    const transaction = await sequelize.transaction(); // Iniciar transacción
    const UserFlair = sequelize.models.UserFlair;
  
    try {
      await UserFlair.destroy({
        where: {
          userId,
          flairId: this.id
        },
        transaction // Pasar transacción a la operación
      });
  
      await transaction.commit(); // Confirmar cambios
    } catch (error) {
      await transaction.rollback(); // Revertir en caso de error
      if (error instanceof Error) {
        throw new Error(`Error removing flair from user: ${error.message}`);
      } else {
        throw new Error('Error removing flair from user');
      }
    }
  }

  // Agregar estos métodos a la clase ForumFlair
public async assignToPost(postId: number): Promise<void> {
  const transaction = await sequelize.transaction();
  const PostFlair = sequelize.models.PostFlairs;
  try {
    await PostFlair.create({ 
      postId, 
      flairId: this.id 
    }, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

public async removeFromPost(postId: number): Promise<void> {
  const transaction = await sequelize.transaction();
  const PostFlair = sequelize.models.PostFlairs;
  try {
    await PostFlair.destroy({
      where: {
        postId,
        flairId: this.id
      },
      transaction
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    if (error instanceof Error) {
      throw new Error(`Error removing flair from post: ${error.message}`);
    } else {
      throw new Error('Error removing flair from post');
    }
  }
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

// Relaciones
// Relación con el creador del distintivo
ForumFlair.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

// Relación muchos a muchos con User (un usuario puede tener múltiples distintivos)
ForumFlair.belongsToMany(User, {
  through: "UserFlairs",
  foreignKey: "flairId",
  otherKey: "userId",
  as: "users",
});

User.belongsToMany(ForumFlair, {
  through: "UserFlairs",
  foreignKey: "userId",
  otherKey: "flairId",
  as: "flairs",
});

// Relación muchos a muchos con Post (para mostrar distintivos en posts)
ForumFlair.belongsToMany(ForumPost, {
  through: "PostFlairs",
  foreignKey: "flairId",
  otherKey: "postId",
  as: "posts",
});

ForumPost.belongsToMany(ForumFlair, {
  through: "PostFlairs",
  foreignKey: "postId",
  otherKey: "flairId",
  as: "flairs",
});

// Relación muchos a muchos con Reply (para mostrar distintivos en respuestas)
ForumFlair.belongsToMany(ForumReply, {
  through: "ReplyFlairs",
  foreignKey: "flairId",
  otherKey: "replyId",
  as: "replies",
});

ForumReply.belongsToMany(ForumFlair, {
  through: "ReplyFlairs",
  foreignKey: "replyId",
  otherKey: "flairId",
  as: "flairs",
});

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
    name: "Desarrollador Frontend",
    description: "Especialista en desarrollo frontend",
    icon: "💻",
    type: FlairType.CUSTOM,
    color: "#5AC8FA",
    isActive: true
  },
  {
    name: "Desarrollador Backend",
    description: "Especialista en desarrollo backend",
    icon: "🖥️",
    type: FlairType.CUSTOM,
    color: "#4CD964",
    isActive: true
  }
];


// Exportación
export default ForumFlair; 