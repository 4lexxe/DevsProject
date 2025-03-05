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
  Layers, // Icono para separador
  // Nuevos iconos para secciones adicionales
  PieChart,
  Download,
  DollarSign,
  CreditCard,
  Receipt,
  Briefcase,
  PenTool,
  Image,
  Tag,
  Mail,
  Share2,
  Search,
  BarChart2,
  Monitor,
  Globe,
  Sliders,
  Server,
  Database,
  RefreshCw,
  AlertTriangle,
  CloudOff,
  // Nuevos iconos para desarrolladores
  Code,
  GitBranch,
  Terminal,
  Cpu,
  Box,
  Zap,
  LifeBuoy,
  Hammer,
  Webhook,
  FileCode,
  GitPullRequest,
  Bug
} from 'lucide-react';

// Definir las propiedades del componente para aceptar el usuario
interface SidebarProps {
  user?: {
    name: string;
    role: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  // Siempre iniciamos en estado colapsado (forzado)
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tooltipInfo, setTooltipInfo] = useState<{ visible: boolean, text: string, position: { top: number, left: number } }>({
    visible: false,
    text: '',
    position: { top: 0, left: 0 }
  });
  
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

  // Funciones para mostrar y ocultar el tooltip
  const showTooltip = (e: React.MouseEvent, text: string) => {
    if (collapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipInfo({
        visible: true,
        text,
        position: {
          top: rect.top + rect.height / 2,
          left: rect.right + 10
        }
      });
    }
  };

  const hideTooltip = () => {
    setTooltipInfo(prev => ({ ...prev, visible: false }));
  };

  // Iconos con tamaño dinámico y más opciones
  const navItems = [
    // Panel principal
    { icon: (size: number) => <LayoutDashboard size={size} />, label: 'Dashboard', active: true },

    // Sección Educativa
    { icon: (size: number) => <BookOpen size={size} />, label: 'Education', isHeader: true, active: false },
    { icon: (size: number) => <BookOpen size={size} />, label: 'Courses', active: false },
    { icon: (size: number) => <FileText size={size} />, label: 'Assignments', active: false },
    { icon: (size: number) => <PenTool size={size} />, label: 'Quizzes & Exams', active: false },
    { icon: (size: number) => <Tag size={size} />, label: 'Categories', active: false },
    
    // Sección Usuarios
    { icon: (size: number) => <Users size={size} />, label: 'Users', isHeader: true, active: false },
    { icon: (size: number) => <Users size={size} />, label: 'Students', active: false },
    { icon: (size: number) => <GraduationCap size={size} />, label: 'Instructors', active: false },
    { icon: (size: number) => <Shield size={size} />, label: 'Moderators', active: false },
    { icon: (size: number) => <UserCog size={size} />, label: 'Administrators', active: false },
    
    // Sección Analytics
    { icon: (size: number) => <BarChart size={size} />, label: 'Analytics', isHeader: true, active: false },
    { icon: (size: number) => <BarChart size={size} />, label: 'Reports', active: false },
    { icon: (size: number) => <PieChart size={size} />, label: 'Statistics', active: false },
    { icon: (size: number) => <BarChart2 size={size} />, label: 'User Metrics', active: false },
    { icon: (size: number) => <Download size={size} />, label: 'Data Export', active: false },
    
    // Sección Financiera
    { icon: (size: number) => <DollarSign size={size} />, label: 'Finance', isHeader: true, active: false },
    { icon: (size: number) => <DollarSign size={size} />, label: 'Revenue', active: false },
    { icon: (size: number) => <Receipt size={size} />, label: 'Invoices', active: false },
    { icon: (size: number) => <CreditCard size={size} />, label: 'Payments', active: false },
    { icon: (size: number) => <Briefcase size={size} />, label: 'Subscriptions', active: false },
    
    // Sección Contenido
    { icon: (size: number) => <FileText size={size} />, label: 'Content', isHeader: true, active: false },
    { icon: (size: number) => <FileText size={size} />, label: 'Pages', active: false },
    { icon: (size: number) => <Image size={size} />, label: 'Media Library', active: false },
    { icon: (size: number) => <Tag size={size} />, label: 'Tags', active: false },
    
    // Sección Marketing
    { icon: (size: number) => <Mail size={size} />, label: 'Marketing', isHeader: true, active: false },
    { icon: (size: number) => <Mail size={size} />, label: 'Email Campaigns', active: false },
    { icon: (size: number) => <Share2 size={size} />, label: 'Social Media', active: false },
    { icon: (size: number) => <Search size={size} />, label: 'SEO Settings', active: false },
    
    // Comunicación
    { icon: (size: number) => <MessageSquare size={size} />, label: 'Communication', isHeader: true, active: false },
    { icon: (size: number) => <Bell size={size} />, label: 'Notifications', active: false },
    { icon: (size: number) => <MessageSquare size={size} />, label: 'Messages', active: false },
    { icon: (size: number) => <Mail size={size} />, label: 'Email Templates', active: false },
    
    // Administración del Sistema
    { icon: (size: number) => <Layers size={size} />, label: 'System', isHeader: true, active: false },
    { icon: (size: number) => <Monitor size={size} />, label: 'Site Settings', active: false },
    { icon: (size: number) => <Globe size={size} />, label: 'Localization', active: false },
    { icon: (size: number) => <Lock size={size} />, label: 'Permissions', active: false },
    { icon: (size: number) => <Sliders size={size} />, label: 'Security', active: false },
    
    // Mantenimiento
    { icon: (size: number) => <Server size={size} />, label: 'Maintenance', isHeader: true, active: false },
    { icon: (size: number) => <Database size={size} />, label: 'Backups', active: false },
    { icon: (size: number) => <RefreshCw size={size} />, label: 'Updates', active: false },
    { icon: (size: number) => <AlertTriangle size={size} />, label: 'Error Logs', active: false },
    { icon: (size: number) => <CloudOff size={size} />, label: 'Downtime', active: false },

        // NUEVA SECCIÓN: Desarrolladores
        { icon: (size: number) => <Code size={size} />, label: 'Developers', isHeader: true, active: false },
        { icon: (size: number) => <Terminal size={size} />, label: 'Developer Console', active: false },
        { icon: (size: number) => <GitBranch size={size} />, label: 'Repositories', active: false },
        { icon: (size: number) => <Cpu size={size} />, label: 'API Management', active: false },
        { icon: (size: number) => <Box size={size} />, label: 'Components', active: false },
        { icon: (size: number) => <FileCode size={size} />, label: 'Documentation', active: false },
        { icon: (size: number) => <GitPullRequest size={size} />, label: 'Pull Requests', active: false },
        { icon: (size: number) => <Webhook size={size} />, label: 'Webhooks', active: false },
        { icon: (size: number) => <Bug size={size} />, label: 'Debug Tools', active: false },
    
    // Configuración y ayuda
    { icon: (size: number) => <Code size={size} />, label: 'Developers', isHeader: true, active: false },

    { icon: (size: number) => <Settings size={size} />, label: 'Settings', active: false },
    { icon: (size: number) => <HelpCircle size={size} />, label: 'Help Center', active: false },
  ];

