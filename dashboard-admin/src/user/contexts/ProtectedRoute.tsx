import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = [] 
}) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Verificar rol si es requerido
  if (requiredRole.length > 0) {
    const userRole = user.role?.name.toLowerCase()
    const hasRequiredRole = requiredRole.some(role => 
      role.toLowerCase() === userRole
    )
    
    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Acceso Denegado</h2>
            <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta sección</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
