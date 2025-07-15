import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  GraduationCap
} from 'lucide-react'
// Update the import path to the correct relative location
import { cn } from '../utils/cn'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Estudiantes', path: '/dashboard/students' },
  { icon: BookOpen, label: 'Cursos', path: '/dashboard/courses' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="bg-white w-64 shadow-sm border-r border-gray-200 h-full">
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <GraduationCap className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">LMS Panel</span>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
