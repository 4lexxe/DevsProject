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
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-4 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 group
        ${isActive 
          ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
        }
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.a>
  );
};

export default NavLink;