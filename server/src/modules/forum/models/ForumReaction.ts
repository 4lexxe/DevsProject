// ForumReaction.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumPost from "./ForumPost";
import ForumReply from "./ForumReply";
import ForumThread from "./ForumThread";

// Definir tipos para el targetType
export enum ReactionTargetType {
  POST = 'post',
  REPLY = 'reply'
}

interface ForumReactionAttributes {
  id: number;
  userId: number;
  targetId: number;
  targetType: ReactionTargetType;
  emojiId: string;
  emojiName: string;
  isCustom: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumReactionCreationAttributes 
  extends Optional<ForumReactionAttributes, "id"> {}

class ForumReaction extends Model<ForumReactionAttributes, ForumReactionCreationAttributes> 
  implements ForumReactionAttributes {
  public id!: number;
  public userId!: number;
  public targetId!: number;
  public targetType!: ReactionTargetType;
  public emojiId!: string;
  public emojiName!: string;
  public isCustom!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para obtener el objetivo (post o reply)
  public async getTarget(): Promise<ForumPost | ForumReply | null> {
    if (this.targetType === ReactionTargetType.POST) {
      return ForumPost.findByPk(this.targetId);
    } else {
      return ForumReply.findByPk(this.targetId);
    }
  }

  // Método helper para obtener información completa de la reacción
  public async getFullDetails() {
    const [target, user] = await Promise.all([
      this.getTarget(),
      User.findByPk(this.userId)
    ]);

    return {
      reaction: this,
      target,
      user,
    };
  }
}

ForumReaction.init(
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
      comment: "ID del post o reply asociado",
    },
    targetType: {
      type: DataTypes.ENUM(...Object.values(ReactionTargetType)),
      allowNull: false,
    },
    emojiId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    emojiName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    isCustom: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "ForumReaction",
    tableName: "ForumReactions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "targetId", "targetType"],
        name: "unique_user_reaction_per_target",
      },
      {
        fields: ["targetId", "targetType"],
        name: "reaction_target_index",
      },
    ],
    hooks: {
      // Hook para actualizar lastActivityAt en la entidad objetivo
      afterCreate: async (reaction: ForumReaction) => {
        try {
          const target = await reaction.getTarget();
          if (target) {
            // Si es un post
            if (reaction.targetType === ReactionTargetType.POST) {
              // Obtener el thread asociado al post
              const post = target as ForumPost;
              // Buscar directamente el thread usando el threadId del post
              const thread = await ForumThread.findByPk(post.threadId);
              
              // Actualizar la actividad en el thread si existe
              if (thread) {
                await thread.update({ lastActivityAt: new Date() });
              }
            } 
            // Si es una respuesta
            else if (reaction.targetType === ReactionTargetType.REPLY) {
              const reply = target as ForumReply;
              // Obtener el post y thread asociados
              const post = await ForumPost.findByPk(reply.postId);
              if (post) {
                // Buscar el thread asociado
                const thread = await ForumThread.findByPk(post.threadId);
                // Actualizar la actividad en el thread si existe
                if (thread) {
                  await thread.update({ lastActivityAt: new Date() });
                }
              }
            }
          }
        } catch (error) {
          console.error('Error en hook afterCreate de ForumReaction:', error);
        }
      }
    }
  }
);

// Configurar relaciones polimórficas
ForumReaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Relación con Post - polimórfica
ForumReaction.belongsTo(ForumPost, {
  foreignKey: "targetId",
  constraints: false,
  scope: {
    targetType: ReactionTargetType.POST,
  },
  as: "post",
});

// Relación con Reply - polimórfica
ForumReaction.belongsTo(ForumReply, {
  foreignKey: "targetId",
  constraints: false,
  scope: {
    targetType: ReactionTargetType.REPLY,
  },
  as: "reply",
});

// Relaciones inversas desde Post y Reply
ForumPost.hasMany(ForumReaction, {
  foreignKey: "targetId",
  constraints: false,
  scope: {
    targetType: ReactionTargetType.POST,
  },
  as: "reactions",
});

ForumReply.hasMany(ForumReaction, {
  foreignKey: "targetId",
  constraints: false,
  scope: {
    targetType: ReactionTargetType.REPLY,
  },
  as: "reactions",
});

// Métodos estáticos para crear reacciones fácilmente
const createForPost = async function(
  userId: number, 
  postId: number, 
  emojiId: string, 
  emojiName: string, 
  isCustom: boolean = false
) {
  return ForumReaction.create({
    userId,
    targetId: postId,
    targetType: ReactionTargetType.POST,
    emojiId,
    emojiName,
    isCustom
  });
};

const createForReply = async function(
  userId: number, 
  replyId: number, 
  emojiId: string, 
  emojiName: string, 
  isCustom: boolean = false
) {
  return ForumReaction.create({
    userId,
    targetId: replyId,
    targetType: ReactionTargetType.REPLY,
    emojiId,
    emojiName,
    isCustom
  });
};

// Métodos estáticos para obtener reacciones
const getPostReactions = async function(postId: number) {
  return ForumReaction.findAll({
    where: {
      targetId: postId,
      targetType: ReactionTargetType.POST
    },
    include: [{ model: User, as: 'user' }]
  });
};

const getReplyReactions = async function(replyId: number) {
  return ForumReaction.findAll({
    where: {
      targetId: replyId,
      targetType: ReactionTargetType.REPLY
    },
    include: [{ model: User, as: 'user' }]
  });
};

// Agregar métodos estáticos al objeto ForumReaction
Object.assign(ForumReaction, {
  createForPost,
  createForReply,
  getPostReactions,
  getReplyReactions
});

export default ForumReaction;