  // Función para agrupar los navItems por categorías
  const groupNavItemsByCategory = () => {
    const result: { header: string; items: typeof navItems }[] = [];
    let currentCategory: { header: string; items: typeof navItems } = { 
      header: 'Main', 
      items: [] 
    };

    // El primer ítem siempre es Dashboard y no tiene header
    currentCategory.items.push(navItems[0]);
    
    // Procesa el resto de los ítems
    for (let i = 1; i < navItems.length; i++) {
      const item = navItems[i];
      
      if (item.isHeader) {
        // Guarda la categoría anterior si tiene elementos
        if (currentCategory.items.length > 0) {
          result.push({ ...currentCategory });
        }
        // Inicia una nueva categoría
        currentCategory = { header: item.label, items: [] };
      } else {
        // Agrega el ítem a la categoría actual
        currentCategory.items.push(item);
      }
    }
    
    // Agrega la última categoría si tiene elementos
    if (currentCategory.items.length > 0) {
      result.push(currentCategory);
    }
    
    return result;
  };

  const categoryGroups = groupNavItemsByCategory();

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

      {/* Área de navegación con scroll usando listas */}
      <div className="flex-grow overflow-y-auto">
        <nav className={`p-3 ${collapsed ? 'p-3' : 'p-3'}`}>
          <ul className="space-y-6">
            {categoryGroups.map((group, groupIndex) => (
              <li key={`group-${groupIndex}`} className="space-y-1">
                {/* Título de la sección como encabezado de lista */}
                {groupIndex > 0 && (
                  <div className={`mt-2 mb-2 ${collapsed ? 'px-2' : 'px-3'}`}>
                    {!collapsed && (
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {group.header}
                      </h3>
                    )}
                    {collapsed && (
                      <div className="border-b border-gray-200 mb-1"></div>
                    )}
                  </div>
                )}
                
                {/* Lista de elementos de la sección */}
                <ul className="space-y-1">
                  {group.items.map((item, itemIndex) => (
                    <li key={`item-${groupIndex}-${itemIndex}`}>
                      <a
                        href="#"
                        className={`flex items-center ${collapsed ? 'py-2.5 px-3' : 'py-2 px-3'} rounded-lg transition-colors ${
                          item.active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onMouseEnter={(e) => showTooltip(e, item.label)}
                        onMouseLeave={hideTooltip}
                      >
                        <div className={`flex items-center justify-center ${collapsed ? 'w-8' : 'w-7'}`}>
                          {item.icon(iconSize)}
                        </div>
                        {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer fijo */}
      <div className="flex-shrink-0 p-3 border-t border-gray-200">
        <ul>
          <li>
            <a
              href="#"
              className={`flex items-center ${collapsed ? 'py-2.5 px-3' : 'py-2 px-3'} text-gray-700 rounded-lg hover:bg-gray-100 transition-colors`}
              onMouseEnter={(e) => showTooltip(e, 'Logout')}
              onMouseLeave={hideTooltip}
            >
              <div className={`flex items-center justify-center ${collapsed ? 'w-8' : 'w-7'}`}>
                <LogOut size={iconSize} />
              </div>
              {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
            </a>
          </li>
        </ul>
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

      {/* Sidebar móvil - ahora es más ancho cuando está colapsado */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg flex flex-col transform transition-transform md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: collapsed ? '90px' : '250px' }}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar desktop - ahora es más ancho cuando está colapsado */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm transition-all max-h-screen ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        data-state={collapsed ? 'collapsed' : 'expanded'}
      >
        {sidebarContent}
      </aside>

      {/* Tooltip - Renderizado en el body usando portal para evitar problemas con el layout */}
      {tooltipInfo.visible && collapsed && (
        <div 
          id="sidebar-tooltip"
          className="fixed z-[9999] bg-gray-800 text-white text-sm py-1 px-2.5 rounded shadow-lg pointer-events-none"
          style={{
            top: `${tooltipInfo.position.top}px`,
            left: `${tooltipInfo.position.left}px`,
            transform: 'translateY(-50%)'
          }}
        >
          {tooltipInfo.text}
          <div 
            className="absolute w-2 h-2 bg-gray-800 transform rotate-45"
            style={{
              top: '50%',
              left: '-4px',
              marginTop: '-4px'
            }}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;