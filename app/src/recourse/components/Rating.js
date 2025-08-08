import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import RatingService from '../services/rating.service';
import { usePermissions } from '../../shared/hooks/usePermissions';
const RatingComponent = ({ resourceId, mode = 'display', size = 'sm' }) => {
    const { hasPermission, user } = usePermissions();
    const [starCount, setStarCount] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchStarCount = async () => {
            try {
                const data = await RatingService.getStarCount(resourceId);
                setStarCount(data.starCount || 0);
            }
            catch (error) {
                console.error('Error fetching star count:', error);
                setStarCount(0);
            }
        };
        fetchStarCount();
    }, [resourceId]);
    const handleRate = async (star) => {
        if (mode !== 'interactive' || loading)
            return;
        // Verificar permisos antes de calificar
        if (!hasPermission('rate:resources')) {
            console.warn('No tienes permisos para calificar recursos');
            if (!user) {
                alert('Debes iniciar sesión para calificar recursos');
            }
            else {
                alert('No tienes permisos para calificar recursos');
            }
            return;
        }
        try {
            setLoading(true);
            await RatingService.rateResource({ resourceId, star });
            if (userRating === null) {
                setStarCount(prev => star ? prev + 1 : prev);
            }
            else if (userRating !== star) {
                setStarCount(prev => star ? prev + 1 : prev - 1);
            }
            setUserRating(star);
        }
        catch (error) {
            console.error('Error rating resource:', error);
            alert('Error al calificar el recurso');
        }
        finally {
            setLoading(false);
        }
    };
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };
    const canRate = hasPermission('rate:resources');
    return (_jsxs("div", { className: "flex items-center gap-1", children: [mode === 'interactive' && canRate ? (_jsx("button", { onClick: () => handleRate(true), disabled: loading, className: `${sizeClasses[size]} text-yellow-400 hover:text-yellow-500 transition-colors disabled:opacity-50`, title: user ? "Calificar recurso" : "Inicia sesión para calificar", children: _jsx(Star, { fill: "currentColor" }) })) : mode === 'interactive' && !canRate ? (_jsx("div", { className: `${sizeClasses[size]} text-gray-400 cursor-not-allowed`, title: !user ? "Inicia sesión para calificar" : "No tienes permisos para calificar", children: _jsx(Star, { fill: "currentColor" }) })) : (_jsx(Star, { className: `${sizeClasses[size]} text-yellow-400`, fill: "currentColor" })), _jsx("span", { className: "text-sm text-gray-600 font-medium", children: starCount })] }));
};
export default RatingComponent;
