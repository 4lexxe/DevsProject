import React from "react";
import { Link } from "react-router-dom";

interface AuthButtonProps {
  href: string;
  variant: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function AuthButton({
  href,
  variant,
  children,
  onClick = () => {},
  type = "button",
  fullWidth = false,
  icon,
  className = "",
}: AuthButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg px-5 py-2.5",
    secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100 px-5 py-2.5",
    outline: "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-5 py-2.5"
  };

  const widthStyles = fullWidth ? "w-full" : "w-auto";

  const buttonClass = `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`;

  return (
    <Link to={href} className={widthStyles}>
      <button
        type={type}
        onClick={onClick}
        className={buttonClass}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    </Link>
  );
}