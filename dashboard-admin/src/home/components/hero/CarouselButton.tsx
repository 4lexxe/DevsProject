import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  className?: string;
}

export default function CarouselButton({ direction, onClick, className = '' }: CarouselButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${className} group p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 transform hover:scale-110`}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
    >
      {direction === 'left' ? (
        <ChevronLeft className="w-8 h-8 text-white group-hover:text-[#00D7FF] transition-colors" />
      ) : (
        <ChevronRight className="w-8 h-8 text-white group-hover:text-[#00D7FF] transition-colors" />
      )}
    </button>
  );
}