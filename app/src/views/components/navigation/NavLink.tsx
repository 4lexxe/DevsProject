interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <a 
      href={href} 
      className="text-black hover:text-white hover:bg-blue-700 transition-colors duration-200 block px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </a>
  )
}