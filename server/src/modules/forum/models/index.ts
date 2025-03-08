/**
 * @file index.ts
 * @description Punto de entrada para los modelos del módulo de foro
 * Exporta todos los modelos, enumeraciones y establece relaciones adicionales
 */

import ForumCategory from './ForumCategory';
import ForumThread from './ForumThread';
import ForumPost from './ForumPost';
import ForumReply from './ForumReply';
import ForumVotePost, { VoteType } from './ForumVotePost';
import ForumFlair, { FlairType, predefinedFlairs } from './ForumFlair';
import Report from './Report';
import ForumReactionPost from './ForumReactionPost';
import ForumReactionReply from './ForumReactionReply';
import ForumVoteReply, { VoteType as ReplyVoteType } from './ForumVoteReply';



/**
 * Exportación de todos los modelos y enumeraciones
 * Esto permite importar elementos específicos cuando sea necesario
 */
export {
  ForumCategory,
  ForumThread,
  ForumPost,
  ForumReply,
  ForumVotePost,
  VoteType,
  ForumFlair,
  FlairType,
  Report,
  ForumReactionPost,
  ForumReactionReply,
  ForumVoteReply,
  ReplyVoteType,
  predefinedFlairs,
};

/**
 * Exportación por defecto de todos los modelos como un objeto único
 * Útil para importar todos los modelos de una vez
 */
export default {
  ForumCategory,
  ForumThread,
  ForumPost,
  ForumReply,
  ForumVotePost,
  ForumFlair,
  Report,
  ForumReactionPost,
  ForumReactionReply,
  ForumVoteReply,
  predefinedFlairs,
};