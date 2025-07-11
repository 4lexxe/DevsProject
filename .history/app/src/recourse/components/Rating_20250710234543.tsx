import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import RatingService from '../services/rating.service';

interface RatingProps {
  resourceId: number;
  mode?: 'display' | 'interactive';
  size?: 'sm' | 'md' | 'lg';
}

const RatingComponent: React.FC<RatingProps> = ({ 
  resourceId, 
  mode = 'display', 
  size = 'sm' 
}) => {
  const [starCount, setStarCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const data = await RatingService.getStarCount(resourceId);
        setStarCount(data.starCount || 0);
      } catch (error) {
        console.error('Error fetching star count:', error);
        setStarCount(0);
      }
    };

    fetchStarCount();
  }, [resourceId]);

  const handleRate = async (star: boolean) => {
    if (mode !== 'interactive' || loading) return;

    try {
      setLoading(true);
      await RatingService.rateResource({ resourceId, star });
      
      if (userRating === null) {
        setStarCount(prev => star ? prev + 1 : prev);
      } else if (userRating !== star) {
        setStarCount(prev => star ? prev + 1 : prev - 1);
      }
      
      setUserRating(star);
    } catch (error) {
      console.error('Error rating resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {mode === 'interactive' ? (
        <button
          onClick={() => handleRate(true)}
          disabled={loading}
          className={`${sizeClasses[size]} text-yellow-400 hover:text-yellow-500 transition-colors disabled:opacity-50`}
        >
          <Star fill="currentColor" />
        </button>
      ) : (
        <Star className={`${sizeClasses[size]} text-yellow-400`} fill="currentColor" />
      )}
      <span className="text-sm text-gray-600 font-medium">
        {starCount}
      </span>
    </div>
  );
};

export default RatingComponent;