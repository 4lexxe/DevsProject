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

  // Función para determinar el tamaño responsive de los iconos
  const getIconSize = () => {
    // En dispositivos pequeños, iconos más pequeños
    if (window.innerWidth < 640) return 20;
    // En dispositivos medianos, tamaño normal
    if (window.innerWidth < 1024) return 22;
    // En dispositivos grandes, tamaño más grande
    return 24;
  };

  // Usar un estado para almacenar el tamaño de los iconos
  const [iconSize, setIconSize] = useState(getIconSize());

  // Actualizar el tamaño de los iconos cuando la ventana cambie de tamaño
  useLayoutEffect(() => {
    const handleResize = () => {
      setIconSize(getIconSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Iconos con tamaño dinámico
  const navItems = [
    { icon: (size: number) => <LayoutDashboard size={size} />, label: 'Dashboard', active: true },
    { icon: (size: number) => <BookOpen size={size} />, label: 'Courses', active: false },
    { icon: (size: number) => <Users size={size} />, label: 'Students', active: false },
    { icon: (size: number) => <GraduationCap size={size} />, label: 'Instructors', active: false },
    { icon: (size: number) => <FileText size={size} />, label: 'Assignments', active: false },
    { icon: (size: number) => <BarChart size={size} />, label: 'Reports', active: false },
    { icon: (size: number) => <Bell size={size} />, label: 'Notifications', active: false },
    { icon: (size: number) => <MessageSquare size={size} />, label: 'Messages', active: false },
    
    // Sección de administración - Nuevo separador
    { icon: (size: number) => <Layers size={size} />, label: 'Administration', isHeader: true, active: false },
    
    // Nuevas opciones de administración
    { icon: (size: number) => <Shield size={size} />, label: 'Moderators', active: false },
    { icon: (size: number) => <UserCog size={size} />, label: 'Administrators', active: false },
    { icon: (size: number) => <Lock size={size} />, label: 'Permissions', active: false },
    
    // Configuración y ayuda
    { icon: (size: number) => <Settings size={size} />, label: 'Settings', active: false },
    { icon: (size: number) => <HelpCircle size={size} />, label: 'Help Center', active: false },
  ];

  const sidebarContent = (
    <>
      {/* Cabecera fija */}
      <div className="flex-shrink-0 flex items-center justify-between h-16 px-5 border-b border-gray-200">
        <div className="flex items-center justify-center flex-1">
          {!collapsed && (
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          )}
        </div>

        <button 
          onClick={toggleSidebar} 
          className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={iconSize} /> : <X size={iconSize} />}
        </button>
      </div>

      {/* Área de navegación con scroll */}
      <div className="flex-grow overflow-y-auto">
        <nav className={`p-3 space-y-1 ${collapsed ? 'p-2' : 'p-3'}`}>
          {navItems.map((item, index) => (
            item.isHeader ? (
              // Renderizar encabezado de sección
              <div key={index} className={`mt-4 mb-2 ${collapsed ? 'px-1' : 'px-3'}`}>
                {!collapsed && (
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                )}
                {collapsed && (
                  <div className="border-b border-gray-200 mb-1"></div>
                )}
              </div>
            ) : (
              // Renderizar elemento de navegación normal
              <a
                key={index}
                href="#"
                className={`flex items-center ${collapsed ? 'py-2 px-2' : 'py-2 px-3'} rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`flex items-center justify-center ${collapsed ? 'w-6' : 'w-7'}`}>
                  {item.icon(iconSize)}
                </div>
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </a>
            )
          ))}
        </nav>
      </div>

      {/* Footer fijo */}
      <div className="flex-shrink-0 p-3 border-t border-gray-200">
        <a
          href="#"
          className={`flex items-center ${collapsed ? 'py-2 px-2' : 'py-2 px-3'} text-gray-700 rounded-lg hover:bg-gray-100 transition-colors`}
        >
          <div className={`flex items-center justify-center ${collapsed ? 'w-6' : 'w-7'}`}>
            <LogOut size={iconSize} />
          </div>
          {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-11 h-11 rounded-md bg-white shadow-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Menu size={iconSize} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileSidebar}
      ></div>

      {/* Sidebar móvil */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col transform transition-transform md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: collapsed ? '70px' : '250px' }}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar desktop */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm transition-all max-h-screen ${
          collapsed ? 'w-16' : 'w-64'
        }`}
        data-state={collapsed ? 'collapsed' : 'expanded'}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;