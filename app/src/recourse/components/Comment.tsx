import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MessageSquare, Send, AlertCircle, Loader2 } from "lucide-react";
import { Comment as CommentModel } from "../services/comment.service";
import {
  createComment,
  getCommentsByResource,
} from "../services/comment.service";
import { useAuth } from "../../auth/contexts/AuthContext";
import { UserService } from "../../profile/services/user.service";

interface CommentProps {
  resourceId: number;
}

const Comment: React.FC<CommentProps> = ({ resourceId }) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const fetchedComments = await getCommentsByResource(resourceId);

        const commentsWithUserDetails = await Promise.all(
          fetchedComments.map(async (comment) => {
            if (!comment.User) {
              return {
                ...comment,
                User: {
                  id: 0,
                  name: "Usuario desconocido",
                  avatar: `https://ui-avatars.com/api/?name=Unknown&background=random`,
                },
              };
            }

            const userDetails = await UserService.getUserById(comment.User.id);
            return {
              ...comment,
              User: {
                id: userDetails.id,
                name: userDetails.name || "Usuario desconocido",
                avatar:
                  userDetails.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userDetails.name
                  )}&background=random`,
              },
            };
          })
        );

        setComments(commentsWithUserDetails);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        toast.error(`Error al cargar los comentarios: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [resourceId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    try {
      setIsSubmitting(true);
      const createdComment = await createComment({
        resourceId,
        content: newComment,
      });

      const updatedComment = {
        ...createdComment,
        User: {
          id: user?.id || 0,
          name: user?.name || "Usuario desconocido",
          avatar:
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "U"
            )}&background=random`,
        },
      };

      setComments((prevComments) => [updatedComment, ...prevComments]);
      setNewComment("");
      toast.success("Comentario agregado exitosamente");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al agregar el comentario: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("es-ES", options);
  };

  const handleLoadMore = () => {
    setVisibleCommentsCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Comentarios ({comments.length})
          </h2>
        </div>
      </div>

      {/* Formulario para nuevo comentario */}
      {user ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black shadow-sm">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
                  disabled={isSubmitting}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-500">Debes iniciar sesión para comentar</p>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay comentarios aún.</p>
            <p className="text-gray-400 text-sm">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <>
            {comments.slice(0, visibleCommentsCount).map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Información del usuario y fecha - Ahora visible en móvil */}
                  <div className="flex items-center gap-3 sm:hidden mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-black shadow-sm">
                      {comment.User?.avatar ? (
                        <img
                          src={comment.User.avatar}
                          alt={comment.User.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {comment.User?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {comment.User?.name || "Usuario desconocido"}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt || "")}
                      </span>
                    </div>
                  </div>

                  {/* Avatar y contenido - Estructura principal */}
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black shadow-sm">
                      {comment.User?.avatar ? (
                        <img
                          src={comment.User.avatar}
                          alt={comment.User.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {comment.User?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Información del usuario y fecha - Solo visible en desktop */}
                    <div className="hidden sm:flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {comment.User?.name || "Usuario desconocido"}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {formatDate(comment.createdAt || "")}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {visibleCommentsCount < comments.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Ver más comentarios
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
