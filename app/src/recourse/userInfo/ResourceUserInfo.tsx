import React from 'react';

interface UserInfo {
  id: number;
  name: string;
  username?: string;
  displayName?: string;
  avatar?: string;
}

interface ResourceUserInfoProps {
  user: UserInfo;
  createdAt: string;
}

const ResourceUserInfo: React.FC<ResourceUserInfoProps> = ({ user, createdAt }) => {
  // NO hacer llamadas al UserService aquí
  // Solo usar los datos que vienen en las props

  const getUserDisplayName = (): string => {
    return user?.displayName || user?.name || user?.username || 'Usuario desconocido';
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={getUserDisplayName()} 
            className="w-5 h-5 rounded-full object-cover"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
            {getUserDisplayName().charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-medium">{getUserDisplayName()}</span>
      </div>
      <span className="text-gray-400">•</span>
      <span>{formatDate(createdAt)}</span>
    </div>
  );
};

export default ResourceUserInfo;