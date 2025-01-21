import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Rocket, Beaker, BookCopy, ChevronDown, ChevronUp } from 'lucide-react';
import { getContentBySection } from '../../../services/contentServices';
import ContentViewer from './ContentViewer';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch content when section is expanded
  useEffect(() => {
    const fetchContent = async () => {
      if (isExpanded && contents.length === 0) {
        try {
          setLoading(true);
          const data = await getContentBySection(section.id.toString());
          setContents(data);
          setError(null);
        } catch (err) {
          setError('Failed to load content');
          console.error('Error loading content:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContent();
  }, [isExpanded, section.id]);

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
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
          <div className="flex justify-between items-center">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 mb-3">
              {section.moduleType}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
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

      {/* Content Section */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : contents.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No content available</div>
          ) : (
            <div className="space-y-4">
              {contents.map((content) => (
                <ContentViewer key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionModule;