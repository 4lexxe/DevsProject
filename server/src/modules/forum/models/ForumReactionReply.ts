// server/src/modules/forum/models/ForumReactionReply.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumPost from "./ForumPost";
import ForumReply from "./ForumReply";
import ForumThread from "./ForumPost";

interface ForumReactionReplyAttributes {
  id: number;
  userId: number;
  replyId: number;
  emojiId: string;
  emojiName: string;
  isCustom: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumReactionReplyCreationAttributes 
  extends Optional<ForumReactionReplyAttributes, "id"> {}

class ForumReactionReply extends Model<ForumReactionReplyAttributes, ForumReactionReplyCreationAttributes> 
  implements ForumReactionReplyAttributes {
  public id!: number;
  public userId!: number;
  public replyId!: number;
  public emojiId!: string;
  public emojiName!: string;
  public isCustom!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to get reactions for a specific reply
  static async getReplyReactions(replyId: number) {
    return ForumReactionReply.findAll({
      where: { replyId },
      include: [{ model: User, as: 'user' }]
    });
  }
}

ForumReactionReply.init(
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
    replyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ForumReplies",
        key: "id",
      },
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
    modelName: "ForumReactionReply",
    tableName: "ForumReactionReplies",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "replyId"],
        name: "unique_user_reaction_per_reply",
      },
    ],
    hooks: {
        afterCreate: async (reaction: ForumReactionReply) => {
          try {
            const reply = await ForumReply.findByPk(reaction.replyId);
            if (reply) {
              const post = await ForumPost.findByPk(reply.postId);
              if (post) {
                const thread = await ForumThread.findByPk(post.threadId);
                if (thread) {
                  await thread.update({ lastActivityAt: new Date() });
                }
              }
            }
          } catch (error) {
            console.error('Error in afterCreate hook for ForumReactionReply:', error);
          }
        }
      }
  }
);



export default ForumReactionReply;