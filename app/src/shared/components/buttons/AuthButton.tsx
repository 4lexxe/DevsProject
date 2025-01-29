import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

interface AuthButtonProps {
  href: string;
  variant: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export default function AuthButton({
  href, 
  variant,
  children,
  onClick = () => {},
  type = "button",
  fullWidth = false,
}: AuthButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";

  const buttonClass = clsx(baseStyles, {
    "bg-[#00D7FF] text-black hover:bg-[#66E7FF]": variant === "primary",
    "bg-blue-700 text-white hover:bg-blue-800": variant === "secondary",
    "border-2 border-[#00D7FF] text-[#00D7FF] hover:bg-[#CCF7FF]":
      variant === "outline",
    "w-full": fullWidth,
  });

  return (
    <Link to={href}>
      <button
        type={type}
        onClick={onClick}
        className={buttonClass}
        aria-label={children?.toString()}
      >
        {children}
      </button>
    </Link>
  );
}
