/**
 * @file index.ts
 * @description Punto de entrada para los modelos del módulo de foro
 * Exporta todos los modelos, enumeraciones y establece relaciones adicionales
 */

import ForumCategory from './ForumCategory';
import ForumThread from './ForumThread';
import ForumPost from './ForumPost';
import ForumReply from './ForumReply';
import ForumVote, { VoteType } from './ForumVotePost';
import ForumFlair, { FlairType } from './ForumFlair';
import Report from './Report';
import ForumReactionPost from './ForumReactionPost';
import ForumReactionReply from './ForumReactionReply';
import ForumVoteReply, { VoteType as ReplyVoteType } from './ForumVoteReply';

// Establecer relaciones adicionales entre modelos
ForumPost.belongsTo(ForumThread, {
  foreignKey: 'threadId',
  as: 'thread',
});

// La mayoría de las relaciones ya están definidas en cada modelo individual
// Aquí solo agregamos las que involucran múltiples modelos o requieren contexto adicional

/**
 * Exportación de todos los modelos y enumeraciones
 * Esto permite importar elementos específicos cuando sea necesario
 */
export {
  ForumCategory,
  ForumThread,
  ForumPost,
  ForumReply,
  ForumVote,
  VoteType,
  ForumFlair,
  FlairType,
  Report,
  ForumReactionPost,
  ForumReactionReply,
  ForumVoteReply,
  ReplyVoteType,
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
  ForumVote,
  ForumFlair,
  Report,
  ForumReactionPost,
  ForumReactionReply,
  ForumVoteReply,
};