import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Calendar,
  Shield
} from 'lucide-react'
import { 
  getAllUsers, 
  deleteUser, 
  deactivateUser, 
  activateUser, 
  getUserStats,
  getRoles
} from '@/user/services/userService'
import { User } from '@/user/services/auth.service'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDebounce } from '../hooks/useDebounce'

interface Role {
  id: number
  name: string
  description: string
}

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const queryClient = useQueryClient()

  // Debounce del término de búsqueda para evitar filtrados excesivos
  const debouncedSearchTerm = useDebounce(searchTerm, 300) // Reducido a 300ms para mejor UX

  // Query optimizada: una sola llamada al backend para obtener todos los usuarios
  const { data: allUsers = [], isLoading, error } = useQuery({
    queryKey: ['all-users'], // Sin filtros en la key porque traemos todos
    queryFn: () => getAllUsers(), // Sin filtros, los aplicamos del lado cliente
    staleTime: 10 * 60 * 1000, // 10 minutos - datos frescos por más tiempo
    gcTime: 30 * 60 * 1000, // 30 minutos de cache - evita múltiples peticiones
  })

  // Filtrado del lado del cliente - memoizado para performance
  const filteredUsers = useMemo(() => {
    if (!allUsers.length) return []

    return allUsers.filter((user: User) => {
      // Filtro de búsqueda
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase()
        const matchesSearch = 
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower) ||
          user.displayName?.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }

      // Filtro por rol
      if (filterRole !== 'all') {
        if (user.role?.name.toLowerCase() !== filterRole.toLowerCase()) {
          return false
        }
      }

      // Filtro por estado
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && !user.isActiveSession) return false
        if (filterStatus === 'inactive' && user.isActiveSession) return false
      }

      return true
    })
  }, [allUsers, debouncedSearchTerm, filterRole, filterStatus])

  // Handlers memoizados para evitar re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleRoleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value)
  }, [])

  const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value)
  }, [])

  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
    staleTime: 10 * 60 * 1000, // Las estadísticas no cambian tan frecuentemente
  })

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 30 * 60 * 1000, // Los roles casi nunca cambian
  })

  // Mutations optimizadas con callbacks memoizados
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
      toast.success('Usuario eliminado exitosamente')
    },
    onError: (error) => {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar el usuario')
    }
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, action }: { userId: number, action: 'activate' | 'deactivate' }) => {
      return action === 'activate' ? activateUser(userId) : deactivateUser(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-users'] })
      queryClient.invalidateQueries({ queryKey: ['user-stats'] })
      toast.success('Estado del usuario actualizado')
    },
    onError: (error) => {
      console.error('Error al cambiar estado:', error)
      toast.error('Error al cambiar el estado del usuario')
    }
  })

  // Handlers memoizados para evitar recreaciones innecesarias
  const handleDelete = useCallback(async (userId: number, userName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"?`)) {
      deleteMutation.mutate(userId)
    }
  }, [deleteMutation])

  const handleToggleStatus = useCallback((userId: number, isActive: boolean) => {
    const action = isActive ? 'deactivate' : 'activate'
    const message = isActive ? 'desactivar' : 'activar'
    
    if (window.confirm(`¿Estás seguro de que quieres ${message} este usuario?`)) {
      toggleStatusMutation.mutate({ userId, action })
    }
  }, [toggleStatusMutation])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }, [])

  // Indicador de búsqueda activa
  const isSearching = searchTerm !== debouncedSearchTerm

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error al cargar los usuarios</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h1>
          <p className="text-gray-600">Administra todos los usuarios registrados en la plataforma</p>
        </div>
        <Link
          to="/dashboard/students/create"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || filteredUsers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.inactiveUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nuevos este mes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.newUsersThisMonth || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o username..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={handleRoleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los roles</option>
              {roles.map((role: Role) => (
                <option key={role.id} value={role.name}>
                  {role.description || role.name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={handleStatusFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último acceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers?.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatar} 
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role?.name === 'superadmin' 
                        ? 'bg-red-100 text-red-800'
                        : user.role?.name === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role?.name === 'superadmin' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role?.description || user.role?.name || 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActiveSession 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActiveSession ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.lastActiveAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="capitalize">{user.authProvider}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/dashboard/students/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Ver perfil"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/dashboard/students/${user.id}/edit`}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Editar usuario"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActiveSession)}
                        className={`p-1 ${
                          user.isActiveSession 
                            ? 'text-orange-600 hover:text-orange-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={user.isActiveSession ? 'Desactivar' : 'Activar'}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {user.isActiveSession ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Eliminar usuario"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers?.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'No se encontraron usuarios con los filtros aplicados'
                : 'No hay usuarios registrados todavía'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentsPage
