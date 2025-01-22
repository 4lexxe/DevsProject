import { Link } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  // Esto especifica que la propiedad children puede ser cualquier contenido
  // renderizable en React, incluyen: texto, un elemento JSX,
  // un fragmento, un array de nodos, o incluso null
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link to={href} className="block px-3 py-2 text-base font-medium text-black transition-colors duration-200 rounded-md hover:text-white hover:bg-blue-700">
      {children}
    </Link>
  );
}