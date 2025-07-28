import React, { useState } from 'react';
import { ShoppingCart, Check, AlertCircle, X, BookOpen } from 'lucide-react';
import { addCourseToCart } from '@/course/services/cartService';

interface AddToCartButtonProps {
  courseId: string;
  disabled?: boolean;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  courseId, 
  disabled = false, 
  className = "" 
}) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores previos
      setHasAccess(false); // Limpiar estado de acceso previo
      
      await addCourseToCart(parseInt(courseId));
      setAdded(true);
      
      // Reset the "added" state after 3 seconds
      setTimeout(() => {
        setAdded(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error adding course to cart:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 422) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage?.includes('ya está en el carrito')) {
          setError('Ya está en tu carrito');
        } else if (errorMessage?.includes('Ya tienes acceso a este curso')) {
          setHasAccess(true);
          setError(null); // No mostrar como error, sino como estado especial
        } else if (errorMessage?.includes('no está disponible')) {
          setError('Curso no disponible');
        } else {
          setError('Error de validación');
        }
      } else if (error.response?.status === 404) {
        setError('Curso no encontrado');
      } else if (error.response?.status === 401) {
        setError('Inicia sesión para agregar');
      } else {
        setError('Error al agregar');
      }
      
      // Limpiar el error después de 4 segundos
      setTimeout(() => {
        setError(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  // Estado de éxito
  if (added) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-500 text-white ${className}`}
      >
        <Check className="w-5 h-5" />
        Agregado al carrito
      </button>
    );
  }

  // Estado cuando ya tiene acceso al curso
  if (hasAccess) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-500 text-white ${className}`}
      >
        <BookOpen className="w-5 h-5" />
        Ya tienes acceso
      </button>
    );
  }

  // Estado de error
  if (error) {
    return (
      <button
        onClick={() => {
          setError(null);
          setHasAccess(false);
        }}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-red-500 hover:bg-red-600 text-white ${className}`}
      >
        <AlertCircle className="w-5 h-5" />
        {error}
      </button>
    );
  }

  // Estado normal/cargando
  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 
        ${loading || disabled 
          ? 'bg-gray-400 cursor-not-allowed text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
        } ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Agregando...
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Agregar a la cesta
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
