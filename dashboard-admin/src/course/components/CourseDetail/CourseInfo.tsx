import React, { useState } from 'react';
import FontelloIcon from '../../../shared/components/icons/FontelloIcon';
import AddUserModal from './AddUserModal';

interface Creator {
  id: number;
  name: string;
  isSuperAdmin: boolean;
  adminSince: string;
  user?: {
    id: number;
    name: string;
    surname: string;
    email: string;
    username: string;
    avatar: string;
    displayName: string;
  };
}

interface EnrolledUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  avatar: string;
  displayName: string;
  enrolledAt: string;
  isActive: boolean;
  expiresAt?: string | null;
  isPermanent?: boolean;
  isExpired?: boolean;
}

interface EnrollmentStats {
  total: number;
  active: number;
  revoked: number;
}

interface CourseInfoProps {
  creator: Creator | null;
  instructor: Creator | null;
  enrolledUsers: EnrolledUser[];
  enrollmentStats: EnrollmentStats;
  sectionsCount: number;
  contentsCount: number;
  courseId?: number;
  courseTitle?: string;
}

const CourseInfo: React.FC<CourseInfoProps> = ({
  creator,
  instructor,
  enrolledUsers,
  enrollmentStats,
  sectionsCount,
  contentsCount,
  courseId,
  courseTitle = 'Curso'
}) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Información del creador e instructor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creador */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FontelloIcon
                name="icon-user"
                className="text-lg text-gray-700 dark:text-gray-300"
                fallback={
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Creador del Curso</h3>
          </div>
          {creator ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {creator.user?.avatar ? (
                  <img 
                    src={creator.user.avatar} 
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FontelloIcon
                      name="icon-user"
                      className="text-xl text-gray-500"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {creator.user?.displayName || creator.user?.name || creator.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {creator.user?.email || 'Sin email'}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{creator.name}</span>
                </div>
                {creator.isSuperAdmin && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                      Super Admin
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Admin desde:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(creator.adminSince).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay información del creador</p>
          )}
        </div>

        {/* Instructor */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FontelloIcon
                name="icon-graduation-cap"
                className="text-lg text-gray-700 dark:text-gray-300"
                fallback={
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                }
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Instructor</h3>
          </div>
          {instructor ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {instructor.user?.avatar ? (
                  <img 
                    src={instructor.user.avatar} 
                    alt={instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FontelloIcon
                      name="icon-user"
                      className="text-xl text-gray-500"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {instructor.user?.displayName || instructor.user?.name || instructor.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {instructor.user?.email || 'Sin email'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay información del instructor</p>
          )}
        </div>
      </div>

      {/* Estadísticas del curso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FontelloIcon
                name="icon-folder"
                className="text-lg text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sectionsCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Secciones</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FontelloIcon
                name="icon-doc-text"
                className="text-lg text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contentsCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Contenidos</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FontelloIcon
                name="icon-users"
                className="text-lg text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{enrollmentStats.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Inscritos Activos</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FontelloIcon
                name="icon-user"
                className="text-lg text-gray-600 dark:text-gray-400"
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{enrollmentStats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Inscripciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios inscritos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <FontelloIcon
                  name="icon-users"
                  className="text-lg text-gray-700 dark:text-gray-300"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Usuarios Inscritos
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {enrolledUsers.length} {enrolledUsers.length === 1 ? 'usuario inscrito' : 'usuarios inscritos'}
                </p>
              </div>
            </div>
            {courseId && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <FontelloIcon name="icon-plus" className="text-xs" />
                Agregar Usuario
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {enrolledUsers.length > 0 ? (
            <div className="space-y-3">
              {enrolledUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.displayName || user.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <FontelloIcon
                          name="icon-user"
                          className="text-xl text-gray-500"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.displayName || `${user.name} ${user.surname}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email || user.username}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Inscrito el {new Date(user.enrolledAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {user.expiresAt && (
                        <p className={`text-xs mt-1 ${
                          user.isExpired 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {user.isExpired ? 'Expirado' : 'Expira'} el {new Date(user.expiresAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                      {user.isPermanent && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Acceso permanente
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {user.isActive && !user.isExpired ? (
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                        Activo
                      </span>
                    ) : user.isExpired ? (
                      <span className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                        Expirado
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        Revocado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FontelloIcon
                  name="icon-users"
                  className="text-2xl text-gray-400"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay usuarios inscritos en este curso
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar usuario */}
      {courseId && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          courseId={courseId}
          courseTitle={courseTitle}
        />
      )}
    </div>
  );
};

export default CourseInfo;
