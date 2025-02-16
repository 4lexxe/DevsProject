import React from 'react';
import { Resource, UserInfo } from '../types/resource';

interface ResourceInfoProps {
  resource: Resource;
  user: UserInfo | null;
}

const ResourceInfo: React.FC<ResourceInfoProps> = ({ resource, user }) => {
  return (
    <div className="p-6">
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

    </div>
  );
};

export default ResourceInfo;