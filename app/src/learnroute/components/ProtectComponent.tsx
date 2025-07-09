
import { useAuth } from '@/user/contexts/AuthContext';

import { ReactNode } from 'react';

const ProtectedComponent = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // Validación de rol: Se comprueba de forma estricta que el usuario tenga privilegios.
  // Nota: Esta validación es para la experiencia de usuario, la seguridad crítica se implementa en el backend.
  const hasPrivileges = 
    user && (
      user.role?.name === 'superadmin' ||
      (user.role?.permissions && user.role.permissions.includes('privileged'))
    );

  if (!hasPrivileges) {
    // Si el usuario no tiene privilegios, no se renderiza el componente.
    return null;
  }

  return <>
    {children}
  </>;
};

export default ProtectedComponent;
