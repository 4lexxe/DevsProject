import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FontelloIcon from '@/shared/components/icons/FontelloIcon';

interface EmptyStateProps {
  type: 'orders' | 'payments';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const isOrders = type === 'orders';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="mb-8 flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
            <FontelloIcon 
              name={isOrders ? 'icon-doc-text' : 'icon-credit-card'} 
              className="text-6xl text-gray-400"
              fallback={
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOrders ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  )}
                </svg>
              }
            />
          </div>
          {/* Decoración circular */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-dashed border-gray-300 rounded-full"
          />
        </motion.div>
      </div>
      
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-tight"
      >
        {isOrders ? "No tienes órdenes aún" : "No tienes pagos registrados"}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 font-light mb-10 max-w-md mx-auto text-lg"
      >
        Cuando realices tu primera compra, aparecerá aquí
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/cursos"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-light hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
        >
          <FontelloIcon 
            name="icon-search" 
            className="text-xl group-hover:scale-110 transition-transform"
            fallback={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <span>Explorar Cursos</span>
          <FontelloIcon 
            name="icon-right-open" 
            className="text-base group-hover:translate-x-1 transition-transform"
            fallback={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
