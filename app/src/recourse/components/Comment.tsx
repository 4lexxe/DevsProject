import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Comment as CommentModel } from '../services/comment.service';
import { createComment, getCommentsByResource } from '../services/comment.service';

interface CommentProps {
  resourceId: number; // ID del recurso al que pertenecen los comentarios
}

const Comment: React.FC<CommentProps> = ({ resourceId }) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  // Cargar los comentarios al montar el componente
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsByResource(resourceId);
        setComments(fetchedComments);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || 'Error al cargar los comentarios');
        } else {
          toast.error('Error al cargar los comentarios');
        }
      }
    };
    fetchComments();
  }, [resourceId]);

  // Manejar el envío del nuevo comentario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }

    try {
      // Crear el nuevo comentario
      const createdComment = await createComment({
        resourceId,
        content: newComment,
      });

      // Actualizar la lista de comentarios
      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment(''); // Limpiar el campo de texto
      toast.success('Comentario agregado exitosamente');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error al agregar el comentario');
      } else {
        toast.error('Error al agregar el comentario');
      }
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Comentarios</h2>

      {/* Lista de comentarios */}
      {comments.length === 0 ? (
        <p className="text-gray-500">No hay comentarios disponibles.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{comment.content}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Por {comment.User?.name || 'Usuario desconocido'}
                </span>
                <span className="text-xs text-gray-500">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Fecha desconocida'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar un nuevo comentario */}
      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Agregar Comentario
        </button>
      </form>
    </div>
  );
};

export default Comment;