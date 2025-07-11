import React from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, GraduationCap, ArrowRight, Star, Users, PlayCircle, Heart } from "lucide-react";
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
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer max-w-sm mx-auto"
      onClick={handleViewCourse}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        
        {/* Floating badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
            Nuevo
          </div>
        </div>
        
        {/* Heart button */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
            <PlayCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* Career type badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            {careerType}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Header with rating */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold text-gray-700">4.9</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
          {summary}
        </p>

        {/* Course stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg mx-auto mb-1">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs text-gray-500">1.2k</div>
            <div className="text-xs text-gray-400">estudiantes</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg mx-auto mb-1">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xs text-gray-500">6h</div>
            <div className="text-xs text-gray-400">duración</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg mx-auto mb-1">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xs text-gray-500">15</div>
            <div className="text-xs text-gray-400">lecciones</div>
          </div>
        </div>

        {/* Course name */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{courseName}</span>
          </div>
        </div>

        {/* Footer with price and button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">Gratis</span>
            <span className="text-xs text-green-600 font-semibold">100% Online</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="group/btn relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            
            <span className="relative z-10">Ver curso</span>
            <ArrowRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
    </motion.div>
  );
};

export default CourseCard;
