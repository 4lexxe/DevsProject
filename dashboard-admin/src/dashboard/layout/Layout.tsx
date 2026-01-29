import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // En desktop, el sidebar está abierto por defecto
    return window.innerWidth >= 1024
  })

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Solo ajustar el sidebar automáticamente cuando se cambia de móvil a desktop
  // pero no forzar el cierre cuando se cambia de desktop a móvil
  useEffect(() => {
    const handleResize = () => {
      // Solo abrir automáticamente cuando se cambia a desktop
      // No forzar el cierre en móvil para permitir control manual
      if (window.innerWidth >= 1024 && !sidebarOpen) {
        setSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onToggle={toggleSidebar}
      />
      {/* Contenido principal del dashboard */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header onMenuToggle={toggleSidebar} />
        {/* Contenido scrolleable */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
