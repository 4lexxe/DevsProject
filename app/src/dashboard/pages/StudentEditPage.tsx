import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  ArrowLeft,
  Save,
  User,
  Mail,
  Shield
} from 'lucide-react'
import { getUserById, updateUser, getRoles } from '@/user/services/userService'
import { User as UserType } from '@/user/services/auth.service'
import toast from 'react-hot-toast'

interface UserFormData {
  name: string
  email: string
  username: string
  displayName: string
  roleId: number
  isActiveSession: boolean
}

interface Role {
  id: number
  name: string
  description: string
}

const StudentEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    username: '',
    displayName: '',
    roleId: 1,
    isActiveSession: false
  })

  // Queries
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => getUserById(Number(id)),
    enabled: !!id
  })

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserType>) => updateUser(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-users'] })
      toast.success('Usuario actualizado exitosamente')
      navigate(`/dashboard/students/${id}`)
    },
    onError: (error) => {
      console.error('Error al actualizar:', error)
      toast.error('Error al actualizar el usuario')
    }
  })

  // Effect to populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        displayName: user.displayName || '',
        roleId: user.roleId || 1,
        isActiveSession: user.isActiveSession || false
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }
    
    if (!formData.email.trim()) {
      toast.error('El email es requerido')
      return
    }
    
    if (!formData.username.trim()) {
      toast.error('El username es requerido')
      return
    }

    updateMutation.mutate({
      ...formData,
      roleId: Number(formData.roleId)
    })
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Usuario no encontrado</p>
        <Link 
          to="/dashboard/students" 
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/dashboard/students/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al perfil
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Usuario</h1>
            <p className="text-gray-600">Actualiza la información del usuario</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {user.avatar ? (
              <img 
                className="h-12 w-12 rounded-full" 
                src={user.avatar} 
                alt={user.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-6 w-6 text-primary-600" />
              </div>
            )}
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nombre completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nombre completo del usuario"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="nombreusuario"
              />
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nombre a mostrar
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nombre que se mostrará públicamente"
              />
            </div>
          </div>

          {/* Configuración de Rol y Estado */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Acceso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Rol del usuario
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {roles.map((role: Role) => (
                    <option key={role.id} value={role.id}>
                      {role.description || role.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Define los permisos y nivel de acceso del usuario
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de la sesión
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActiveSession"
                    name="isActiveSession"
                    checked={formData.isActiveSession}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActiveSession" className="ml-2 text-sm text-gray-700">
                    Sesión activa
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Indica si el usuario tiene una sesión activa en el sistema
                </p>
              </div>
            </div>
          </div>

          {/* Información del Proveedor (Solo lectura) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Autenticación (Solo lectura)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor de autenticación
                </label>
                <input
                  type="text"
                  value={user.authProvider}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 capitalize"
                />
              </div>
              {user.authProviderId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID del proveedor
                  </label>
                  <input
                    type="text"
                    value={user.authProviderId}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-6 flex justify-end space-x-4">
            <Link
              to={`/dashboard/students/${id}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {updateMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentEditPage
