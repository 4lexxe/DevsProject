import React, { useState } from 'react';
import { Bell, Search, ChevronDown, Settings, HelpCircle, User, LogOut } from 'lucide-react';
import { User as UserType, Notification } from '../types';

interface HeaderProps {
  user: UserType;
  notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ user, notifications }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">EduLearn Admin</h1>
        </div>
        
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search size={18} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, students, instructors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 text-center border-t border-gray-200">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <User size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm">Profile</span>
                  </a>
                  <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <Settings size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm">Settings</span>
                  </a>
                  <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <HelpCircle size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm">Help</span>
                  </a>
                  <div className="my-1 border-t border-gray-100"></div>
                  <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-red-600">
                    <LogOut size={16} className="mr-2" />
                    <span className="text-sm">Logout</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;