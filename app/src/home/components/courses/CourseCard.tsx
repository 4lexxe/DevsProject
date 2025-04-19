
import type React from "react";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: number;
  title: string;
  summary: string;
  courseName: string;
  image: string;
  careerType: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  summary,
  image,
  careerType,
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`);
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto transition-all duration-300 group">
      {/* Card structure with subtle border */}
      <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col shadow-sm border border-gray-100 group-hover:shadow-md group-hover:border-gray-200 transition-all duration-300">
        {/* Image container */}
        <div className="relative">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Career type badge */}
          <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700 backdrop-blur-sm shadow-sm">
            <span className="line-clamp-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              {careerType}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{summary}</p>



          {/* Button */}
          <button
            onClick={handleViewCourse}
            className="w-full py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200
            transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium
            hover:bg-blue-100 hover:text-blue-800 group-hover:border-blue-300"
          >
            Ver curso
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
