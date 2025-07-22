import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  ArrowLeft,
  Edit2, 
  Mail, 
  User, 
  Calendar,
  Shield,
  Clock,
  Globe,
  Github,
  MessageCircle
} from 'lucide-react'
import { getUserById } from '@/user/services/userService'

const StudentProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => getUserById(Number(id)),
    enabled: !!id
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return <Github className="h-4 w-4" />
      case 'discord':
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'github':
        return 'bg-gray-100 text-gray-800'
      case 'discord':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error al cargar el perfil del usuario</p>
        <Link 
          to="/students" 
          className="text-primary-600 hover:text-primary-800 mt-2 inline-block"
        >
          ← Volver a la lista
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/students"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a estudiantes
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img 
                    className="h-20 w-20 rounded-full border-4 border-white shadow-lg" 
                    src={user.avatar} 
                    alt={user.name}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="h-10 w-10 text-primary-600" />
                  </div>
                )}
              </div>
              <div className="text-gray-900">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-primary-100 text-lg">@{user.username}</p>
                <p className="text-primary-200 mt-1">{user.email}</p>
              </div>
            </div>
            <Link
              to={`/students/${user.id}/edit`}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Editar Perfil
            </Link>
          </div>
        </div>

        {/* Status Bar */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.isActiveSession 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActiveSession ? 'Sesión Activa' : 'Sesión Inactiva'}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Último acceso: {formatDate(user.lastActiveAt)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.Role?.name === 'superadmin' 
                  ? 'bg-red-100 text-red-800'
                  : user.Role?.name === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.Role?.name === 'superadmin' && <Shield className="w-3 h-3 mr-1" />}
                {user.Role?.description || user.Role?.name || 'Usuario'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                <p className="text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre de usuario</p>
                <p className="text-gray-900">@{user.username}</p>
              </div>
            </div>
            {user.displayName && (
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre a mostrar</p>
                  <p className="text-gray-900">{user.displayName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información de Autenticación */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Autenticación</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Proveedor de autenticación</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProviderColor(user.authProvider)}`}>
                    {getProviderIcon(user.authProvider)}
                    <span className="ml-1 capitalize">{user.authProvider}</span>
                  </span>
                </div>
              </div>
            </div>
            {user.authProviderId && (
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">ID del proveedor</p>
                  <p className="text-gray-900 font-mono text-sm">{user.authProviderId}</p>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nivel de acceso</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.Role?.name === 'superadmin' 
                      ? 'bg-red-100 text-red-800'
                      : user.Role?.name === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.Role?.description || user.Role?.name || 'Usuario'}
                  </span>
                  {user.Role?.permissions && user.Role.permissions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Permisos:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.Role.permissions.map((permission: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Sesión */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estado de la Sesión</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Último acceso</p>
                <p className="text-gray-900">{formatDate(user.lastActiveAt)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Estado actual</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActiveSession 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActiveSession ? 'Sesión Activa' : 'Sesión Inactiva'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metadatos del Proveedor */}
        {user.providerMetadata && Object.keys(user.providerMetadata).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Proveedor</h2>
            <div className="space-y-4">
              {user.providerMetadata.profile && (
                <>
                  {user.providerMetadata.profile.username && (
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username del proveedor</p>
                        <p className="text-gray-900">@{user.providerMetadata.profile.username}</p>
                      </div>
                    </div>
                  )}
                  {user.providerMetadata.profile.id && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">ID del perfil</p>
                        <p className="text-gray-900 font-mono text-sm">{user.providerMetadata.profile.id}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones</h2>
        <div className="flex space-x-4">
          <Link
            to={`/students/${user.id}/edit`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Editar Información
          </Link>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => window.print()}
          >
            Imprimir Perfil
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentProfilePage
