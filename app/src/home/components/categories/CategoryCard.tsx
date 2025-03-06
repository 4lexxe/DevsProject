import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  coursesCount: number;
}

export default function CategoryCard({
  id,
  name,
  icon,
  coursesCount,
}: CategoryCardProps) {

  return (
    <Link to={`/courses/category/${id}`} >
      <div className="group relative aspect-[4/5]   min-h-[225px]  rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-b from-white to-gray-50 border border-gray-100">
        <div className="absolute inset-0 p-2 flex flex-col items-center justify-around text-center">
          <div className=" ">
            <img
              src={icon || "/placeholder.svg"}
              alt={`Icono de ${name}`}
              className="w-[80px] object-contain group-hover:text-blue-600"
            />
          </div>

          <div className="w-full space-y-2">
            <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 category-card-title">
              {name}
            </h3>
            <span className="inline-block text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 border border-gray-100">
              {coursesCount} {coursesCount === 1 ? "curso" : "cursos"}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
}
