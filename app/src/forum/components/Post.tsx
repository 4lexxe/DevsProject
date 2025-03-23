import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MDXEditorComponent from './MDXeditor';
import FlairTag from './FlairTagDisplay';
import { FaRegComment, FaShare, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { FiArrowUp, FiArrowDown, FiMoreHorizontal, FiExternalLink } from 'react-icons/fi';
import { ForumPost, ContentType } from '../services/forumPost.service';
import ForumFlairService,{ ForumFlair } from '../services/forumFlair.service';
import TimeAgo from 'timeago-react';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  avatar?: string;
}

// Updated interface to better match ForumPost from service
interface PostComponentProps {
  post: ForumPost & {
    author: User;
    flairs: ForumFlair[];
    // Map service fields to component expectations
    commentsCount?: number;
    upvotes?: number;
    downvotes?: number;
    userVote?: 'up' | 'down';
    bookmarked: boolean;
  };
  compact?: boolean; // Para mostrar una versión compacta en listados
  showCommentsOnLoad?: boolean; // Para pre-cargar comentarios
  onVote?: (postId: number, voteType: 'up' | 'down') => Promise<void>;
  onBookmark?: (postId: number, bookmarked: boolean) => Promise<void>;
}

const PostComponent: React.FC<PostComponentProps> = ({ 
  post, 
  compact = false, 
  showCommentsOnLoad = false,
  onVote,
  onBookmark
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(showCommentsOnLoad);
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [localVote, setLocalVote] = useState<'up' | 'down' | undefined>(post.userVote);
  const [localBookmarked, setLocalBookmarked] = useState(post.bookmarked);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Handle missing values with fallbacks for better stability
  const upvotes = post.upvotes ?? post.upvoteCount ?? 0;
  const downvotes = post.downvotes ?? post.downvoteCount ?? 0;
  const commentsCount = post.commentsCount ?? post.replyCount ?? 0;
  
  // Calcular el puntaje basado en el voto local para actualización inmediata en UI
  const calculateScore = useCallback(() => {
    let baseScore = upvotes - downvotes;
    if (localVote === 'up' && post.userVote !== 'up') baseScore += 1;
    if (localVote === 'down' && post.userVote !== 'down') baseScore -= 1;
    if (localVote === undefined && post.userVote === 'up') baseScore -= 1;
    if (localVote === undefined && post.userVote === 'down') baseScore += 1;
    return baseScore;
  }, [upvotes, downvotes, localVote, post.userVote]);

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting) return;
    
    // Optimistic UI update
    if (localVote === type) {
      setLocalVote(undefined); // Si ya votó así, elimina el voto
    } else {
      setLocalVote(type); // Cambia o agrega voto
    }
    
    if (onVote) {
      setIsVoting(true);
      try {
        await onVote(post.id, type);
      } catch {
        // Revertir cambio en caso de error
        setLocalVote(post.userVote);
        toast.error('No se pudo registrar tu voto');
      } finally {
        setIsVoting(false);
      }
    } else {
      console.log(`Voto ${type} para el post ${post.id}`);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarking) return;
    
    // Optimistic UI update
    setLocalBookmarked(!localBookmarked);
    
    if (onBookmark) {
      setIsBookmarking(true);
      try {
        await onBookmark(post.id, !localBookmarked);
      } catch {
        // Revertir cambio en caso de error
        setLocalBookmarked(post.bookmarked);
        toast.error('No se pudo guardar el post');
      } finally {
        setIsBookmarking(false);
      }
    }
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (post.contentType === ContentType.IMAGE && post.imageUrl) {
      const newIndex = direction === 'next' 
        ? (currentImageIndex + 1) % post.imageUrl.length
        : (currentImageIndex - 1 + post.imageUrl.length) % post.imageUrl.length;
      setCurrentImageIndex(newIndex);
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    // Solo navegar si el clic no fue en un botón o enlace
    if (
      !(e.target as HTMLElement).closest('button') && 
      !(e.target as HTMLElement).closest('a') &&
      !showFullImage
    ) {
      navigate(`/forum/posts/${post.id}`);
      setIsExpanded(true); // Expandir al navegar al post
    }
  };

  // Cerrar menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as HTMLElement).closest('.post-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const { data: flairs, isLoading, isError } = useQuery({
    queryKey: ['postFlairs', post.id],
    queryFn: () => ForumFlairService.getPostFlairs(Number(post.id)),
  });

  console.log('Flairs:', flairs); // Debug log
  console.log('Post flairs:', post.flairs); // Debug log

  if (isLoading) return <div>Cargando etiquetas...</div>;
  if (isError) return <div>Error cargando etiquetas</div>;

  // Improved render with accessibility enhancements
  return (
    <article 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors ${!compact && 'cursor-pointer'}`}
      onClick={!compact ? handlePostClick : undefined}
      role="article"
      aria-label={`Post: ${post.title}`}
    >
      {/* Vista principal */}
      <div className="flex">
        {/* Sidebar de votos al estilo Reddit */}
        <div className="flex flex-col items-center py-3 px-2 bg-gray-50 rounded-l-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote('up');
            }}
            className={`p-1.5 rounded-full hover:bg-green-50 ${
              localVote === 'up' ? 'text-green-600 bg-green-50' : 'hover:text-green-600'
            }`}
            disabled={isVoting}
            aria-label="Votar positivo"
            aria-pressed={localVote === 'up'}
          >
            <FiArrowUp className="w-5 h-5" />
          </button>
          <span className={`text-sm font-medium py-1 ${
            localVote === 'up' ? 'text-green-600' : 
            localVote === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}
          aria-label={`Puntuación: ${calculateScore()}`}
          >
            {calculateScore()}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote('down');
            }}
            className={`p-1.5 rounded-full hover:bg-red-50 ${
              localVote === 'down' ? 'text-red-600 bg-red-50' : 'hover:text-red-600'
            }`}
            disabled={isVoting}
            aria-label="Votar negativo"
            aria-pressed={localVote === 'down'}
          >
            <FiArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-3 flex-1">
          {/* Encabezado del post */}
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            <Link 
              to={`/user/${post.author.id}`} 
              className="flex items-center gap-1.5 hover:underline" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                {post.author.avatar ? (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium text-white">
                    {post.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              u/{post.author.username} 
            </Link>
            <span className="inline-block">•</span>
            <span><TimeAgo datetime={post.createdAt} /></span>
            
            <div className="ml-auto flex items-center gap-1">
              {Array.isArray(flairs) && flairs.map(flair => (
                flair.flair && (
                  <FlairTag 
                    key={flair.id} 
                    flair={flair.flair} 
                    className="text-xs px-1.5 py-0.5 inline-flex items-center" 
                  />
                )
              ))}
            </div>
          </div>

          {/* Etiquetas de advertencia */}
          {(post.isNSFW || post.isSpoiler) && (
            <div className="flex gap-2 mb-2">
              {post.isNSFW && (
                <span className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-100">
                  NSFW
                </span>
              )}
              {post.isSpoiler && (
                <span className="text-xs px-1.5 py-0.5 bg-yellow-50 text-yellow-600 rounded border border-yellow-100">
                  Spoiler
                </span>
              )}
            </div>
          )}

          {/* Título */}
          <h2 className="text-lg font-medium mb-2">{post.title}</h2>
          
          {/* Contenido según el tipo */}
          {!compact && (
            <div className="mb-3">
              {post.contentType === ContentType.TEXT && (
                <div className={`prose max-w-full ${isExpanded ? '' : 'max-h-56 overflow-hidden'}`}>
                  <MDXEditorComponent
                    initialContent={post.content}
                    readOnly
                    minHeight="auto"
                    className="border-none"
                  />
                  {!isExpanded && post.content.length > 300 && (
                    <div className="relative">
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                  )}
                </div>
              )}

              {post.contentType === ContentType.LINK && post.linkUrl && (
                <a
                  href={post.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group border border-gray-200 rounded-md p-2 hover:border-blue-200 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded-md">
                      <FiExternalLink className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {post.linkUrl}
                      </p>
                      {post.content && !compact && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {post.content.replace(/[#*]/g, '')}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              )}

              {post.contentType === ContentType.IMAGE && post.imageUrl && post.imageUrl.length > 0 && (
                <div className="relative group">
                  <div className={`relative bg-gray-100 rounded-md overflow-hidden ${compact ? 'max-h-48' : 'max-h-96'}`}>
                    <img
                      src={post.imageUrl[currentImageIndex]}
                      alt={`Contenido del post por ${post.author.username}`}
                      className="w-full h-full object-contain cursor-zoom-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullImage(true);
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                      }}
                    />
                    
                    {post.imageUrl.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {currentImageIndex + 1} / {post.imageUrl.length}
                      </div>
                    )}
                    
                    {post.imageUrl.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageNavigation('prev');
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <FiArrowUp className="w-4 h-4 rotate-90" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageNavigation('next');
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <FiArrowDown className="w-4 h-4 rotate-90" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {post.content && !compact && (
                    <div className="mt-3 text-gray-600">
                      <MDXEditorComponent
                        initialContent={post.content}
                        readOnly
                        minHeight="auto"
                        className="border-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mostrar el "Ver más" si el contenido es largo y está en modo compacto */}
          {compact && post.contentType === ContentType.TEXT && (
            <div className="text-sm text-gray-500 mb-2 line-clamp-2">
              {post.content.replace(/[#*]/g, '')}
            </div>
          )}

          {/* Barra de acciones */}
          <div className="flex items-center text-gray-500 mt-1">
            <Link 
              to={`/forum/posts/${post.id}#comments`}
              className="flex items-center gap-1 text-xs hover:bg-gray-100 py-1 px-2 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <FaRegComment className="w-3.5 h-3.5" />
              <span>{commentsCount} {commentsCount === 1 ? 'comentario' : 'comentarios'}</span>
            </Link>

            <button 
              className="flex items-center gap-1 text-xs hover:bg-gray-100 py-1 px-2 rounded ml-2"
              onClick={(e) => {
                e.stopPropagation();
                // Compartir post
                navigator.clipboard.writeText(window.location.origin + `/forum/posts/${post.id}`);
                toast.success('Enlace copiado al portapapeles');
              }}
            >
              <FaShare className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>

            <button 
              className="flex items-center gap-1 text-xs hover:bg-gray-100 py-1 px-2 rounded ml-2"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              disabled={isBookmarking}
            >
              {localBookmarked ? (
                <>
                  <FaBookmark className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-blue-600">Guardado</span>
                </>
              ) : (
                <>
                  <FaRegBookmark className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </>
              )}
            </button>

            <div className="relative ml-auto post-dropdown">
              <button 
                className="flex items-center text-xs hover:bg-gray-100 py-1 px-2 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                <FiMoreHorizontal className="w-4 h-4" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-8 z-10 bg-white shadow-lg rounded-md border border-gray-200 w-48 py-1">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      // Reportar post lógica
                      toast.success('Gracias por tu reporte');
                    }}
                  >
                    Reportar
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(false);
                      // Ocultar post lógica
                      toast.success('Post ocultado');
                    }}
                  >
                    Ocultar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de comentarios (opcional) */}
      {isExpanded && !compact && (
        <div className="border-t border-gray-100 p-4">
          {/* Aquí iría el componente de comentarios */}
          <div className="text-center text-gray-500 py-4">
            Cargando comentarios...
          </div>
        </div>
      )}

      {/* Modal de imagen completa */}
      {showFullImage && post.contentType === ContentType.IMAGE && post.imageUrl && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-screen p-4">
            <img
              src={post.imageUrl[currentImageIndex]}
              alt={`Contenido completo del post por ${post.author.username}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            {post.imageUrl.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageNavigation('prev');
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <FiArrowUp className="w-6 h-6 rotate-90" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageNavigation('next');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <FiArrowDown className="w-6 h-6 rotate-90" />
                </button>
              </>
            )}
            
            <button
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition-colors"
              onClick={() => setShowFullImage(false)}
            >
              <span className="sr-only">Cerrar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(PostComponent);