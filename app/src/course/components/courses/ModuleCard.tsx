import React from 'react';
import { Brain, Rocket, Code, Zap } from 'lucide-react';
import ModuleContent from './ModuleContent';

interface ModuleCardProps {
  module: {
    number: number;
    title: string;
    type: 'fundamental' | 'advanced';
    content: any[];
  };
  expandedContent: string | null;
  onToggleContent: (id: string) => void;
}

export default function ModuleCard({ module, expandedContent, onToggleContent }: ModuleCardProps) {
  const getModuleStyles = (type: 'fundamental' | 'advanced') => {
    if (type === 'fundamental') {
      return {
        gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        icon: <Brain className="w-20 h-20 text-white/10" />,
        badge: {
          icon: <Zap className="w-4 h-4" />,
          text: 'Módulo Fundamental',
          color: 'text-blue-100'
        }
      };
    }
    return {
      gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
      icon: <Rocket className="w-20 h-20 text-white/10" />,
      badge: {
        icon: <Code className="w-4 h-4" />,
        text: 'Módulo Avanzado',
        color: 'text-purple-100'
      }
    };
  };

  const styles = getModuleStyles(module.type);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className={`relative h-24 ${styles.gradient} flex items-center px-6`}>
        {module.type === 'advanced' && (
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        )}
        <div className="absolute right-0 top-0 h-full w-32 flex items-center justify-center">
          {styles.icon}
        </div>
        <div className="relative z-10">
          <div className={`flex items-center space-x-2 ${styles.badge.color} mb-1`}>
            {styles.badge.icon}
            <span className="text-sm">{styles.badge.text}</span>
          </div>
          <h3 className="text-xl font-semibold text-white">
            {module.number}. {module.title}
          </h3>
        </div>
      </div>
      <div className="p-6">
        <ModuleContent 
          content={module.content} 
          expandedContent={expandedContent}
          onToggleContent={onToggleContent}
        />
      </div>
    </div>
  );
}