import { Model } from "sequelize";

export function initForumRelations(models: any): void {
    const {
        User,
        ForumCategory,
        ForumPost,
        ForumReply,
        ForumVotePost,
        ForumVoteReply,
        ForumReactionPost,
        ForumReactionReply,
        ForumFlair,
    } = models;

    // 1. Relaciones de Categorías
    ForumCategory.hasMany(ForumPost, {
        foreignKey: "categoryId",
        as: "posts",
        onDelete: "CASCADE"
    });

    ForumPost.belongsTo(ForumCategory, {
        foreignKey: "categoryId",
        as: "category"
    });

    // 2. Relaciones de Usuarios
    User.hasMany(ForumPost, {
        foreignKey: "authorId",
        as: "posts"
    });

    ForumPost.belongsTo(User, {
        foreignKey: "authorId",
        as: "author"
    });

    User.hasMany(ForumReply, {
        foreignKey: "authorId",
        as: "replies"
    });

    ForumReply.belongsTo(User, {
        foreignKey: "authorId",
        as: "author"
    });

    // 3. Relaciones de Posts y Replies
    ForumPost.hasMany(ForumReply, {
        foreignKey: "postId",
        as: "replies",
        onDelete: "CASCADE"
    });

    ForumReply.belongsTo(ForumPost, {
        foreignKey: "postId",
        as: "post"
    });

    // 4. Relaciones Anidadas de Replies
    ForumReply.hasMany(ForumReply, {
        foreignKey: "parentReplyId",
        as: "childReplies",
        onDelete: "CASCADE"
    });

    ForumReply.belongsTo(ForumReply, {
        foreignKey: "parentReplyId",
        as: "parentReply"
    });

    // 5. Relaciones de Votos
    ForumPost.hasMany(ForumVotePost, {
        foreignKey: "postId",
        as: "votes",
        onDelete: "CASCADE"
    });

    ForumVotePost.belongsTo(ForumPost, {
        foreignKey: "postId",
        as: "post"
    });

    ForumReply.hasMany(ForumVoteReply, {
        foreignKey: "replyId",
        as: "votes",
        onDelete: "CASCADE"
    });

    ForumVoteReply.belongsTo(ForumReply, {
        foreignKey: "replyId",
        as: "reply"
    });

    // 6. Relaciones de Reacciones
    ForumPost.hasMany(ForumReactionPost, {
        foreignKey: "postId",
        as: "reactions",
        onDelete: "CASCADE"
    });

    ForumReactionPost.belongsTo(ForumPost, {
        foreignKey: "postId",
        as: "post"
    });

    ForumReply.hasMany(ForumReactionReply, {
        foreignKey: "replyId",
        as: "reactions",
        onDelete: "CASCADE"
    });

    ForumReactionReply.belongsTo(ForumReply, {
        foreignKey: "replyId",
        as: "reply"
    });

    // 7. Relaciones de Flairs (Etiquetas)
    // Posts
    ForumPost.belongsToMany(ForumFlair, {
        through: "PostFlairs",
        foreignKey: "postId",
        otherKey: "flairId",
        as: "flairs",
        onDelete: "CASCADE"
    });

    ForumFlair.belongsToMany(ForumPost, {
        through: "PostFlairs",
        foreignKey: "flairId",
        otherKey: "postId",
        as: "posts",
        onDelete: "CASCADE"
    });

    // Replies
    ForumReply.belongsToMany(ForumFlair, {
        through: "ReplyFlairs",
        foreignKey: "replyId",
        otherKey: "flairId",
        as: "flairs",
        onDelete: "CASCADE"
    });

    ForumFlair.belongsToMany(ForumReply, {
        through: "ReplyFlairs",
        foreignKey: "flairId",
        otherKey: "replyId",
        as: "replies",
        onDelete: "CASCADE"
    });

    // Creador de Flairs
    ForumFlair.belongsTo(User, {
        foreignKey: "createdBy",
        as: "creator"
    });

    User.hasMany(ForumFlair, {
        foreignKey: "createdBy",
        as: "createdFlairs"
    });

    // 8. Relaciones Usuario-Flairs (Asignación)
    User.belongsToMany(ForumFlair, {
        through: "UserFlairs",
        foreignKey: "userId",
        otherKey: "flairId",
        as: "assignedFlairs"
    });

    ForumFlair.belongsToMany(User, {
        through: "UserFlairs",
        foreignKey: "flairId",
        otherKey: "userId",
        as: "assignedUsers"
    });

    console.log("✅ Relaciones actualizadas correctamente");
}