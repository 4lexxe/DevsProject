// Componente reutilizable para botones de autenticación
interface AuthButtonProps {
  variant: 'primary' | 'outline'
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}

export default function AuthButton({ 
  variant, 
  children, 
  onClick,
  type = 'button' 
}: AuthButtonProps) {
  // Estilos base para todos los botones
  const baseStyles = "px-4 py-2 rounded-md transition-colors duration-200 font-medium"
  
  // Estilos específicos según la variante
  const styles = {
    primary: `${baseStyles} bg-[#00D7FF] hover:bg-[#66E7FF] text-black`,
    outline: `${baseStyles} border-2 border-[#00D7FF] text-[#00D7FF] hover:bg-[#CCF7FF]`
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={styles[variant]}
    >
      {children}
    </button>
  )
}