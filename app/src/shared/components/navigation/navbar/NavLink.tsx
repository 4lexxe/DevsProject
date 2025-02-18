import { Link } from "react-router-dom";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function NavLink({ href, children, icon, className = "" }: NavLinkProps) {
  return (
    <Link
      to={href}
      className={`block text-base font-medium text-gray-700 transition-all duration-200 
        hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        ${className}`}
    >
      <div className="flex items-center space-x-2">
        {icon && <span className="flex-shrink-0 text-blue-500">{icon}</span>}
        <span>{children}</span>
      </div>
    </Link>
  );
}