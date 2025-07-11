import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import RatingService from '../services/rating.service';
import { usePermissions } from '../../shared/hooks/usePermissions';

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
  const { hasPermission, user } = usePermissions();
  const [starCount, setStarCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Debug en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('⭐ Rating Component Debug:', {
        user: user,
        canRate: hasPermission('rate:resources'),
        userRole: user?.role?.name,
        mode: mode
      });
    }
  }, [user, hasPermission, mode]);

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

    // Verificar permisos antes de calificar
    if (!hasPermission('rate:resources')) {
      console.warn('No tienes permisos para calificar recursos');
      if (!user) {
        alert('Debes iniciar sesión para calificar recursos');
      } else {
        alert('No tienes permisos para calificar recursos');
      }
      return;
    }

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
      alert('Error al calificar el recurso');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const canRate = hasPermission('rate:resources');

  return (
    <div className="flex items-center gap-1">
      {/* Debug info en desarrollo */}
      {process.env.NODE_ENV === 'development' && mode === 'interactive' && (
        <div className="absolute z-10 -top-16 left-0 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
          {user ? `Puede calificar: ${canRate ? 'Sí' : 'No'}` : 'No autenticado'}
        </div>
      )}

      {mode === 'interactive' && canRate ? (
        <button
          onClick={() => handleRate(true)}
          disabled={loading}
          className={`${sizeClasses[size]} text-yellow-400 hover:text-yellow-500 transition-colors disabled:opacity-50`}
          title={user ? "Calificar recurso" : "Inicia sesión para calificar"}
        >
          <Star fill="currentColor" />
        </button>
      ) : mode === 'interactive' && !canRate ? (
        <div 
          className={`${sizeClasses[size]} text-gray-400 cursor-not-allowed`}
          title={!user ? "Inicia sesión para calificar" : "No tienes permisos para calificar"}
        >
          <Star fill="currentColor" />
        </div>
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