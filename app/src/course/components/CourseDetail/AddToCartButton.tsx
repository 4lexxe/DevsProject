import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
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

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addCourseToCart(parseInt(courseId));
      setAdded(true);
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding course to cart:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

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
