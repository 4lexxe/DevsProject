import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface CategoryCardProps {
  name: string;
  icon: ReactNode;
  count: number;
  color: string;
}

export default function CategoryCard({ name, icon, count, color }: CategoryCardProps) {
  return (
    <div 
      className="group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
      style={{ backgroundColor: color }}
    >
      <Link 
        to={`/cursos/${name.toLowerCase()}`} 
        className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center"
      >
        <span className="w-12 h-12 flex items-center justify-center mb-3 transform transition-transform group-hover:scale-110 duration-300">
          {icon} {/* Renderiza el ícono directamente */}
        </span>
        <h3 className="font-semibold text-black/90 mb-1 text-lg">{name}</h3>
        <span className="text-sm text-black/70">{count} cursos</span>
      </Link>
    </div>
  );
}