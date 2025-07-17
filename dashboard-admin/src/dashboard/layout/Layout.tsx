import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'


const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Contenido principal del dashboard */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {/* Contenido scrolleable */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
