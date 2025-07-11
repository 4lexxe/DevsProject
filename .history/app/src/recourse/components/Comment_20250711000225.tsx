import React, { useState, useEffect } from 'react';
import { getCommentsByResource, createComment, updateComment, deleteComment } from '../services/comment.service';

interface Comment {
  id: number;
  userId: number;
  resourceId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  User?: {
    id: number;
    name: string;
    username?: string;
    displayName?: string;
    avatar?: string;
  };
}

interface CommentProps {
  resourceId: number;
}

const Comment: React.FC<CommentProps> = ({ resourceId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const commentsData = await getCommentsByResource(resourceId);
      
      const commentsWithUserInfo = commentsData.map((comment: Comment) => ({
        ...comment,
        User: comment.User || {
          id: comment.userId,
          name: `Usuario ${comment.userId}`,
          avatar: `https://ui-avatars.com/api/?name=Usuario+${comment.userId}&background=random`
        }
      }));
      
      setComments(commentsWithUserInfo);
    } catch (err) {
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [resourceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      await createComment({ resourceId, content: newComment.trim() });
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Error al crear el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, { content: editContent.trim() });
      setEditingId(null);
      setEditContent('');
      fetchComments();
    } catch (err) {
      setError('Error al actualizar el comentario');
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      setError('Error al eliminar el comentario');
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Comentarios</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Comentarios ({comments.length})
      </h3>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-500 hover:text-red-700 text-xs underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {newComment.length}/500 caracteres
            </span>
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.User?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.User?.name || 'Usuario')}&background=random`}
                    alt={comment.User?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {comment.User?.name || `Usuario ${comment.userId}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt !== comment.createdAt && ' (editado)'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(comment)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={2}
                    maxLength={500}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comment;
