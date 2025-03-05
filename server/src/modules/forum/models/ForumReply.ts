import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
// Mejorar importaciones para evitar ciclos
import  ForumPost  from "./ForumPost";
import ForumVote, { VoteType } from "./ForumVotePost";
import ForumReactionReply from "./ForumReactionReply";
/**
 * @enum {string} ReplyStatus
 * @description Estados posibles para una respuesta
 * @property {string} ACTIVE - Respuesta visible
 * @property {string} HIDDEN - Respuesta ocultada por moderación
 */

interface ForumReplyAttributes {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  parentReplyId?: number;
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
  public static async getVoteCounts(postId: number): Promise<{ upvotes: number; downvotes: number }> {
    const upvotes = await ForumVote.count({
      where: { postId, voteType: VoteType.UPVOTE }
    });
    const downvotes = await ForumVote.count({
      where: { postId, voteType: VoteType.DOWNVOTE }
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
    hooks: {
      /**
       * @hook afterCreate
       * @description Actualiza el contador de respuestas en el post cuando se crea una nueva respuesta
       */
      afterCreate: async (reply: ForumReply) => {
        try {
          await updatePostReplyCount(reply.postId);
        } catch (error) {
          console.error('Error updating post reply count after create:', error);
        }
      },
      
      /**
       * @hook afterDestroy
       * @description Actualiza el contador de respuestas en el post cuando se elimina una respuesta
       */
      afterDestroy: async (reply: ForumReply) => {
        try {
          await updatePostReplyCount(reply.postId);
        } catch (error) {
          console.error('Error updating post reply count after destroy:', error);
        }
      }
    }
  }
);

// Establecer relación con ForumPost

ForumReply.belongsTo(ForumPost, {
  foreignKey: "postId",
  as: "post",
});

// Establecer relación jerárquica (respuestas anidadas) MAL polymorphic association
ForumReply.hasMany(ForumReply, {
  sourceKey: "id",
  foreignKey: "parentReplyId",
  as: "childReplies",
});

ForumReply.belongsTo(ForumReply, {
  foreignKey: "parentReplyId",
  as: "parentReply",
});

ForumReply.hasMany(ForumReactionReply, {
  foreignKey: "replyId",
  as: "reactions",
});

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