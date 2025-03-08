import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import ForumReply from "./ForumReply";
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
 * @interface ForumVoteReplyAttributes
 * @description Define los atributos del modelo ForumVoteReply
 */
interface ForumVoteReplyAttributes {
  id: number;
  replyId: number;
  userId: number;
  voteType: VoteType;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface ForumVoteReplyCreationAttributes
 * @description Define los atributos opcionales durante la creación de un voto en respuesta
 */
interface ForumVoteReplyCreationAttributes extends Optional<ForumVoteReplyAttributes, "id"> {}

/**
 * @class ForumVoteReply
 * @description Modelo para gestionar votos positivos y negativos en respuestas del foro
 * @extends Model<ForumVoteReplyAttributes, ForumVoteReplyCreationAttributes>
 */
class ForumVoteReply extends Model<ForumVoteReplyAttributes, ForumVoteReplyCreationAttributes> implements ForumVoteReplyAttributes {
  public id!: number;
  public replyId!: number;
  public userId!: number;
  public voteType!: VoteType;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ForumVoteReply.init(
  { 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    replyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ForumReplies",
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
    modelName: "ForumVoteReply",
    tableName: "ForumVoteReplies",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "replyId"],
        name: "unique_user_reply_vote",
      }
    ],
    comment: "Almacena los votos positivos y negativos en respuestas del foro",
    hooks: {
      /**
       * @hook afterCreate
       * @description Actualiza el contador de votos en la respuesta cuando se crea un nuevo voto
       */
      afterCreate: async (vote: ForumVoteReply) => {
        try {
          await updateReplyVoteCount(vote.replyId);
        } catch (error) {
          console.error('Error updating reply vote count after create:', error);
        }
      },
      
      /**
       * @hook afterUpdate
       * @description Actualiza el contador de votos en la respuesta cuando se modifica un voto
       */
      afterUpdate: async (vote: ForumVoteReply) => {
        try {
          await updateReplyVoteCount(vote.replyId);
        } catch (error) {
          console.error('Error updating reply vote count after update:', error);
        }
      },
      
      /**
       * @hook afterDestroy
       * @description Actualiza el contador de votos en la respuesta cuando se elimina un voto
       */
      afterDestroy: async (vote: ForumVoteReply) => {
        try {
          await updateReplyVoteCount(vote.replyId);
        } catch (error) {
          console.error('Error updating reply vote count after destroy:', error);
        }
      }
    }
  }
);

/**
 * Relaciones del modelo
 */
ForumVoteReply.belongsTo(ForumReply, {
  foreignKey: "replyId",
  as: "reply",
  onDelete: 'CASCADE'
});

ForumVoteReply.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(ForumVoteReply, {
  foreignKey: "userId",
  as: "replyVotes",
});



/**
 * Métodos estáticos para consultas comunes
 */
ForumVoteReply.addScope('replyVotes', (replyId: number) => ({
  where: { replyId }
}));

ForumVoteReply.addScope('userReplyVotes', (userId: number) => ({
  where: { userId }
}));

ForumVoteReply.addScope('upvotes', {
  where: { voteType: VoteType.UPVOTE }
});

ForumVoteReply.addScope('downvotes', {
  where: { voteType: VoteType.DOWNVOTE }
});

/**
 * @function updateReplyVoteCount
 * @description Actualiza el contador de votos en una respuesta
 * @param {number} replyId - ID de la respuesta a actualizar
 */
async function updateReplyVoteCount(replyId: number): Promise<void> {
  try {
    // Calculamos los totales de votos positivos y negativos
    const upvotes = await ForumVoteReply.count({
      where: { 
        replyId,
        voteType: VoteType.UPVOTE
      }
    });
    
    const downvotes = await ForumVoteReply.count({
      where: { 
        replyId,
        voteType: VoteType.DOWNVOTE
      }
    });
    
    // Calculamos el puntaje neto (votos positivos - votos negativos)
    const netScore = upvotes - downvotes;
    
    // Verificar si la respuesta existe antes de actualizarla
    const reply = await ForumReply.findByPk(replyId);
    if (!reply) {
      console.error(`Reply with ID ${replyId} not found when updating vote count`);
      return;
    }
    
    // Actualizamos la respuesta
    // Nota: Necesitas añadir estos campos a ForumReply si no existen
    await reply.update({ 
      voteScore: netScore,
      upvoteCount: upvotes,
      downvoteCount: downvotes
    });
  } catch (error) {
    console.error(`Error updating vote count for reply ${replyId}:`, error);
  }
}

export default ForumVoteReply;
