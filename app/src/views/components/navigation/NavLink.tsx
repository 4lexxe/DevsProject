// Componente para enlaces de navegación consistentes
interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <a 
      href={href} 
      className="text-black hover:text-[#00D7FF] transition-colors duration-200"
    >
      {children}
    </a>
  )
}