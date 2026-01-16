import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Check, ArrowLeft, Users, Search } from 'lucide-react';
import { getAllUsers } from '../../user/services/userService';
import { grantCourseAccess, getById } from '../services/courseServices';
import toast from 'react-hot-toast';
import type { User } from '../../user/services/auth.service';

export default function GrantAccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: getAllUsers,
  });

  const { data: course } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getById(id!),
    enabled: !!id,
  });

  const grantMutation = useMutation({
    mutationFn: (userIds: number[]) => grantCourseAccess(userIds, parseInt(id!)),
    onSuccess: () => {
      toast.success('Acceso otorgado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['course-users', parseInt(id!)] });
      navigate(`/courses/${id}`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al otorgar acceso';
      toast.error(message);
    },
  });

  const toggleUser = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleGrantAccess = () => {
    if (selectedUsers.size === 0) {
      toast.error('Selecciona al menos un usuario');
      return;
    }
    grantMutation.mutate(Array.from(selectedUsers));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower)
      );
    });
  }, [users, searchTerm]);

  if (loadingUsers) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al curso
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Otorgar Acceso al Curso
        </h1>
        <p className="text-gray-600">
          {course?.title} - Selecciona los usuarios que tendrán acceso
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, email o username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Selected Count & Action */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-blue-900 text-lg">
              {selectedUsers.size} usuario(s) seleccionado(s)
            </span>
          </div>
          <button
            onClick={handleGrantAccess}
            disabled={selectedUsers.size === 0 || grantMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg font-medium"
          >
            <UserPlus className="h-5 w-5" />
            {grantMutation.isPending ? 'Otorgando...' : 'Otorgar Acceso'}
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredUsers.map((user: User) => (
            <div
              key={user.id}
              onClick={() => toggleUser(user.id)}
              className={`p-5 hover:bg-gray-50 cursor-pointer transition-all ${
                selectedUsers.has(user.id) ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                      selectedUsers.has(user.id)
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                </div>
                {selectedUsers.has(user.id) && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No se encontraron usuarios</p>
            <p className="text-gray-400 text-sm mt-2">Intenta con otro término de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
