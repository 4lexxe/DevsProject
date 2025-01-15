import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselButtonProps {
  direction: 'left' | 'right'
}

export default function CarouselButton({ direction }: CarouselButtonProps) {
  return (
    <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200">
      {direction === 'left' ? (
        <ChevronLeft className="w-6 h-6 text-[#00D7FF]" />
      ) : (
        <ChevronRight className="w-6 h-6 text-[#00D7FF]" />
      )}
    </button>
  )
}