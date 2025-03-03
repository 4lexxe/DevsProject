/**
 * @file validationService.ts
 * @description Servicio para validaciones centralizadas
 */

import { ForumPost, ForumReply, ForumThread, ForumCategory } from '../models';

export class ForumValidationService {
  /**
   * Verifica que un post exista
   */
  static async postExists(postId: number): Promise<boolean> {
    const post = await ForumPost.findByPk(postId);
    return !!post;
  }
  
  /**
   * Verifica que una respuesta exista
   */
  static async replyExists(replyId: number): Promise<boolean> {
    const reply = await ForumReply.findByPk(replyId);
    return !!reply;
  }
  
  // Más métodos de validación...
}
