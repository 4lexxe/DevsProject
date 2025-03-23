import React from 'react';
import { ForumFlair } from '../services/forumFlair.service';


interface FlairTagProps {
  flair: ForumFlair;
  className?: string;
}

const FlairTag: React.FC<FlairTagProps> = ({ flair, className = '' }) => {
  const backgroundColor = flair.color ? `${flair.color}20` : '#e2e8f0';
  const textColor = flair.color || '#4a5568';
  
  return (
    <span 
      className={`inline-flex items-center rounded ${className}`}
      style={{ 
        backgroundColor, 
        color: textColor,
        borderColor: `${flair.color}40`
      }}
    >
      {flair.icon && (
        <span className="mr-1">{flair.icon}</span>
      )}
      {flair.name}
    </span>
  );
};

export default FlairTag;