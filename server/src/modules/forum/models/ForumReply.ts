import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
// Mejorar importaciones para evitar ciclos
import  ForumPost  from "./ForumPost";
import ForumVoteReply,{ VoteType } from "./ForumVoteReply";
import User from "../../user/User";
import ForumReactionReply from "./ForumReactionReply";


interface ForumReplyAttributes {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  parentReplyId?: number | null;
  depth: number;                  // Nuevo campo para nivel de anidación
  isAcceptedAnswer: boolean; // true aceptada, false no aceptada
  isNSFW: boolean;
  isSpoiler: boolean;
  coverImage?: string;
  voteScore: number;
  upvoteCount: number;
  downvoteCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumReplyCreationAttributes extends Optional<ForumReplyAttributes, "id" | "isAcceptedAnswer"> {}

class ForumReply extends Model<ForumReplyAttributes, ForumReplyCreationAttributes> implements ForumReplyAttributes {
  public id!: number;
  public postId!: number;
  public authorId!: number;
  public content!: string;
  public parentReplyId?: number;
  public depth!: number;
  public isAcceptedAnswer!: boolean;
  public coverImage?: string;
  public isNSFW!: boolean;
  public isSpoiler!: boolean;
  public voteScore!: number;
  public upvoteCount!: number;
  public downvoteCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método estático para obtener los conteos de votos de un reply
  public static async getVoteCounts(replyId: number): Promise<{ upvotes: number; downvotes: number }> {
    const upvotes = await ForumVoteReply.count({
      where: { replyId, voteType: VoteType.UPVOTE }
    });
    const downvotes = await ForumVoteReply.count({
      where: { replyId, voteType: VoteType.DOWNVOTE }
    });
    return { upvotes, downvotes };
  }
}

ForumReply.init(
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
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentReplyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "ForumReplies",
        key: "id",
      },
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        max: 50 // Limitar profundidad máxima
      }
    },
    isAcceptedAnswer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isNSFW: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isSpoiler: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voteScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    upvoteCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    downvoteCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: "ForumReply",
    tableName: "ForumReplies",
    timestamps: true,
    indexes: [
      {
        fields: ['postId', 'parentReplyId'] // Mejorará las consultas anidadas
      }
    ],
    hooks: {
      afterCreate: async (reply: ForumReply) => {
          const transaction = await sequelize.transaction();
          try {
              // Actualizar directamente el Post asociado
              await ForumPost.increment('replyCount', {
                  where: { id: reply.postId },
                  transaction
              });
  
              await ForumPost.update({
                  lastActivityAt: new Date()
              }, {
                  where: { id: reply.postId },
                  transaction
              });
  
              await transaction.commit();
          } catch (error) {
              await transaction.rollback();
              console.error('Error en hook afterCreate:', error);
          }
      },
  
      afterDestroy: async (reply: ForumReply) => {
          const transaction = await sequelize.transaction();
          try {
              // Actualizar contador en el Post
              await ForumPost.decrement('replyCount', {
                  where: { id: reply.postId },
                  transaction
              });
  
              // Buscar última actividad real
              const lastReply = await ForumReply.findOne({
                  where: { postId: reply.postId },
                  order: [['createdAt', 'DESC']],
                  transaction
              });
  
              await ForumPost.update({
                  lastActivityAt: lastReply ? lastReply.createdAt : new Date()
              }, {
                  where: { id: reply.postId },
                  transaction
              });
  
              await transaction.commit();
          } catch (error) {
              await transaction.rollback();
              console.error('Error en hook afterDestroy:', error);
          }
      }
  }
  }
);




/**
 * @function updatePostReplyCount
 * @description Actualiza el contador de respuestas en un post
 * @param {number} postId - ID del post a actualizar
 */
async function updatePostReplyCount(postId: number): Promise<void> {
  try {
    // Usar la importación desde el índice en lugar de require
    const replyCount = await ForumReply.count({
      where: { postId }
    });
    
    // Verificar si el post existe antes de actualizarlo
    const post = await ForumPost.findByPk(postId);
    if (!post) {
      console.error(`Post with ID ${postId} not found when updating reply count`);
      return;
    }
    
    await post.update({ replyCount });
  } catch (error) {
    console.error(`Error updating reply count for post ${postId}:`, error);
  }
}

export default ForumReply;