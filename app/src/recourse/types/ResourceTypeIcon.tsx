import React from 'react';
import { Video, FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface ResourceTypeIconProps {
  type: string;
}

const ResourceTypeIcon: React.FC<ResourceTypeIconProps> = ({ type }) => {
  const iconClasses = "w-5 h-5";
  
  switch (type) {
    case "video":
      return <Video className={`${iconClasses} text-gray-900`} />;
    case "document":
      return <FileText className={`${iconClasses} text-gray-900`} />;
    case "image":
      return <ImageIcon className={`${iconClasses} text-gray-900`} />;
    case "link":
      return <LinkIcon className={`${iconClasses} text-gray-900`} />;
    default:
      return null;
  }
};

export default ResourceTypeIcon;