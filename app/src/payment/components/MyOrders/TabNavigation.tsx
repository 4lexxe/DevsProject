import React from 'react';
import { motion } from 'framer-motion';
import FontelloIcon from '@/shared/components/icons/FontelloIcon';

interface TabNavigationProps {
  activeTab: 'orders' | 'payments';
  onTabChange: (tab: 'orders' | 'payments') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-10">
      <div className="flex bg-white rounded-xl p-1.5 shadow-lg border border-gray-200 max-w-lg mx-auto">
        <motion.button
          onClick={() => onTabChange('orders')}
          className={`flex-1 px-6 py-4 rounded-lg font-light transition-all duration-300 relative ${
            activeTab === 'orders'
              ? 'bg-gray-900 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              activeTab === 'orders' ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              <FontelloIcon 
                name="icon-doc-text" 
                className={`text-lg ${activeTab === 'orders' ? 'text-white' : 'text-gray-600'}`}
                fallback={
                  <svg className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
            </div>
            <span>Mis Órdenes</span>
            {activeTab === 'orders' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gray-900 rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </span>
        </motion.button>
        <motion.button
          onClick={() => onTabChange('payments')}
          className={`flex-1 px-6 py-4 rounded-lg font-light transition-all duration-300 relative ${
            activeTab === 'payments'
              ? 'bg-gray-900 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              activeTab === 'payments' ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              <FontelloIcon 
                name="icon-credit-card" 
                className={`text-lg ${activeTab === 'payments' ? 'text-white' : 'text-gray-600'}`}
                fallback={
                  <svg className={`w-4 h-4 ${activeTab === 'payments' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
              />
            </div>
            <span>Mis Pagos</span>
            {activeTab === 'payments' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gray-900 rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default TabNavigation;
