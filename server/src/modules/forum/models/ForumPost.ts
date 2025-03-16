// ForumThread.ts (Modelo Unificado)
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../infrastructure/database/db";
import User from "../../user/User";
import ForumCategory from "./ForumCategory";
import slugify from "slugify";
export enum PostStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
}

export enum ContentType {
    TEXT = "text",
    IMAGE = "image",
    LINK = "link",
}

interface ForumPostAttributes {
  id: number;
  title: string;
  content: string; // Movido desde ForumPost
  contentType: ContentType; // Tipo de contenido: texto, imagen o enlace
  slug: string; // URL para posts de tipo LINK
  categoryId: number;
  authorId: number;
  status: PostStatus; // Movido desde ForumPost
  isNSFW: boolean; // Movido desde ForumPost
  isSpoiler: boolean; // Movido desde ForumPost
  coverImage?: string; // Movido desde ForumPost
  isPinned?: boolean;
  isLocked?: boolean;
  isAnnouncement?: boolean;
  viewCount: number;
  replyCount: number; // Antes en ForumPost
  voteScore: number; // Antes en ForumPost
  upvoteCount: number; // Antes en ForumPost
  downvoteCount: number; // Antes en ForumPost
  lastActivityAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ForumPostCreationAttributes extends Optional<ForumPostAttributes, 
  "id" | "viewCount" | "replyCount" | "voteScore" | "upvoteCount" | "downvoteCount" | "lastActivityAt"> {}

class ForumPost extends Model<ForumPostAttributes, ForumPostCreationAttributes> 
  implements ForumPostAttributes {
  
  // Atributos del Thread
  public id!: number;
  public title!: string;
  public categoryId!: number;
  public authorId!: number;
  public isPinned?: boolean;
  public isLocked?: boolean;
  public isAnnouncement?: boolean;
  public viewCount!: number;
  public lastActivityAt!: Date;

  // Atributos del Post (integrados)
  public content!: string;
  public contentType!: ContentType;
  public slug!: string;
  public status!: PostStatus;
  public isNSFW!: boolean;
  public isSpoiler!: boolean;
  public coverImage?: string;
  public replyCount!: number;
  public voteScore!: number;
  public upvoteCount!: number;
  public downvoteCount!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ForumPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentType: {
      type: DataTypes.ENUM(...Object.values(ContentType)),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ForumCategories",
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
    status: {
      type: DataTypes.ENUM(...Object.values(PostStatus)),
      defaultValue: PostStatus.DRAFT,
    },
    isNSFW: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSpoiler: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAnnouncement: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    replyCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    voteScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upvoteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    downvoteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ForumPost",
    tableName: "ForumPosts",
    timestamps: true,
    indexes: [
      { fields: ["categoryId"] },
      { fields: ["lastActivityAt"] },
      { fields: ["authorId"] },
      { fields: ["status"] },

      { fields: ["createdAt"] },
  { fields: ["updatedAt"] },
  { fields: ["viewCount"] },
  { fields: ["replyCount"] },
  { fields: ["voteScore"] },
  // Índices compuestos para casos de uso comunes
  { fields: ["categoryId", "lastActivityAt"] },
  { fields: ["isNSFW", "isSpoiler"] },
  { fields: ["isPinned", "isAnnouncement"] }
    ],
    hooks: {
      beforeValidate: (post: ForumPost) => {
        // Generar el slug a partir del título
        post.slug = slugify(post.title, {
          lower: true,      // convertir a minúsculas
          strict: true,     // eliminar caracteres especiales
          trim: true,       // eliminar espacios al inicio y final
          locale: 'es',     // para manejar caracteres españoles
          limit: 100        // limitar longitud
        });
      },
      afterCreate: async (post: ForumPost) => {
        // Lógica para notificaciones o actualizaciones adicionales
      }
    }
  }
);

export default ForumPost;