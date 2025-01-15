import { Instagram, Youtube, Twitter, Twitch } from 'lucide-react'

const menuItems = {
  column1: [
    { label: 'Inicio', href: '/' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Instructores', href: '/instructores' },
    { label: 'Precios', href: '/precios' }
  ],
  column2: [
    { label: 'Sobre Nosotros', href: '/nosotros' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Soporte', href: '/soporte' }
  ]
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Twitch, href: '#', label: 'Twitch' }
]

export default function Footer() {
  return (
    <footer className="bg-[#CCF7FF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Logo */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-black">Devs Project</h2>
          </div>

          {/* Menu Column 1 */}
          <div>
            <ul className="space-y-3">
              {menuItems.column1.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href}
                    className="text-sm sm:text-base text-black/70 hover:text-[#00D7FF] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Column 2 */}
          <div>
            <ul className="space-y-3">
              {menuItems.column2.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href}
                    className="text-sm sm:text-base text-black/70 hover:text-[#00D7FF] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 justify-start sm:justify-end">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="text-black/70 hover:text-[#00D7FF] transition-colors"
                aria-label={label}
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-8 border-t border-black/10">
          <p className="text-center text-xs sm:text-sm text-black/60">
            © {new Date().getFullYear()} Devs Project. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}