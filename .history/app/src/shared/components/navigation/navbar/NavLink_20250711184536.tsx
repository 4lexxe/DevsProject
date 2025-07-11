import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, icon, className = "" }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      } ${className}`}
    >
      {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}