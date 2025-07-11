import React from 'react';
import { Calendar } from 'lucide-react';

interface UserInfo {
  id: number;
  name: string;
  avatar?: string;
}

interface ResourceUserInfoProps {
  user: UserInfo;
  createdAt: string;
}

const ResourceUserInfo: React.FC<ResourceUserInfoProps> = ({ user, createdAt }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-6">
      <div className="flex items-center group/user">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover/user:shadow-md transition-shadow">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <span className="text-xs text-gray-500 block">Publicado por</span>
          <span className="text-sm font-medium text-gray-900 group-hover/user:text-gray-700 transition-colors">
            {user.name}
          </span>
        </div>
      </div>
      <div className="flex items-center text-gray-500 sm:border-l border-gray-200 sm:pl-6">
        <Calendar className="w-4 h-4 mr-2" />
        <span className="text-xs">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ResourceUserInfo;