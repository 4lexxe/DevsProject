import React, { useState } from 'react';
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
  Bell
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <BookOpen size={20} />, label: 'Courses', active: false },
    { icon: <Users size={20} />, label: 'Students', active: false },
    { icon: <GraduationCap size={20} />, label: 'Instructors', active: false },
    { icon: <FileText size={20} />, label: 'Assignments', active: false },
    { icon: <BarChart size={20} />, label: 'Reports', active: false },
    { icon: <Bell size={20} />, label: 'Notifications', active: false },
    { icon: <MessageSquare size={20} />, label: 'Messages', active: false },
    { icon: <Settings size={20} />, label: 'Settings', active: false },
    { icon: <HelpCircle size={20} />, label: 'Help Center', active: false },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Logo y título centrados verticalmente */}
        <div className="flex items-center">
          {!collapsed && (
            <span className="text-lg font-semibold text-gray-800">Admin Panel</span>
          )}
        </div>

        {/* Botones con dimensiones y alineación consistentes */}
        <div className="flex items-center">
          {/* Botón para pantallas de escritorio */}
          <button 
            onClick={toggleSidebar} 
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          
          {/* Botón para móvil */}
          <button 
            onClick={toggleMobileSidebar} 
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              item.active 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </a>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-gray-200">
        <a
          href="#"
          className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button - mejor alineado y consistente con otros botones */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-md bg-white shadow-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileSidebar}
      ></div>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-200 transition-all ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;