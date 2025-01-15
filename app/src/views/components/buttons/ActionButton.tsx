// Botón principal para llamadas a la acción
interface ActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

export default function ActionButton({ children, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-[#00D7FF] text-black rounded-md hover:bg-[#66E7FF] 
                transition-colors duration-200 font-medium"
    >
      {children}
    </button>
  )
}