import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import AuthButton from '../buttons/AuthButton'
import NavLink from './NavLink'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="bg-gradient-to-r from-slate-100 to-neutral-100 text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo de la plataforma */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Devs Project</span>
          </div>
          
          {/* Search bar (desktop) */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar cursos, recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-blue-300 bg-white/10 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-black" />
              </button>
            </form>
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
          <div className="hidden md:flex items-center space-x-2">
            <AuthButton variant="secondary">
              Iniciar Sesión
            </AuthButton>
            <AuthButton variant="primary">
              Registrarse
            </AuthButton>
          </div>
          
          {/* Botón de menú móvil */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
        <div className="md:hidden border-gray-50">
          {/* Search bar (mobile) */}
          <div className="px-2 pt-2 pb-3 space-y-1">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar cursos, recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-blue-300 bg-white/10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-black" />
              </button>
            </form>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink href="/cursos">Cursos</NavLink>
            <NavLink href="/ruta-aprendizaje">Ruta de Aprendizaje</NavLink>
            <NavLink href="/recursos">Recursos</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-blue-800">
            <div className="flex items-center justify-center space-x-2 px-5">
              <AuthButton variant="secondary" fullWidth>
                Iniciar Sesión
              </AuthButton>
              <AuthButton variant="primary" fullWidth>
                Registrarse
              </AuthButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

