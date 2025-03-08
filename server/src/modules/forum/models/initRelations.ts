/**
 * Este archivo maneja la inicialización de relaciones entre modelos DESPUÉS
 * de que todos los modelos han sido completamente cargados y definidos.
 */

// NO importar los modelos directamente para evitar ciclos


export function initForumRelations(models: any) {
    const {
      User,
      ForumCategory,
      ForumThread,
      ForumPost,
      ForumReply,
      ForumVotePost,
      ForumVoteReply,
      ForumReactionPost,
      ForumReactionReply,
      ForumFlair,
      Report
    } = models;
  
    // Relaciones de ForumCategory
    ForumCategory.hasMany(ForumThread, {
      sourceKey: "id",
      foreignKey: "categoryId",
      as: "threads",
    });
    
    // Relaciones de ForumThread
    ForumThread.hasMany(ForumPost, {
      sourceKey: "id",
      foreignKey: "threadId",
      as: "posts",
    });
    
    ForumThread.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
    
    ForumThread.belongsTo(ForumCategory, {
      foreignKey: 'categoryId',
      onUpdate: 'CASCADE'
    });
  
    // Relaciones de ForumPost
    ForumPost.belongsTo(ForumThread, {
      foreignKey: "threadId",
      as: "thread",
    });
    
    ForumPost.hasMany(ForumReply, {
      sourceKey: "id",
      foreignKey: "postId",
      as: "replies",
    });
    
    ForumPost.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
    
    ForumPost.hasMany(ForumVotePost, {
      foreignKey: "postId",
      as: "votes",
    });
    
    ForumPost.hasMany(ForumReactionPost, {
      foreignKey: "postId",
      as: "reactions",
    });
  
    // Relaciones de ForumReply
    ForumReply.belongsTo(ForumPost, {
      foreignKey: "postId",
      as: "post",
    });
    
    ForumReply.hasMany(ForumReply, {
      sourceKey: "id",
      foreignKey: "parentReplyId",
      as: "childReplies",
    });
    
    ForumReply.belongsTo(ForumReply, {
      foreignKey: "parentReplyId",
      as: "parentReply",
    });
    
    ForumReply.hasMany(ForumReactionReply, {
      foreignKey: "replyId",
      as: "reactions",
    });
    
    ForumReply.hasMany(ForumVoteReply, {
      foreignKey: "replyId",
      as: "votes",
    });
    
    ForumReply.belongsTo(User, {
      foreignKey: "authorId",
      as: "author",
    });
  
    // Relaciones de ForumVotePost
    ForumVotePost.belongsTo(ForumPost, {
      foreignKey: "postId",
      as: "post",
      onDelete: 'CASCADE'
    });
    
    ForumVotePost.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
    
    User.hasMany(ForumVotePost, {
      foreignKey: "userId",
      as: "votes",
    });
  
    // Relaciones de ForumVoteReply
    ForumVoteReply.belongsTo(ForumReply, {
      foreignKey: "replyId",
      as: "reply",
      onDelete: 'CASCADE'
    });
    
    ForumVoteReply.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
    
    User.hasMany(ForumVoteReply, {
      foreignKey: "userId",
      as: "replyVotes",
    });
  
    // Relaciones de ForumReactionPost
    ForumReactionPost.belongsTo(User, { 
      foreignKey: "userId", 
      as: "user" 
    });
    
    ForumReactionPost.belongsTo(ForumPost, { 
      foreignKey: "postId", 
      as: "post" 
    });
    
    User.hasMany(ForumReactionPost, { 
      foreignKey: "userId", 
      as: "postReactions" 
    });
  
    // Relaciones de ForumReactionReply
    ForumReactionReply.belongsTo(User, { 
      foreignKey: "userId", 
      as: "user" 
    });
    
    ForumReactionReply.belongsTo(ForumReply, { 
      foreignKey: "replyId", 
      as: "reply" 
    });
    
    User.hasMany(ForumReactionReply, { 
      foreignKey: "userId", 
      as: "replyReactions" 
    });
  
    // Relaciones de ForumFlair
    ForumFlair.belongsTo(User, {
      foreignKey: "createdBy",
      as: "creator",
    });
    
    ForumFlair.belongsToMany(User, {
      through: "UserFlairs",
      foreignKey: "flairId",
      otherKey: "userId",
      as: "users",
    });
    
    User.belongsToMany(ForumFlair, {
      through: "UserFlairs",
      foreignKey: "userId",
      otherKey: "flairId",
      as: "flairs",
    });
    
    ForumFlair.belongsToMany(ForumPost, {
      through: "PostFlairs",
      foreignKey: "flairId",
      otherKey: "postId",
      as: "posts",
    });
    
    ForumPost.belongsToMany(ForumFlair, {
      through: "PostFlairs",
      foreignKey: "postId",
      otherKey: "flairId",
      as: "flairs",
    });
    
    ForumFlair.belongsToMany(ForumReply, {
      through: "ReplyFlairs",
      foreignKey: "flairId",
      otherKey: "replyId",
      as: "replies",
    });
    
    ForumReply.belongsToMany(ForumFlair, {
      through: "ReplyFlairs",
      foreignKey: "replyId",
      otherKey: "flairId",
      as: "flairs",
    });
  
    console.log("✅ Todas las relaciones del foro han sido inicializadas correctamente");
  }