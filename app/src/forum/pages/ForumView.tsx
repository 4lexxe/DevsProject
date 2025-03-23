import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import LeftPanel from '../components/LeftPanel';
import Post from '../components/Post';
import ForumPostService from '../services/forumPost.service';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FlairType } from '../services/forumFlair.service';
import { ForumPost } from '../services/forumPost.service';


// Implementación básica del componente ForumView
const ForumView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Consulta para obtener posts
  const { 
    data: postsData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['posts', currentPage, searchTerm],
    queryFn: async () => {
      return await ForumPostService.getPosts(
        currentPage, 
        10, 
        undefined, 
        searchTerm || undefined
      );
    },
    refetchOnWindowFocus: false
  });

  // Manejador para votar en un post
  const handleVote = useCallback(async (postId: number, voteType: 'up' | 'down') => {
    try {
      // Implementación provisional - se actualizará cuando el servicio esté disponible
      console.log('Votando', postId, voteType);
      refetch();
      return Promise.resolve();
    } catch (error) {
      console.error('Error al votar:', error);
      toast.error('No se pudo registrar tu voto. Inténtalo de nuevo.');
      return Promise.reject(error);
    }
  }, [refetch]);

  // Manejador para guardar/remover favoritos
  const handleBookmark = useCallback(async (postId: number, bookmarked: boolean) => {
    try {
      // Implementación provisional - se actualizará cuando el servicio esté disponible
      console.log('Guardando/removiendo favorito', postId, bookmarked);
      toast.success(bookmarked ? 'Post guardado' : 'Post removido de guardados');
      refetch();
      return Promise.resolve();
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
      toast.error('No se pudo actualizar el favorito. Inténtalo de nuevo.');
      return Promise.reject(error);
    }
  }, [refetch]);

  // Renderización del spinner de carga
  const renderLoading = () => (
    <div className="text-center py-10">
      <div className="spinner-border" role="status">
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );

  // Renderización de mensaje de error
  const renderError = () => (
    <div className="text-center py-10 text-red-500">
      Error al cargar publicaciones. Intenta refrescar la página.
    </div>
  );

  // Renderización cuando no hay publicaciones
  const renderNoPosts = () => (
    <div className="text-center py-10 text-gray-500">
      No hay publicaciones disponibles.
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Panel izquierdo */}
      <LeftPanel />

      {/* Contenido principal */}
      <main className="flex-1 p-4">
        {/* Barra superior con búsqueda y crear post */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </span>
          </div>
          
          <Link 
            to="/forum/create-post" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiPlus className="mr-2" />
            Crear publicación
          </Link>
        </div>

        {/* Lista de posts */}
        <div className="space-y-4">
          {isLoading 
            ? renderLoading()
            : isError 
              ? renderError()
              : postsData?.data?.length === 0 
                ? renderNoPosts()
                : (
                  <>
                    {/* Lista de publicaciones */}
                    {postsData?.data?.map((post: ForumPost) => (
            <Post
              key={post.id}
              post={{
                ...post,
                commentsCount: post.replyCount,
                upvotes: post.upvoteCount,
                downvotes: post.downvoteCount,
                bookmarked: false,
                downvoteCount: post.downvoteCount,
                // Manejar valores opcionales con valores por defecto
                author: post.author ?? { 
                  id: post.authorId,
                  username: 'Usuario anónimo',
                  avatar: undefined
                },
                // Type casting solo para propiedades complejas
                flairs: (post.flairs ?? []) as Array<{
                  id: number;
                  name: string;
                  color: string;
                  icon?: string;
                  description: string;
                  type: FlairType;
                  isActive: boolean;
                }>
              }}
              compact={true}
              onVote={handleVote}
              onBookmark={handleBookmark}
            />
          ))}

                    {/* Paginación */}
                    {(postsData?.pagination?.totalPages ?? 0) > 1 && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          Anterior
                        </button>
                        
                        <span className="px-4 py-2 mx-1">
                          Página {currentPage} de {postsData?.pagination?.totalPages ?? 1}
                        </span>
                        
                        <button
                          onClick={() => setCurrentPage(prev => 
                            Math.min(prev + 1, postsData?.pagination?.totalPages ?? 1)
                          )}
                          disabled={currentPage === (postsData?.pagination?.totalPages ?? 1)}
                          className="px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                )
          }
        </div>
      </main>
    </div>
  );
};

export default ForumView;
