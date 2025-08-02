import { PlayCircle, FileText, Code, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';

interface ModuleContentProps {
  content: any[];
  expandedContent: string | null;
  onToggleContent: (id: string) => void;
}

export default function ModuleContent({ content, expandedContent, onToggleContent }: ModuleContentProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5 text-blue-600 mt-1" />;
      case 'reading': return <FileText className="w-5 h-5 text-blue-600 mt-1" />;
      case 'practice': return <Code className="w-5 h-5 text-blue-600 mt-1" />;
      case 'diagram': return <ImageIcon className="w-5 h-5 text-blue-600 mt-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {content.map((item, index) => (
        <div key={index}>
          {item.expandable ? (
            <div 
              className="flex items-start space-x-3 cursor-pointer"
              onClick={() => onToggleContent(item.id)}
            >
              {getIcon(item.type)}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.duration}</p>
                  </div>
                  {expandedContent === item.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                {expandedContent === item.id && item.content && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-700">
                    {item.content}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3">
              {getIcon(item.type)}
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.duration}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}