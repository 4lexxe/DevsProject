import React from 'react'

interface AuthButtonProps {
  variant: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

export default function AuthButton({
  variant,
  children,
  onClick,
  type = 'button',
  fullWidth = false
}: AuthButtonProps) {
  // Estilos base para todos los botones
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"

  // Estilos específicos según la variante
  const styles = {
    primary: `${baseStyles} bg-[#00D7FF] text-black hover:bg-[#66E7FF]`,
    secondary: `${baseStyles} bg-blue-700 text-white hover:bg-blue-800`,
    outline: `${baseStyles} border-2 border-[#00D7FF] text-[#00D7FF] hover:bg-[#CCF7FF]`
  }

  // Clase adicional para ancho completo
  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles[variant]} ${widthClass}`}
    >
      {children}
    </button>
  )
}