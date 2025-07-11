import type React from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, GraduationCap, ArrowRight, Star, Users, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: number;
  title: string;
  summary: string;
  courseName: string;
  image: string;
  careerType: string;
  index?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  summary,
  courseName,
  image,
  careerType,
  index = 0
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.3 }
      }}
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-purple-200 cursor-pointer max-w-sm mx-auto"
      onClick={handleViewCourse}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Course Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        
        {/* Floating badges */}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
            Nuevo
          </div>
        </div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* Career type badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-lg border border-white/50">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            {careerType}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Header with rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors flex-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-sm font-semibold text-gray-700">4.9</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
          {summary}
        </p>

        {/* Course stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm font-semibold text-gray-900">850</div>
            <div className="text-xs text-gray-500">estudiantes</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-xl mx-auto mb-2">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm font-semibold text-gray-900">12h</div>
            <div className="text-xs text-gray-500">duración</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-xl mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm font-semibold text-gray-900">25</div>
            <div className="text-xs text-gray-500">lecciones</div>
          </div>
        </div>

        {/* Course name */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="font-medium line-clamp-1">{courseName}</span>
          </div>
        </div>

        {/* Footer with price and button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900">Gratis</span>
            <span className="text-xs text-emerald-600 font-semibold">100% Online</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            
            <Sparkles className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Ver curso</span>
            <ArrowRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
    </motion.div>
  );
};

export default CourseCard;
