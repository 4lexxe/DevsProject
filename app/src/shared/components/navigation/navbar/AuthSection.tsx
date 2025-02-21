import { FC } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import AuthButton from '../../buttons/AuthButton';

interface AuthSectionProps {
  onNavigate: () => void;
  isMobile?: boolean;
}

export const AuthSection: FC<AuthSectionProps> = ({ onNavigate, isMobile = false }) => {
  const containerClasses = isMobile
    ? "flex flex-col space-y-3 px-4"
    : "flex items-center space-x-4";

  return (
    <div className={containerClasses}>
      <AuthButton 
        variant="secondary" 
        fullWidth={isMobile}
        href="/login"
        className={`flex items-center ${isMobile ? 'justify-center' : ''} space-x-2 px-6 py-${isMobile ? '3' : '2.5'} rounded-lg hover:bg-blue-100 transition-all duration-200`}
        onClick={onNavigate}
      >
        <LogIn className="h-5 w-5" />
        <span>Iniciar Sesión</span>
      </AuthButton>
      <AuthButton 
        variant="primary" 
        fullWidth={isMobile}
        href="/register"
        className={`flex items-center ${isMobile ? 'justify-center' : ''} space-x-2 px-6 py-${isMobile ? '3' : '2.5'} rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg`}
        onClick={onNavigate}
      >
        <UserPlus className="h-5 w-5" />
        <span>Registrarse</span>
      </AuthButton>
    </div>
  );
};