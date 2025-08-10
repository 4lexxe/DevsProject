import React from 'react';
import { FileText, CreditCard } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'orders' | 'payments';
  onTabChange: (tab: 'orders' | 'payments') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8">
      <div className="flex bg-white rounded-lg p-1 shadow-sm" style={{ border: "2px solid #42d7c7" }}>
        <button
          onClick={() => onTabChange('orders')}
          className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
            activeTab === 'orders'
              ? 'text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          style={activeTab === 'orders' ? { backgroundColor: "#42d7c7" } : {}}
        >
          <span className="flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Mis Órdenes
          </span>
        </button>
        <button
          onClick={() => onTabChange('payments')}
          className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
            activeTab === 'payments'
              ? 'text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          style={activeTab === 'payments' ? { backgroundColor: "#42d7c7" } : {}}
        >
          <span className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            Mis Pagos
          </span>
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
