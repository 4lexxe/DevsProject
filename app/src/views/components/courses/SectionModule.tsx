import React from 'react';
import { BookOpen, Clock, Code, Rocket, Beaker, BookA, BookAIcon, BookCopy } from 'lucide-react';

interface Section {
  id: number;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  lessonsCount: number;
  duration: number;
}

interface SectionModuleProps {
  section: Section;
}

const SectionModule: React.FC<SectionModuleProps> = ({ section }) => {
  // Helper function to format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} min`;
    }
    
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}min` : ''}`;
  };

  // Helper function to get icon based on module type
  const getModuleIcon = () => {
    switch (section.moduleType.toLowerCase()) {
      case 'fundamental':
        return <BookOpen className="w-6 h-6 text-gray-700" />;
      case 'avanzado':
        return <Rocket className="w-6 h-6 text-gray-700" />;
      case 'practico':
        return <Code className="w-6 h-6 text-gray-700" />;
      default:
        return <Beaker className="w-6 h-6 text-gray-700" />;
    }
  };

  // Helper function to get gradient based on module type
  const getGradient = () => {
    switch (section.moduleType.toLowerCase()) {
      case 'fundamental':
        return 'from-purple-500/90 to-pink-500/90';
      case 'avanzado':
        return 'from-yellow-400/90 to-orange-500/90';
      default:
        return 'from-teal-400/90 to-blue-500/90';
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="relative">
        {/* Background image with gradient overlay */}
        <div className="relative h-24 w-full">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${section.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070'})` 
            }}
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getGradient()}`} />
          
          {/* Module icon */}
          <div className="absolute -bottom-6 left-6">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <BookCopy/>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-8">
        {/* Module type badge */}
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 mb-3">
          {section.moduleType}
        </span>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {section.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {section.description}
        </p>
      </div>
    </div>
  );
};

export default SectionModule;