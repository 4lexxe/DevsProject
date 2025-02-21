import { FC } from 'react';

interface NavbarLogoProps {
  onNavigate: () => void;
}

export const NavbarLogo: FC<NavbarLogoProps> = ({ onNavigate }) => {
  return (
    <div className="flex-shrink-0 transition-transform duration-200 hover:scale-105">
      <a 
        href="/" 
        className="flex items-center space-x-2"
        onClick={(e) => {
          e.preventDefault();
          onNavigate();
        }}
      >
        <div className="h-16 w-16 mx-auto">
          <img
            src="https://i.ibb.co/dQ09SsH/logoDev2.png"
            alt="Devs Project Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </a>
    </div>
  );
};