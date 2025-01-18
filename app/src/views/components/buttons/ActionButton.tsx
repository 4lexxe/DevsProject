import React from 'react';

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="inline-block px-8 py-4 mt-4 text-lg font-semibold text-black bg-[#00D7FF] rounded-full hover:bg-[#00b3cc] transition"
    >
      {children}
    </a>
  );
};

export default ActionButton;