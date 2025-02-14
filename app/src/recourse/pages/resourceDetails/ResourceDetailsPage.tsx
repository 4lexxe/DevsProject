import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  ArrowLeft,
  Calendar,
  Eye,
  EyeOff,
  ExternalLink,
  Video,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import { ResourceService } from '../../services/resource.service';
import { UserService } from '../../../profile/services/user.service';
import { toast } from 'react-hot-toast';

interface Resource {
  id: number;
  type: string;
  title: string;
  description?: string;
  url: string;
  coverImage?: string;
  userId: number;
  createdAt: string;
  isVisible: boolean;
}

interface UserInfo {
  id: number;
  name: string;
  avatar?: string;
}

const ResourceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageError, setIsImageError] = useState(false);

  // Función para verificar si la URL es de Google Drive
  const isGoogleDriveUrl = (url: string): boolean => {
    return url.includes('drive.google.com');
  };

  // Función para generar una URL de incrustación de Google Drive
  const generateGoogleDriveEmbedUrl = (url: string): string => {
    const fileId = url.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    throw new Error('No se pudo extraer el ID del archivo de Google Drive.');
  };

  useEffect(() => {
    const fetchResourceAndUser = async () => {
      try {
        setLoading(true);
        const resourceData = await ResourceService.getResourceById(Number(id));
        setResource(resourceData);
        const userData = await UserService.getUserById(resourceData.userId);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching resource details:', err);
        setError('Error al cargar el recurso. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchResourceAndUser();
    }
  }, [id]);

  const getResourceIcon = (type: string) => {
    const iconProps = { className: "w-6 h-6" };
    switch (type) {
      case 'video':
        return <Video {...iconProps} />;
      case 'document':
        return <FileText {...iconProps} />;
      case 'image':
        return <ImageIcon {...iconProps} />;
      case 'link':
        return <LinkIcon {...iconProps} />;
      default:
        return null;
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
      toast.error('Error al copiar el enlace');
    }
  };

  const renderContent = () => {
    if (!resource) return null;

    // Verificar si la URL es de Google Drive
    const isGoogleDriveVideo = isGoogleDriveUrl(resource.url);
    const embedUrl = isGoogleDriveVideo ? generateGoogleDriveEmbedUrl(resource.url) : resource.url;

    switch (resource.type) {
      case 'video':
        return (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            {isGoogleDriveVideo ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                allow="autoplay"
                title="Video Player"
                className="rounded-lg"
              ></iframe>
            ) : (
              <ReactPlayer
                url={embedUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                className="react-player"
              />
            )}
          </div>
        );
        case 'image':
          return (
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              {!isImageError ? (
                <img
                  src={resource.url}
                  alt={resource.title}
                  className="w-full h-auto"
                  onError={() => setIsImageError(true)}
                />
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>
          );
        case 'document':
        case 'link':
          return (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir recurso
            </a>
          );
      }
    };
  
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-800"></div>
        </div>
      );
    }
  
    if (error || !resource) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <p className="text-red-700">{error || 'Recurso no encontrado'}</p>
              <Link
                to="/resources"
                className="mt-4 inline-flex items-center text-red-700 hover:text-red-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a recursos
              </Link>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/resources"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{resource.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="p-2 rounded-md bg-gray-50 border border-gray-200">
                  {getResourceIcon(resource.type)}
                </div>
                <span className="text-sm font-medium capitalize">
                  {resource.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>
              {resource.isVisible ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Visible</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <EyeOff className="w-4 h-4" />
                  <span className="text-sm">No visible</span>
                </div>
              )}
            </div>
          </div>
          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Resource Preview */}
            <div className="p-6 border-b border-gray-200">
              {renderContent()}
            </div>
            {/* Resource Info */}
            <div className="p-6">
              {resource.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Descripción
                  </h2>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {resource.description}
                  </p>
                </div>
              )}
              {/* Author Info */}
              {user && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">
                      Publicado por
                    </span>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </button>
                <Link
                  to={`/resources/${resource.id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Link>
                <button
                  onClick={() => {
                    // Implement delete functionality
                    toast.error('Función no implementada');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ResourceDetailsPage;