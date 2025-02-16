import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, EyeOff, Video, FileText, ImageIcon, LinkIcon } from 'lucide-react';
import { Resource } from '../types/resource';

interface ResourceHeaderProps {
  resource: Resource;
}

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

const ResourceHeader: React.FC<ResourceHeaderProps> = ({ resource }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/recursos"
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
            {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Fecha no disponible'}
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
  );
};

export default ResourceHeader;