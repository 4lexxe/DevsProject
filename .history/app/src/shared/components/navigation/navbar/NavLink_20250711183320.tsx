import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className = "" }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-gray-900' 
          : 'text-gray-600 hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </Link>
  );
}