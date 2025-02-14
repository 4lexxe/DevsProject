import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { ResourceService } from "../services/resource.service";
import { UserService } from "../../profile/services/user.service";

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

const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<Record<number, UserInfo>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const truncateText = (text: string, maxLength: number = 55): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const fetchUserInfo = useCallback(async (userId: number) => {
    try {
      const userInfo = await UserService.getUserById(userId);
      return {
        id: userInfo.id,
        name: userInfo.name,
        avatar:
          userInfo.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`,
      };
    } catch (error) {
      console.error(`Error fetching user info for userId ${userId}:`, error);
      return {
        id: userId,
        name: `Usuario ${userId}`,
        avatar: `https://ui-avatars.com/api/?name=U${userId}&background=random`,
      };
    }
  }, []);

  const processUserInfo = useCallback(
    async (resources: Resource[]) => {
      const userIds = [...new Set(resources.map((resource) => resource.userId))];
      const userInfoMap: Record<number, UserInfo> = {};
      await Promise.all(
        userIds.map(async (userId) => {
          userInfoMap[userId] = await fetchUserInfo(userId);
        })
      );
      setUsers(userInfoMap);
    },
    [fetchUserInfo]
  );

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ResourceService.getResources();
      setResources(data);
      await processUserInfo(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Error al cargar los recursos. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  }, [processUserInfo]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const getResourceIcon = (type: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
          <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Recursos Educativos
          </h1>
          <Link
            to="/resources/create"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-md transition-all duration-200 text-sm shadow-sm hover:shadow group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Agregar Recurso
          </Link>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md animate-fade-in">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-gray-900"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No hay recursos disponibles.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="sm:flex p-6">
                  {/* Cover Image with fixed dimensions */}
                  <div className="sm:w-64 sm:min-w-[16rem] sm:max-w-[16rem] relative overflow-hidden">
                    <div className="w-full pb-[56.25%] sm:pb-[75%] relative">
                      <img
                        src={
                          resource.coverImage ||
                          "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                        }
                        alt={resource.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-md bg-gray-50 border border-gray-100 shadow-sm group-hover:bg-gray-100 transition-colors duration-200">
                        {getResourceIcon(resource.type)}
                      </div>
<h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2 sm:line-clamp-1">
                        {truncateText(resource.title)}
                      </h3>
                    </div>
                    {resource.description && (
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {resource.description}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-t border-gray-100 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-6">
                        {users[resource.userId] && (
                          <div className="flex items-center group/user">
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover/user:shadow-md transition-shadow">
                              <img
                                src={users[resource.userId].avatar || "/placeholder.svg"}
                                alt={users[resource.userId].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <span className="text-xs text-gray-500 block">Publicado por</span>
                              <span className="text-sm font-medium text-gray-900 group-hover/user:text-gray-700 transition-colors">
                                {users[resource.userId].name}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center text-gray-500 sm:border-l border-gray-200 sm:pl-6">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-xs">
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/resources/${resource.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-md transition-all duration-200 text-sm font-medium group-hover:shadow-sm w-full sm:w-auto"
                      >
                        Ver
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceListPage;