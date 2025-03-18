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
        PostFlair,
        UserFlair,
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
    // Posts - Utilizando modelo PostFlair explícitamente
    ForumPost.belongsToMany(ForumFlair, {
        through: PostFlair,
        foreignKey: "postId",
        otherKey: "flairId",
        as: "flairs",
        onDelete: "CASCADE"
    });

    ForumFlair.belongsToMany(ForumPost, {
        through: PostFlair,
        foreignKey: "flairId",
        otherKey: "postId",
        as: "posts",
        onDelete: "CASCADE"
    });

    // Relaciones directas para PostFlair
    PostFlair.belongsTo(ForumPost, {
        foreignKey: "postId",
        as: "post"
    });

    PostFlair.belongsTo(ForumFlair, {
        foreignKey: "flairId",
        as: "flair"
    });

    PostFlair.belongsTo(User, {
        foreignKey: "assignedBy",
        as: "assigner"
    });

    // No mantenemos relaciones para ReplyFlairs ya que no existe ese modelo actualmente
    // Si se necesita en el futuro, se debe crear un modelo específico ReplyFlair

    // Creador de Flairs
    ForumFlair.belongsTo(User, {
        foreignKey: "createdBy",
        as: "creator"
    });

    User.hasMany(ForumFlair, {
        foreignKey: "createdBy",
        as: "createdFlairs"
    });

    // 8. Relaciones Usuario-Flairs (Asignación) - Utilizando modelo UserFlair explícitamente
    User.belongsToMany(ForumFlair, {
        through: UserFlair,
        foreignKey: "userId",
        otherKey: "flairId",
        as: "assignedFlairs"
    });

    ForumFlair.belongsToMany(User, {
        through: UserFlair,
        foreignKey: "flairId",
        otherKey: "userId",
        as: "assignedUsers"
    });

    // Relaciones directas para UserFlair
    UserFlair.belongsTo(User, {
        foreignKey: "userId",
        as: "user"
    });

    UserFlair.belongsTo(ForumFlair, {
        foreignKey: "flairId",
        as: "flair"
    });

    console.log("✅ Relaciones actualizadas correctamente");
}