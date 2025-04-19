import React, { useState, useEffect } from 'react';
import { Star, StarFill } from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import RatingService from '../services/rating.service';
import { useAuth } from '../../auth/contexts/AuthContext';

interface RatingProps {
  resourceId: number;
  mode: 'view' | 'interactive';
}

interface Rating {
  userId: number;
  star: boolean;
}

const RatingComponent: React.FC<RatingProps> = ({ resourceId, mode }) => {
  const [totalStars, setTotalStars] = useState<number>(0);
  const [userRating, setUserRating] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratings = await RatingService.getRatingsByResource(resourceId);
        const stars = ratings.filter((rating: Rating) => rating.star).length;
        setTotalStars(stars);

        if (mode === 'interactive' && user) {
          const userRating = ratings.find(
            (rating: Rating) => rating.userId === user.id
          )?.star || null;
          setUserRating(userRating);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Error al cargar las calificaciones');
        }
      }
    };

    fetchRatings();
  }, [resourceId, mode, user]);

  const handleStarClick = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para calificar');
      return;
    }

    setLoading(true);

    try {
      if (userRating === null) {
        await RatingService.rateResource({ resourceId, star: true });
        setTotalStars(prev => prev + 1);
        setUserRating(true);
        toast.success('Recurso calificado exitosamente');
      } else {
        await RatingService.deleteRating(resourceId);
        setTotalStars(prev => Math.max(0, prev - 1));
        setUserRating(null);
        toast.success('Calificación eliminada exitosamente');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al procesar la calificación');
      }
      // Revertir el estado visual si hay un error
      if (userRating === null) {
        setUserRating(null);
      } else {
        setUserRating(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'view') {
    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <StarFill className="w-5 h-5" />
        <span>{totalStars || 0}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={handleStarClick}>
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500" />
      ) : userRating ? (
        <StarFill className="w-5 h-5 text-yellow-500" />
      ) : (
        <Star className="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors" />
      )}
      <span>{totalStars || 0}</span>
    </div>
  );
};

export default RatingComponent;