import React from 'react';
import {
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
} from 'lucide-react';

interface ResourceTypeSelectorProps {
  type: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const ResourceTypeSelector: React.FC<ResourceTypeSelectorProps> = ({ type, onChange }) => {
  const getResourceIcon = (type: string) => {
    const iconProps = { className: "w-5 h-5" };
    switch (type) {
      case 'video':
        return <VideoIcon {...iconProps} />;
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

  return (
    <div>
      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
        Tipo de Recurso *
      </label>
      <div className="mt-1 flex items-center gap-4">
        <div className="flex items-center">
          {getResourceIcon(type)}
          <select
            id="type"
            name="type"
            value={type}
            onChange={onChange}
            className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="video">Video</option>
            <option value="document">Documento</option>
            <option value="image">Imagen</option>
            <option value="link">Enlace</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ResourceTypeSelector;