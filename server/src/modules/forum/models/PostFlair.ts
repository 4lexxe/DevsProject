import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import ForumPost from "./ForumPost";
import ForumFlair from "./ForumFlair";
import User from "../../user/User";

/**
 * @interface PostFlairAttributes
 * @description Define los atributos del modelo PostFlair
 */
interface PostFlairAttributes {
  id: number;
  postId: number;
  flairId: number;
  assignedAt: Date;
  assignedBy?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface PostFlairCreationAttributes
 * @description Define los atributos opcionales durante la creación de un PostFlair
 */
interface PostFlairCreationAttributes extends Optional<PostFlairAttributes, "id" | "assignedAt" | "isActive"> {}

/**
 * @class PostFlair
 * @description Modelo para gestionar la relación muchos a muchos entre posts y flairs
 * @extends Model<PostFlairAttributes, PostFlairCreationAttributes>
 */
class PostFlair extends Model<PostFlairAttributes, PostFlairCreationAttributes> implements PostFlairAttributes {
  public id!: number;
  public postId!: number;
  public flairId!: number;
  public assignedAt!: Date;
  public assignedBy?: number;
  public isActive!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Obtiene los flairs asignados a un post específico
   * @param postId ID del post
   * @param options Opciones adicionales (onlyActive: mostrar solo flairs activos)
   * @returns Promise<PostFlair[]> Lista de asignaciones de flairs al post
   */
  static async getPostFlairs(postId: number, options = { onlyActive: true }): Promise<PostFlair[]> {
    const whereClause: any = { postId };
    
    if (options.onlyActive) {
      whereClause.isActive = true;
    }
    
    return await PostFlair.findAll({
      where: whereClause,
      include: [
        {
          model: ForumFlair,
          as: 'flair',
          attributes: ['id', 'name', 'description', 'icon', 'type', 'color']
        }
      ]
    });
  }

  /**
   * Verifica si un post tiene un flair específico asignado
   * @param postId ID del post
   * @param flairId ID del flair a verificar
   * @returns Promise<boolean> True si el post tiene el flair, false en caso contrario
   */
  static async hasFlair(postId: number, flairId: number): Promise<boolean> {
    const count = await PostFlair.count({
      where: {
        postId,
        flairId,
        isActive: true
      }
    });
    return count > 0;
  }

  /**
   * Asigna un flair a un post
   * @param postId ID del post
   * @param flairId ID del flair
   * @param assignedBy ID del usuario que asigna el flair (opcional)
   * @returns Promise<PostFlair> La asignación creada o actualizada
   */
  static async assignFlair(postId: number, flairId: number, assignedBy?: number): Promise<PostFlair> {
    const transaction = await sequelize.transaction();
    
    try {
      // Verificar si ya existe
      const existingAssignment = await PostFlair.findOne({
        where: {
          postId,
          flairId
        }
      });
      
      // Si existe pero está inactivo, lo reactivamos
      if (existingAssignment) {
        if (!existingAssignment.isActive) {
          existingAssignment.isActive = true;
          if (assignedBy) {
            existingAssignment.assignedBy = assignedBy;
          }
          await existingAssignment.save({ transaction });
        }
        await transaction.commit();
        return existingAssignment;
      }
      
      // Si no existe, creamos uno nuevo
      const newAssignment = await PostFlair.create({
        postId,
        flairId,
        assignedBy,
        isActive: true
      }, { transaction });
      
      await transaction.commit();
      return newAssignment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Desactiva un flair asignado a un post
   * @param postId ID del post
   * @param flairId ID del flair
   * @returns Promise<boolean> True si se desactivó correctamente, false si no existía
   */
  static async removeFlair(postId: number, flairId: number): Promise<boolean> {
    const transaction = await sequelize.transaction();
    
    try {
      const existingAssignment = await PostFlair.findOne({
        where: {
          postId,
          flairId,
          isActive: true
        }
      });
      
      if (!existingAssignment) {
        await transaction.commit();
        return false;
      }
      
      existingAssignment.isActive = false;
      await existingAssignment.save({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Obtiene los posts que tienen asignado un flair específico
   * @param flairId ID del flair
   * @param onlyActive Si es true, solo muestra asignaciones activas
   * @returns Promise<ForumPost[]> Lista de posts con el flair asignado
   */
  static async getPostsWithFlair(flairId: number, onlyActive = true): Promise<ForumPost[]> {
    const whereClause: any = { flairId };
    
    if (onlyActive) {
      whereClause.isActive = true;
    }
    
    const postFlairs = await PostFlair.findAll({
      where: whereClause,
      include: [
        {
          model: ForumPost,
          as: 'post',
          attributes: ['id', 'title', 'content', 'authorId', 'categoryId', 'createdAt', 'updatedAt']
        }
      ]
    });
    
    return postFlairs.map(pf => pf.get('post') as ForumPost);
  }
}

// Inicializar el modelo
PostFlair.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ForumPosts',
        key: 'id'
      }
    },
    flairId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ForumFlairs',
        key: 'id'
      }
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    assignedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: "PostFlair",
    tableName: "PostFlairs",
    timestamps: true,
    indexes: [
      {
        fields: ["postId", "flairId"],
        unique: true,
        name: "idx_post_flair_unique"
      },
      {
        fields: ["postId"],
        name: "idx_post_flair_post"
      },
      {
        fields: ["flairId"],
        name: "idx_post_flair_flair"
      },
      {
        fields: ["isActive"],
        name: "idx_post_flair_active"
      }
    ],
    comment: "Almacena las asignaciones de distintivos a posts del foro"
  }
);

// Hooks
PostFlair.addHook('afterCreate', async (postFlair: PostFlair) => {
  try {
    const post = await ForumPost.findByPk(postFlair.postId);
    const flair = await ForumFlair.findByPk(postFlair.flairId);
    if (post && flair) {
      console.log(`Distintivo "${flair.name}" asignado al post ID: ${post.id} con éxito.`);
    }
  } catch (error) {
    console.error('Error en hook afterCreate de PostFlair:', error);
  }
});

export default PostFlair;