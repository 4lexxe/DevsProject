import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { ExternalLink, ImageIcon } from 'lucide-react';
import { Resource } from '../types/resource';

interface ResourceContentProps {
  resource: Resource;
}

const ResourceContent: React.FC<ResourceContentProps> = ({ resource }) => {
  const [isImageError, setIsImageError] = useState(false);

  const isGoogleDriveUrl = (url: string): boolean => {
    return url.includes('drive.google.com');
  };

  const generateGoogleDriveEmbedUrl = (url: string): string => {
    const fileId = url.split('/d/')[1]?.split('/')[0];
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    throw new Error('No se pudo extraer el ID del archivo de Google Drive.');
  };

  const renderContent = () => {
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
              />
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

  return (
    <div className="p-6 border-b border-gray-200">
      {renderContent()}
    </div>
  );
};

export default ResourceContent;