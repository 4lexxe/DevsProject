import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = "" }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-4 py-2 text-sm font-semibold rounded-2xl transition-all duration-300
        ${isActive 
          ? 'text-blue-600 bg-blue-50 border border-blue-200' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.a>
  );
};

export default NavLink;