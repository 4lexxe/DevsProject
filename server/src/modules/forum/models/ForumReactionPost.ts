// server/src/modules/forum/models/ForumReactionPost.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumPost from "./ForumPost";
import ForumThread from "./ForumThread";

interface ForumReactionPostAttributes {
  id: number;
  userId: number;
  postId: number;
  emojiId: string;
  emojiName: string;
  isCustom: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumReactionPostCreationAttributes 
  extends Optional<ForumReactionPostAttributes, "id"> {}

class ForumReactionPost extends Model<ForumReactionPostAttributes, ForumReactionPostCreationAttributes> 
  implements ForumReactionPostAttributes {
  public id!: number;
  public userId!: number;
  public postId!: number;
  public emojiId!: string;
  public emojiName!: string;
  public isCustom!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Static method to get reactions for a specific post
  static async getPostReactions(postId: number) {
    return ForumReactionPost.findAll({
      where: { postId },
      include: [{ model: User, as: 'user' }]
    });
  }
}

ForumReactionPost.init(
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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ForumPosts",
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
    modelName: "ForumReactionPost",
    tableName: "ForumReactionPosts",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId"],
        name: "unique_user_reaction_per_post",
      },
    ],
    hooks: {
        afterCreate: async (reaction: ForumReactionPost) => {
          try {
            const post = await ForumPost.findByPk(reaction.postId);
            if (post) {
              const thread = await ForumThread.findByPk(post.threadId);
              if (thread) {
                await thread.update({ lastActivityAt: new Date() });
              }
            }
          } catch (error) {
            console.error('Error in afterCreate hook for ForumReactionPost:', error);
          }
        }
      }
  }
);


export default ForumReactionPost;