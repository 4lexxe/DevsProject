import React, { useState, useLayoutEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap,
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  HelpCircle,
  MessageSquare,
  FileText,
  Bell,
  Shield, // Icono para Moderadores
  UserCog, // Icono para Administradores
  Lock, // Icono para Permisos
  Layers // Icono para separador
} from 'lucide-react';

const Sidebar: React.FC = () => {
  // Siempre iniciamos en estado colapsado (forzado)
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Usar useLayoutEffect para aplicar antes del renderizado
  useLayoutEffect(() => {
    // Forzar el estado colapsado al montar el componente
    setCollapsed(true);
    
    // Limpiar cualquier valor antiguo que pueda estar causando problemas
    localStorage.removeItem('sidebarCollapsed');
    
    // Configurar el valor correcto en localStorage
    localStorage.setItem('sidebarCollapsed', 'true');
    
    console.log('Sidebar inicializado en estado colapsado');
  }, []);
  
  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    console.log('Sidebar toggled:', newState ? 'colapsado' : 'expandido');
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Iconos más grandes (24px)
  const navItems = [
    { icon: <LayoutDashboard size={24} />, label: 'Dashboard', active: true },
    { icon: <BookOpen size={24} />, label: 'Courses', active: false },
    { icon: <Users size={24} />, label: 'Students', active: false },
    { icon: <GraduationCap size={24} />, label: 'Instructors', active: false },
    { icon: <FileText size={24} />, label: 'Assignments', active: false },
    { icon: <BarChart size={24} />, label: 'Reports', active: false },
    { icon: <Bell size={24} />, label: 'Notifications', active: false },
    { icon: <MessageSquare size={24} />, label: 'Messages', active: false },
    
    // Sección de administración - Nuevo separador
    { icon: <Layers size={24} />, label: 'Administration', isHeader: true, active: false },
    
    // Nuevas opciones de administración
    { icon: <Shield size={24} />, label: 'Moderators', active: false },
    { icon: <UserCog size={24} />, label: 'Administrators', active: false },
    { icon: <Lock size={24} />, label: 'Permissions', active: false },
    
    // Configuración y ayuda
    { icon: <Settings size={24} />, label: 'Settings', active: false },
    { icon: <HelpCircle size={24} />, label: 'Help Center', active: false },
  ];

  const sidebarContent = (
    <>
      {/* Cabecera alineada con el navbar (h-16 en lugar de p-5) */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200">
        <div className="flex items-center justify-center flex-1">
          {!collapsed && (
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          )}
        </div>

        {/* Botón toggle alineado verticalmente */}
        <button 
          onClick={toggleSidebar} 
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>

      {/* Navegación mejorada con soporte para encabezados de sección */}
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          item.isHeader ? (
            // Renderizar encabezado de sección
            <div key={index} className={`mt-6 mb-2 ${collapsed ? 'px-2 py-1' : 'px-4 py-1'}`}>
              {!collapsed && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
              )}
              {collapsed && (
                <div className="border-b border-gray-200 mb-2"></div>
              )}
            </div>
          ) : (
            // Renderizar elemento de navegación normal
            <a
              key={index}
              href="#"
              className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                item.active 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {item.icon}
              </div>
              {!collapsed && <span className="ml-4 text-base font-medium">{item.label}</span>}
            </a>
          )
        ))}
      </nav>

      {/* Footer mejorado */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <a
          href="#"
          className="flex items-center py-3 px-4 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-center w-8">
            <LogOut size={24} />
          </div>
          {!collapsed && <span className="ml-4 text-base font-medium">Logout</span>}
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Botón móvil mejorado */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-11 h-11 rounded-md bg-white shadow-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileSidebar}
      ></div>

      {/* Sidebar móvil */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {sidebarContent}
        </div>
      </aside>

      {/* Sidebar desktop */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm transition-all ${
          collapsed ? 'w-20' : 'w-72'
        }`}
        data-state={collapsed ? 'collapsed' : 'expanded'}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;