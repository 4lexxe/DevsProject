/**
 * @interface ForumReactionBase
 * @description Interfaz base para reacciones compartida por post y reply
 */
export interface ForumReactionBase {
  id: number;
  userId: number;
  emojiId: string;
  emojiName: string;
  isCustom: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface ForumReactionPostAttributes
 * @description Atributos específicos para reacciones en posts
 */
export interface ForumReactionPostAttributes extends ForumReactionBase {
  postId: number;
}

/**
 * @interface ForumReactionReplyAttributes
 * @description Atributos específicos para reacciones en respuestas
 */
export interface ForumReactionReplyAttributes extends ForumReactionBase {
  replyId: number;
}
