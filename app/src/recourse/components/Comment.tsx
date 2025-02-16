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
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10); // Número de comentarios visibles inicialmente
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const fetchedComments = await getCommentsByResource(resourceId);

        // Obtener detalles completos de los usuarios usando UserService
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
    setVisibleCommentsCount((prevCount) => prevCount + 10); // Incrementa el número de comentarios visibles
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900">
          Comentarios ({comments.length})
        </h2>
      </div>

      {/* Formulario para nuevo comentario */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
      ) : (
        <div className="text-center py-4 mb-8">
          <p className="text-gray-500">Debes iniciar sesión para comentar</p>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay comentarios aún.</p>
        <p className="text-gray-400 text-sm">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <>
        {comments.slice(0, visibleCommentsCount).map((comment) => (
          <div
            key={comment.id}
            className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors w-full"
          >
            <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              {comment.User?.avatar ? (
            <img
              src={comment.User.avatar}
              alt={comment.User.name}
              className="w-full h-full object-cover"
            />
              ) : (
            <div className="w-full h-full bg-gray-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {comment.User?.name?.charAt(0) || "U"}
              </span>
            </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-gray-900">
            {comment.User?.name || "Usuario desconocido"}
              </h3>
              <span className="text-xs text-gray-500 shrink-0">
            {formatDate(comment.createdAt || "")}
              </span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>
            </div>
          </div>
        ))}

        {/* Botón "Ver más" */}
            {visibleCommentsCount < comments.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Ver más
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
