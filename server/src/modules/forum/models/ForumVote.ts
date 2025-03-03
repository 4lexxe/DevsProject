import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
// Mejorar importaciones para evitar ciclos
import { ForumPost } from "../models";
import User from "../../user/User";

/**
 * @enum {number} VoteType
 * @description Tipos de votos posibles
 */
export enum VoteType {
  DOWNVOTE = -1,
  UPVOTE = 1
}

/**
 * @interface ForumVoteAttributes
 * @description Define los atributos del modelo ForumVote
 */
interface ForumVoteAttributes {
  id: number;
  postId: number;
  userId: number;
  voteType: VoteType;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface ForumVoteCreationAttributes
 * @description Define los atributos opcionales durante la creación de un voto
 */
interface ForumVoteCreationAttributes extends Optional<ForumVoteAttributes, "id"> {}

/**
 * @class ForumVote
 * @description Modelo para gestionar votos positivos y negativos en posts del foro
 * @extends Model<ForumVoteAttributes, ForumVoteCreationAttributes>
 */
class ForumVote extends Model<ForumVoteAttributes, ForumVoteCreationAttributes> implements ForumVoteAttributes {
  public id!: number;
  public postId!: number;
  public userId!: number;
  public voteType!: VoteType;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ForumVote.init(
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
        model: "ForumPosts",
        key: "id",
      },
    },  
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",  
      },
    },
    voteType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ForumVote",
    tableName: "ForumVotes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId"],
        name: "unique_user_post_vote",
      }
    ],
    comment: "Almacena los votos positivos y negativos en posts del foro",
    hooks: {
      /**
       * @hook afterCreate
       * @description Actualiza el contador de votos en el post cuando se crea un nuevo voto
       */
      afterCreate: async (vote: ForumVote) => {
        try {
          await updatePostVoteCount(vote.postId);
        } catch (error) {
          console.error('Error updating post vote count after create:', error);
        }
      },
      
      /**
       * @hook afterUpdate
       * @description Actualiza el contador de votos en el post cuando se modifica un voto
       */
      afterUpdate: async (vote: ForumVote) => {
        try {
          await updatePostVoteCount(vote.postId);
        } catch (error) {
          console.error('Error updating post vote count after update:', error);
        }
      },
      
      /**
       * @hook afterDestroy
       * @description Actualiza el contador de votos en el post cuando se elimina un voto
       */
      afterDestroy: async (vote: ForumVote) => {
        try {
          await updatePostVoteCount(vote.postId);
        } catch (error) {
          console.error('Error updating post vote count after destroy:', error);
        }
      }
    }
  }
);

/**
 * Relaciones del modelo
 */
ForumVote.belongsTo(ForumPost, {
  foreignKey: "postId",
  as: "post",
  onDelete: 'CASCADE'
});

ForumVote.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(ForumVote, {
  foreignKey: "userId",
  as: "votes",
});

/**
 * Métodos estáticos para consultas comunes
 */
ForumVote.addScope('postVotes', (postId: number) => ({
  where: { postId }
}));

ForumVote.addScope('userVotes', (userId: number) => ({
  where: { userId }
}));

ForumVote.addScope('upvotes', {
  where: { voteType: VoteType.UPVOTE }
});

ForumVote.addScope('downvotes', {
  where: { voteType: VoteType.DOWNVOTE }
});

/**
 * @function updatePostVoteCount
 * @description Actualiza el contador de votos en un post
 * @param {number} postId - ID del post a actualizar
 */
async function updatePostVoteCount(postId: number): Promise<void> {
  try {
    // Usar la importación desde el índice
    // Calculamos los totales de votos positivos y negativos
    const upvotes = await ForumVote.count({
      where: { 
        postId,
        voteType: VoteType.UPVOTE
      }
    });
    
    const downvotes = await ForumVote.count({
      where: { 
        postId,
        voteType: VoteType.DOWNVOTE
      }
    });
    
    // Calculamos el puntaje neto (votos positivos - votos negativos)
    const netScore = upvotes - downvotes;
    
    // Verificar si el post existe antes de actualizarlo
    const post = await ForumPost.findByPk(postId);
    if (!post) {
      console.error(`Post with ID ${postId} not found when updating vote count`);
      return;
    }
    
    // Actualizamos el post
    await post.update({ 
      voteScore: netScore,
      upvoteCount: upvotes,
      downvoteCount: downvotes
    });
  } catch (error) {
    console.error(`Error updating vote count for post ${postId}:`, error);
  }
}

export default ForumVote;