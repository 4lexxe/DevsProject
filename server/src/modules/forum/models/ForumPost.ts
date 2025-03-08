import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumThread from "./ForumThread";
import ForumReply from "./ForumReply";
import ForumReactionPost from "./ForumReactionPost";
import ForumVotePost from "./ForumVotePost";

export enum PostStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
}

interface ForumPostAttributes {
  id: number;
  threadId: number;
  authorId: number;
  content: string;
  status: PostStatus;
  isNSFW: boolean;
  isSpoiler: boolean;
  coverImage?: string;
  voteScore: number;
  upvoteCount: number;
  downvoteCount: number;
  replyCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumPostCreationAttributes extends Optional<ForumPostAttributes, "id" | "voteScore" | "upvoteCount" | "downvoteCount" | "replyCount"> {}

/**
 * @class ForumPost
 * @description Modelo para gestionar las publicaciones en hilos del foro
 * @extends Model<ForumPostAttributes, ForumPostCreationAttributes>
 */
class ForumPost extends Model<ForumPostAttributes, ForumPostCreationAttributes> implements ForumPostAttributes {
  public id!: number;
  public threadId!: number;
  public authorId!: number;
  public content!: string;
  public status!: PostStatus;
  public isNSFW!: boolean;
  public isSpoiler!: boolean;
  public coverImage?: string;
  public voteScore!: number;
  public upvoteCount!: number;
  public downvoteCount!: number;
  public replyCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos de asociación generados por Sequelize
  public getThread!: () => Promise<ForumThread>;
  public getReplies!: () => Promise<ForumReply[]>;
  public getAuthor!: () => Promise<User>;
  public getVotes!: () => Promise<ForumVotePost[]>;
  public getReactions!: () => Promise<ForumReactionPost[]>;
}

ForumPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    threadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ForumThreads",
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
    status: {
      type: DataTypes.ENUM(...Object.values(PostStatus)),
      allowNull: false,
      defaultValue: PostStatus.DRAFT, // Añadir valor por defecto
    },
    isNSFW: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isSpoiler: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voteScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    upvoteCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    downvoteCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    replyCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    sequelize,
    modelName: "ForumPost",
    tableName: "ForumPosts",
    timestamps: true,
    indexes: [
      { fields: ['status'] }, 
      { fields: ['authorId'] }
    ],
    hooks: {
      /**
       * @hook afterCreate
       * @description Actualiza campos relacionados cuando se crea un nuevo post
       */
      afterCreate: async (post: ForumPost) => {
        try {
          // Actualizar lastActivityAt del hilo
          const thread = await ForumThread.findByPk(post.threadId);
          if (thread) {
            await ForumThread.increment('postCount', { where: { id: post.threadId } })
            await thread.update({ lastActivityAt: new Date() })
          }
        } catch (error) {
          console.error('Error updating thread after post creation:', error);
        }
      },
      
      /**
       * @hook afterDestroy
       * @description Actualiza el contador de posts en el hilo cuando se elimina un post
       */
      afterDestroy: async (post: ForumPost) => {
        const transaction = await sequelize.transaction();
        try {
          // Decrementar el contador de posts de forma atómica
          await ForumThread.decrement('postCount', { 
            where: { id: post.threadId }, 
            transaction 
          });
      
          // Obtener el último post para actualizar lastActivityAt
          const latestPost = await ForumPost.findOne({
            where: { threadId: post.threadId },
            order: [['createdAt', 'DESC']],
            transaction
          });
      
          // Obtener el hilo y actualizar lastActivityAt en función del último post encontrado
          const thread = await ForumThread.findByPk(post.threadId, { transaction });
          if (thread) {
            const lastActivityAt = latestPost ? latestPost.createdAt : thread.createdAt;
            await thread.update({ lastActivityAt }, { transaction });
          }
          
          await transaction.commit();
        } catch (error) {
          await transaction.rollback();
          console.error('Error updating thread after post deletion:', error);
        }
      }
    }
  }
);



export default ForumPost;

