/**
 * @file index.ts
 * @description Punto de entrada para los modelos del módulo de foro
 * Exporta todos los modelos, enumeraciones y establece relaciones adicionales
 */

import ForumCategory, { predefinedCategories } from './ForumCategory';
import ForumPost from './ForumPost';
import ForumReply from './ForumReply';
import ForumVotePost, { VoteType } from './ForumVotePost';
import ForumFlair, { FlairType, predefinedFlairs } from './ForumFlair';
import Report from './Report';
import ForumReactionPost from './ForumReactionPost';
import ForumReactionReply from './ForumReactionReply';
import ForumVoteReply, { VoteType as ReplyVoteType } from './ForumVoteReply';
import User from "../../user/User";
import { initForumRelations } from './initRelations';

// Crear un objeto con todos los modelos
const models = {
  ForumCategory,
  ForumPost,
  ForumReply,
  ForumVotePost,
  ForumFlair,
  Report,
  ForumReactionPost,
  ForumReactionReply,
  ForumVoteReply,
  User,
};


// Inicializar todas las relaciones
initForumRelations(models);
/**
 * Exportación de todos los modelos y enumeraciones
 * Esto permite importar elementos específicos cuando sea necesario
 */
export {
  ForumCategory,
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
  predefinedCategories,
};

/**
 * Exportación por defecto de todos los modelos como un objeto único
 * Útil para importar todos los modelos de una vez
 */
export default models;