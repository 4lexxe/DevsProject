import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import ResourceTypeIcon from '../types/ResourceTypeIcon';
import ResourceUserInfo from '../userInfo/ResourceUserInfo';
import RatingComponent from './Rating';

interface Resource {
  id: number;
  type: string;
  title: string;
  description?: string;
  url: string;
  coverImage?: string;
  userId: number;
  createdAt: string;
}

interface UserInfo {
  id: number;
  name: string;
  avatar?: string;
}

interface ResourceCardProps {
  resource: Resource;
  user: UserInfo;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, user }) => {
  const truncateText = (text: string, maxLength: number = 55): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 select-none">
      <div className="sm:flex">
      {/* Resource Image */}
      <div className="sm:w-56 sm:min-w-[14rem] relative overflow-hidden flex items-center justify-center">
        <div className="w-full pb-[75%] pt-1 relative">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img
          src={
            resource.coverImage ||
            "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          }
          alt={resource.title}
          className="max-w-none w-auto h-full transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Resource Content */}
      <div className="flex-1 p-6">
        {/* Header Section with Type Icon, Title, and Rating */}
        <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className="p-2.5 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100 shadow-sm group-hover:bg-gray-50 transition-all duration-200">
          <ResourceTypeIcon type={resource.type} />
        </div>

        {/* Title and Rating Container */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors truncate">
            {truncateText(resource.title)}
          </h3>
          <div className="flex-shrink-0">
            <RatingComponent resourceId={resource.id} mode="interactive" />
          </div>
          </div>

          {/* Description */}
          {resource.description && (
          <p className="mt-2 text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
          )}
        </div>
        </div>

        {/* Footer Section with User Info and Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-t border-gray-100/80 pt-4">
        <ResourceUserInfo user={user} createdAt={resource.createdAt} />
        <Link
          to={`/resources/${resource.id}`}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto group"
        >
          Ver Recurso
          <ExternalLink className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ResourceCard;
