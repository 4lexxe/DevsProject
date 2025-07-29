import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Save,
  User,
  Mail,
  Shield,
  X,
  Plus
} from 'lucide-react'
import { getUserById, updateUser, getRoles } from '@/user/services/userService'
import { RoleService, type Permission, type Role as RoleType } from '@/user/services/role.service'
import type { User as UserType } from '@/user/services/auth.service'
import toast from 'react-hot-toast'

interface UserFormData {
  name: string
  email: string
  username: string
  displayName: string
  roleId: number
  isActiveSession: boolean
  customPermissions?: number[] // Permisos personalizados del usuario
}

interface Role {
  id: number
  name: string
  description: string
  Permissions?: Permission[]
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
    isActiveSession: false,
    customPermissions: []
  })

  const [rolePermissions, setRolePermissions] = useState<Permission[]>([])
  const [hoveredPermission, setHoveredPermission] = useState<number | null>(null)
  const [showAddDropdown, setShowAddDropdown] = useState(false)

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

  const { data: rolesWithPermissions = [] } = useQuery({
    queryKey: ['roles-with-permissions'],
    queryFn: RoleService.getRolesWithPermissions
  })

  // Obtener todos los permisos únicos disponibles en el sistema
  const allAvailablePermissions = useMemo(() => {
    const permissionsMap = new Map<number, Permission>()
    rolesWithPermissions.forEach((role: RoleType) => {
      if (role.Permissions) {
        role.Permissions.forEach(permission => {
          permissionsMap.set(permission.id, permission)
        })
      }
    })
    return Array.from(permissionsMap.values())
  }, [rolesWithPermissions])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserType>) => updateUser(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-users'] })
      toast.success('Usuario actualizado exitosamente')
      navigate(`/students/${id}`)
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
        isActiveSession: user.isActiveSession || false,
        customPermissions: [] // Por ahora vacío hasta implementar permisos
      })
    }
  }, [user])

  // Memoize the current role to prevent infinite loops
  const currentRole = useMemo(() => {
    if (formData.roleId && rolesWithPermissions.length > 0) {
      return rolesWithPermissions.find((r: RoleType) => r.id === formData.roleId) || null
    }
    return null
  }, [formData.roleId, rolesWithPermissions])

  // Effect to update role permissions when role changes
  useEffect(() => {
    if (currentRole) {
      setRolePermissions(currentRole.Permissions || [])
      // Ya no necesitamos setAvailablePermissions porque usaremos solo los permisos del rol
    }
  }, [currentRole])

  // Funciones para manejar permisos
  const toggleCustomPermission = (permissionId: number) => {
    setFormData(prev => {
      const currentCustom = prev.customPermissions || []
      if (currentCustom.includes(permissionId)) {
        // Remover permiso personalizado
        return {
          ...prev,
          customPermissions: currentCustom.filter(id => id !== permissionId)
        }
      } else {
        // Agregar permiso personalizado
        return {
          ...prev,
          customPermissions: [...currentCustom, permissionId]
        }
      }
    })
  }

  // Permisos disponibles para agregar (que no están en el rol actual)
  const availableToAdd = useMemo(() => {
    return allAvailablePermissions.filter(permission => 
      !rolePermissions.some(p => p.id === permission.id) && 
      !(formData.customPermissions || []).includes(permission.id)
    )
  }, [allAvailablePermissions, rolePermissions, formData.customPermissions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      }
      
      // Si cambia el rol, resetear permisos personalizados
      if (name === 'roleId') {
        updated.customPermissions = []
      }
      
      return updated
    })
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Usuario no encontrado</p>
        <Link 
          to="/students" 
          className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
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
            to={`/students/${id}`}
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
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map((role: Role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

          {/* Gestión de Permisos */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Permisos</h3>
            <p className="text-sm text-gray-600 mb-4">
              Los permisos del rol se aplican automáticamente. Puedes agregar permisos adicionales específicos para este usuario.
            </p>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Permisos del usuario:
              </h4>
              <div className="flex flex-wrap gap-2">
                {/* Permisos del rol */}
                {rolePermissions.map((permission) => (
                  <span
                    key={`role-${permission.id}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {permission.name}
                  </span>
                ))}
                
                {/* Permisos personalizados */}
                <AnimatePresence>
                  {(formData.customPermissions || []).map((permissionId) => {
                    const permission = allAvailablePermissions.find(p => p.id === permissionId)
                    const isHovered = hoveredPermission === permission?.id
                    return permission ? (
                      <motion.span
                        key={`custom-${permission.id}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: '#fecaca',
                          color: '#991b1b',
                          borderColor: '#fca5a5'
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer border"
                        style={{
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderColor: '#bbf7d0'
                        }}
                        onClick={() => toggleCustomPermission(permission.id)}
                        onHoverStart={() => setHoveredPermission(permission.id)}
                        onHoverEnd={() => setHoveredPermission(null)}
                        title="Click para remover este permiso adicional"
                      >
                        <motion.div
                          animate={{ rotate: isHovered ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isHovered ? (
                            <X className="h-3 w-3 mr-1" />
                          ) : (
                            <Plus className="h-3 w-3 mr-1" />
                          )}
                        </motion.div>
                        <span style={{ userSelect: 'none' }}>{permission.name}</span>
                      </motion.span>
                    ) : null
                  })}
                </AnimatePresence>
                
                {/* Botón para agregar más permisos */}
                {availableToAdd.length > 0 && (
                  <div className="relative">
                    <motion.span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-300 cursor-pointer"
                      whileHover={{ 
                        backgroundColor: '#dbeafe', 
                        color: '#1d4ed8',
                        borderColor: '#93c5fd',
                        scale: 1.02
                      }}
                      transition={{ duration: 0.2 }}
                      onHoverStart={() => setShowAddDropdown(true)}
                      onHoverEnd={() => {
                        // Delay para permitir hover en el dropdown
                        setTimeout(() => {
                          if (!showAddDropdown) return
                          setShowAddDropdown(false)
                        }, 100)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      <span style={{ userSelect: 'none' }}>Agregar permiso</span>
                    </motion.span>
                    
                    {/* Dropdown de permisos disponibles */}
                    <AnimatePresence>
                      {showAddDropdown && (
                        <motion.div 
                          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-56"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onHoverStart={() => setShowAddDropdown(true)}
                          onHoverEnd={() => setShowAddDropdown(false)}
                        >
                          <div className="p-2 max-h-48 overflow-y-auto">
                            {availableToAdd.map((permission) => (
                              <motion.button
                                key={`add-${permission.id}`}
                                type="button"
                                onClick={() => {
                                  toggleCustomPermission(permission.id)
                                  setShowAddDropdown(false)
                                }}
                                className="w-full text-left px-3 py-2 text-sm rounded transition-colors duration-150"
                                whileHover={{ 
                                  backgroundColor: '#eff6ff',
                                  color: '#1d4ed8'
                                }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="font-medium flex items-center">
                                  <Plus className="h-3 w-3 mr-2 text-green-600" />
                                  <span style={{ userSelect: 'none' }}>{permission.name}</span>
                                </div>
                                {permission.description && (
                                  <div className="text-xs text-gray-500 mt-1 ml-5" style={{ userSelect: 'none' }}>{permission.description}</div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                
                {rolePermissions.length === 0 && (formData.customPermissions || []).length === 0 && (
                  <span className="text-gray-500 text-sm italic">No hay permisos asignados</span>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                <span className="inline-flex items-center mr-6">
                  <Shield className="h-3 w-3 mr-1 text-blue-600" />
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs mr-1">Rol</span>
                  Permisos heredados del rol
                </span>
                <span className="inline-flex items-center">
                  <Plus className="h-3 w-3 mr-1 text-green-600" />
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs mr-1">Adicional</span>
                  Permisos personalizados (hover para remover)
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-6 flex justify-end space-x-4">
            <Link
              to={`/students/${id}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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