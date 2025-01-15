import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import AuthButton from '../buttons/AuthButton'
import NavLink from './NavLink'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo de la plataforma */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Devs Project</span>
          </div>
          
          {/* Enlaces de navegación principales (desktop) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/cursos">Cursos</NavLink>
              <NavLink href="/ruta-aprendizaje">Ruta de Aprendizaje</NavLink>
              <NavLink href="/recursos">Recursos</NavLink>
            </div>
          </div>
          
          {/* Botones de autenticación (desktop) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <AuthButton variant="primary">
                Registrarse
              </AuthButton>
              <AuthButton variant="outline">
                Iniciar Sesión
              </AuthButton>
            </div>
          </div>
          
          {/* Botón de menú móvil */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/cursos">Cursos</NavLink>
            <NavLink href="/ruta-aprendizaje">Ruta de Aprendizaje</NavLink>
            <NavLink href="/recursos">Recursos</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <AuthButton variant="primary">
                Registrarse
              </AuthButton>
              <AuthButton variant="outline">
                Iniciar Sesión
              </AuthButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}