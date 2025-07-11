import React from 'react';
import { FileText, Video, Image, Link } from 'lucide-react';

interface ResourceTypeIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

const ResourceTypeIcon: React.FC<ResourceTypeIconProps> = ({ type, size = 'sm' }) => {
  // NO hacer llamadas al UserService aquí

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Video className={`${sizeClasses[size]} text-red-600`} />;
      case 'document':
        return <FileText className={`${sizeClasses[size]} text-blue-600`} />;
      case 'image':
        return <Image className={`${sizeClasses[size]} text-green-600`} />;
      case 'link':
      default:
        return <Link className={`${sizeClasses[size]} text-gray-600`} />;
    }
  };

  return getIcon();
};

export default ResourceTypeIcon;