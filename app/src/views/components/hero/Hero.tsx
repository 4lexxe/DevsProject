import { ChevronLeft, ChevronRight } from 'lucide-react'
import CarouselButton from './CarouselButton'
import HeroContent from './HeroContent'

export default function Hero() {
  return (
    <div className="relative flex items-center justify-between px-6 py-16 bg-[rgb(232,242,243)]">
      {/* Botones de navegación del carrusel */}
      <CarouselButton direction="left" />
      
      {/* Contenido principal del hero */}
      <HeroContent />
      
      <CarouselButton direction="right" />
    </div>
  )
}