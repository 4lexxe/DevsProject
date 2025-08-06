import { useState } from 'react';
import { Settings as SettingsIcon, Database, User, Bell, Shield, Palette } from 'lucide-react';
import CacheManager from '@/shared/components/CacheManager';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configuración de Perfil</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">Configuración de perfil próximamente...</p>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">Configuración de notificaciones próximamente...</p>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Privacidad y Seguridad</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">Configuración de privacidad próximamente...</p>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Apariencia</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-600">Configuración de tema próximamente...</p>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('cache');

  const tabs: SettingsTab[] = [
    {
      id: 'cache',
      label: 'Gestión de Caché',
      icon: Database,
      component: CacheManager,
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      component: ProfileSettings,
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: Bell,
      component: NotificationSettings,
    },
    {
      id: 'privacy',
      label: 'Privacidad',
      icon: Shield,
      component: PrivacySettings,
    },
    {
      id: 'appearance',
      label: 'Apariencia',
      icon: Palette,
      component: AppearanceSettings,
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CacheManager;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Gestiona tus preferencias y configuraciones de la aplicación
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}