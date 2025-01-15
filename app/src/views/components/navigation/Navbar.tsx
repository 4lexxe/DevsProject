import AuthButton from '../buttons/AuthButton'
import NavLink from './NavLink'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-red shadow-sm">
      {/* Logo de la plataforma */}
      <div className="text-xl font-bold">Devs Project</div>
      
      {/* Enlaces de navegación principales */}
      <div className="flex items-center space-x-8">
        <div className="space-x-6">
          <NavLink href="/cursos">Cursos</NavLink>
          <NavLink href="/ruta-aprendizaje">Ruta de Aprendizaje</NavLink>
          <NavLink href="/recursos">Recursos</NavLink>
        </div>
        
        {/* Botones de autenticación */}
        <div className="flex items-center space-x-4">
          <AuthButton variant="primary">
            Registrarse
          </AuthButton>
          <AuthButton variant="outline">
            Iniciar Sesión
          </AuthButton>
        </div>
      </div>
    </nav>
  )
}