import { Link } from "react-router-dom";
import FontelloIcon from "@/shared/components/icons/FontelloIcon";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  coursesCount: number;
}

// Mapeo de nombres de categorías a iconos Fontello
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  const iconMap: Record<string, string> = {
    'inteligencia artificial': 'icon-cog',
    'artificial intelligence': 'icon-cog',
    'ai': 'icon-cog',
    'blockchain': 'icon-link',
    'internet de las cosas': 'icon-wifi',
    'iot': 'icon-wifi',
    'ciberseguridad': 'icon-shield',
    'cybersecurity': 'icon-shield',
    'desarrollo web': 'icon-code',
    'web development': 'icon-code',
    'cloud computing': 'icon-cloud',
    'big data': 'icon-database',
    'robótica': 'icon-cog-alt',
    'robotics': 'icon-cog-alt',
    'programación': 'icon-code',
    'programming': 'icon-code',
    'diseño': 'icon-pencil',
    'design': 'icon-pencil',
    'marketing': 'icon-megaphone',
    'negocios': 'icon-briefcase',
    'business': 'icon-briefcase',
  };

  // Buscar coincidencia exacta o parcial
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key) || key.includes(name)) {
      return icon;
    }
  }

  // Icono por defecto
  return 'icon-folder';
};

export default function CategoryCard({
  id,
  name,
  icon,
  coursesCount,
}: CategoryCardProps) {
  const iconName = getCategoryIcon(name);

  return (
    <Link to={`/courses/category/${id}`} className="h-full block">
      <div className="group relative bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-sm flex flex-col items-center justify-between text-center h-full min-h-[200px]">
        {/* Icono */}
        <div className="flex-shrink-0 mb-4">
        <FontelloIcon
          name={iconName}
            className="text-5xl text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
          fallback={
              <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          }
        />
        </div>

        {/* Nombre de la categoría */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 flex-grow flex items-center justify-center min-h-[3rem] max-h-[3rem] w-full">
          {name}
        </h3>

        {/* Contador de cursos */}
        <span className="text-sm text-gray-500 font-medium flex-shrink-0">
          {coursesCount} {coursesCount === 1 ? "curso" : "cursos"}
        </span>
      </div>
    </Link>
  );
}
