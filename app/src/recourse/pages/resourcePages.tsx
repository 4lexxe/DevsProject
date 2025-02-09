import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Eye, Video, File, Image, Link as LinkIcon, ExternalLink, Calendar, User } from 'lucide-react';
import { resourceService } from '../services/resource.service';
import { Resource, ResourceType } from '../types/resource';

const ResourcePage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceService.getAllResources();
      setResources(data);
    } catch (error) {
      toast.error('Error al cargar los recursos');
    } finally {
      setIsLoading(false);
    }
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case ResourceType.VIDEO:
        return <Video className="w-6 h-6" />;
      case ResourceType.DOCUMENT:
        return <File className="w-6 h-6" />;
      case ResourceType.IMAGE:
        return <Image className="w-6 h-6" />;
      case ResourceType.LINK:
        return <LinkIcon className="w-6 h-6" />;
    }
  };

  const getAvatarUrl = (userName: string, userAvatar?: string | null): string => {
    if (userAvatar === "https://default-avatar-url.com/avatar.png") {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'Anónimo')}&background=random`;
    }

    if (userAvatar && isValidUrl(userAvatar)) {
      return userAvatar;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'Anónimo')}&background=random`;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <File className="w-6 h-6 text-gray-600" />
              Recursos Disponibles
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {resources.map((resource) => (
              <div key={resource.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-6">
                {/* Portada del recurso con fallback */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="relative w-full sm:w-28 h-28 bg-gray-50 rounded-lg overflow-hidden">
                    {resource.coverImage ? (
                      <img
                        src={resource.coverImage}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        {getResourceIcon(resource.type)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                      {getResourceIcon(resource.type)}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h4 className="text-lg font-medium text-gray-900 line-clamp-2">{resource.title}</h4>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm group"
                    >
                      <Eye className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700" />
                      Ver recurso
                      <ExternalLink className="w-4 h-4 ml-2 text-gray-400 group-hover:text-gray-600" />
                    </a>
                  </div>

                  {resource.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2 sm:line-clamp-none">
                      {resource.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={getAvatarUrl(resource.userName, resource.userAvatar)}
                          alt={resource.userName || 'Anónimo'}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-white object-cover"
                        />
                        <User className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-gray-500 bg-white rounded-full" />
                      </div>
                      <span className="font-medium text-gray-700">{resource.userName || 'Anónimo'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(resource.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {resources.length === 0 && (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <File className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No hay recursos disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;