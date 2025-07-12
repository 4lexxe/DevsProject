import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Clock, Share2, Edit, Trash2 } from 'lucide-react';
import ResourceTypeIcon from '../types/ResourceTypeIcon';
import ResourceUserInfo from '../userInfo/ResourceUserInfo';
import RatingComponent from './Rating';
import { usePermissions } from '../../shared/hooks/usePermissions';

interface Resource {
  id: number;
  type: string;
  title: string;
  description?: string;
  url: string;
  coverImage?: string;
  userId: number;
  User?: {
    id: number;
    name: string;
    username?: string;
    displayName?: string;
  };
  createdAt: string;
}

interface UserInfo {
  id: number;
  name: string;
  username?: string;
  displayName?: string;
  avatar?: string;
}

interface ResourceCardProps {
  resource: Resource;
  user: UserInfo;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, user }) => {
  const { canModifyResource } = usePermissions();

  const truncateText = (text: string, maxLength: number = 55): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const canEdit = canModifyResource(resource.userId);

  return (
    <div className="group relative bg-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-400 select-none">
      <div className="flex flex-col sm:flex-row">
        {/* Resource Image with Overlay - Smaller on mobile */}
        <div className="h-40 sm:h-auto sm:w-56 sm:min-w-[14rem] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-50">
              <img
                src={
                  resource.coverImage ||
                  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                }
                alt={resource.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick Action Icons */}
            <div className="absolute bottom-2 right-2 flex gap-1.5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              {canEdit && (
                <>
                  <button 
                    className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 text-blue-600 hover:text-blue-700 shadow-sm"
                    title="Editar recurso"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 text-red-600 hover:text-red-700 shadow-sm"
                    title="Eliminar recurso"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <button className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 text-gray-700 hover:text-gray-900 shadow-sm">
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 text-gray-700 hover:text-gray-900 shadow-sm">
                <Clock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Resource Content - Compact on mobile */}
        <div className="flex-1 p-3 sm:p-6 flex flex-col">
          {/* Header Section */}
          <div className="flex items-start gap-3">
            {/* Type Icon with Animation - Smaller on mobile */}
            <div className="p-2 sm:p-2.5 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100 shadow-sm group-hover:bg-gray-50 transition-all duration-200 group-hover:scale-105">
              <ResourceTypeIcon type={resource.type} />
            </div>

            {/* Title and Rating */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-1 sm:line-clamp-2">
                  {truncateText(resource.title)}
                </h3>
                <div className="flex-shrink-0">
                  <RatingComponent resourceId={resource.id} mode="interactive" />
                </div>
              </div>

              {/* Description - Hidden on mobile, visible on desktop */}
              {resource.description && (
                <p className="hidden sm:block mt-2 text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {resource.description}
                </p>
              )}
            </div>
          </div>

          {/* Footer Section - Simplified on mobile */}
          <div className="mt-3 sm:mt-auto pt-3 flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center justify-between border-t border-gray-100/80">
            <div className="sm:block">
              <ResourceUserInfo user={user} createdAt={resource.createdAt} />
            </div>
            <Link
              to={`/resources/${resource.id}`}
              className="group/button inline-flex items-center justify-center px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-500 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              <span className="mr-1.5">Ver Recurso</span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-all duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;