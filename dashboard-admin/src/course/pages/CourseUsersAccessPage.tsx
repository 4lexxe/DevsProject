import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Users, Calendar, Key, UserX, AlertCircle } from 'lucide-react';
import { getCourseUsers, revokeCourseAccess, getById } from '../services/courseServices';
import toast from 'react-hot-toast';

interface CourseUser {
  id: number;
  accessToken: string;
  grantedAt: string;
  isActive: boolean;
  courseId: number;
  progress: number;
}

export default function CourseUsersAccessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [revokeUserId, setRevokeUserId] = useState<number | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  const { data: course } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getById(id!),
    enabled: !!id,
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['course-users', parseInt(id!)],
    queryFn: () => getCourseUsers(parseInt(id!)),
    enabled: !!id,
  });

  const revokeMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      revokeCourseAccess(userId, parseInt(id!), reason),
    onSuccess: () => {
      toast.success('Acceso revocado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['course-users', parseInt(id!)] });
      setRevokeUserId(null);
      setRevokeReason('');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al revocar acceso';
      toast.error(message);
    },
  });

  const handleRevokeClick = (userId: number) => {
    setRevokeUserId(userId);
    setRevokeReason('');
  };

  const handleConfirmRevoke = () => {
    if (!revokeReason.trim()) {
      toast.error('Debes proporcionar una razón para revocar el acceso');
      return;
    }
    if (revokeUserId) {
      revokeMutation.mutate({ userId: revokeUserId, reason: revokeReason });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              Usuarios con Acceso
            </h1>
            <p className="text-gray-600">{course?.title}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">Total de usuarios</p>
            <p className="text-3xl font-bold text-green-600">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No hay usuarios con acceso a este curso
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Los usuarios aparecerán aquí después de que se les otorgue acceso
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user: CourseUser) => (
              <div
                key={user.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md text-lg">
                        {user.id.toString().charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Usuario #{user.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Curso ID: {user.courseId}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Acceso otorgado</p>
                          <p className="text-sm font-medium">
                            {formatDate(user.grantedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Key className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Token</p>
                          <p className="text-sm font-mono truncate max-w-[200px]">
                            {user.accessToken}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Progreso del curso</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all"
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 min-w-[45px]">
                            {user.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevokeClick(user.id)}
                    disabled={revokeMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserX className="h-4 w-4" />
                    Revocar Acceso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {revokeUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-xl font-bold">Revocar Acceso</h3>
            </div>
            
            <p className="text-gray-600">
              ¿Estás seguro de que deseas revocar el acceso al usuario #{revokeUserId}?
              Esta acción no se puede deshacer.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón de revocación *
              </label>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Explica por qué se revoca el acceso..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setRevokeUserId(null)}
                disabled={revokeMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRevoke}
                disabled={revokeMutation.isPending || !revokeReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {revokeMutation.isPending ? 'Revocando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
